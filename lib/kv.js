const net = require('net');
const tls = require('tls');

let redisClient = null;

function getRedisConfig() {
  const redisUrl = process.env.REDIS_URL
    || process.env.KV_URL
    || process.env.UPSTASH_REDIS_REST_URL;
  if (!redisUrl) return null;

  try {
    const parsed = new URL(redisUrl);
    return {
      host: parsed.hostname,
      port: parseInt(parsed.port, 10) || 6379,
      password: parsed.password ? decodeURIComponent(parsed.password) : null,
      useTLS: parsed.protocol === 'rediss:',
    };
  } catch {
    return null;
  }
}

function isKVConfigured() {
  const restUrl = process.env.KV_REST_API_URL
    || process.env.KV_REST_URL
    || process.env.UPSTASH_REDIS_REST_URL;
  const restToken = process.env.KV_REST_API_TOKEN
    || process.env.KV_REST_TOKEN
    || process.env.UPSTASH_REDIS_REST_TOKEN;
  if (restUrl && restToken) return true;
  return !!getRedisConfig();
}

function parseRESP(data) {
  const str = data.toString();
  const type = str[0];
  const rest = str.slice(1);

  if (type === '+') return rest.split('\r\n')[0];
  if (type === '-') throw new Error(rest.split('\r\n')[0]);
  if (type === ':') return parseInt(rest.split('\r\n')[0], 10);
  if (type === '$') {
    const lines = rest.split('\r\n');
    const len = parseInt(lines[0], 10);
    if (len === -1) return null;
    return lines[1];
  }
  if (type === '*') {
    const lines = rest.split('\r\n');
    const count = parseInt(lines[0], 10);
    if (count === -1) return null;
    const results = [];
    let idx = 1;
    for (let i = 0; i < count; i++) {
      const t = lines[idx][0];
      if (t === '$') {
        const len = parseInt(lines[idx].slice(1), 10);
        idx++;
        if (len === -1) {
          results.push(null);
        } else {
          results.push(lines[idx]);
          idx++;
        }
      } else if (t === ':') {
        results.push(parseInt(lines[idx].slice(1), 10));
        idx++;
      } else if (t === '+') {
        results.push(lines[idx].slice(1));
        idx++;
      } else {
        idx++;
      }
    }
    return results;
  }
  return str;
}

function buildCommand(args) {
  let cmd = `*${args.length}\r\n`;
  for (const arg of args) {
    const s = String(arg);
    cmd += `$${Buffer.byteLength(s)}\r\n${s}\r\n`;
  }
  return cmd;
}

function tcpCommand(config, ...args) {
  return new Promise((resolve, reject) => {
    const timeout = setTimeout(() => {
      socket.destroy();
      reject(new Error('redis connection timed out'));
    }, 10000);

    const connectOpts = { host: config.host, port: config.port };
    const socket = config.useTLS
      ? tls.connect(connectOpts, onConnect)
      : net.connect(connectOpts, onConnect);

    let authenticated = false;
    let buffer = Buffer.alloc(0);

    function onConnect() {
      if (config.password) {
        socket.write(buildCommand(['AUTH', config.password]));
      } else {
        authenticated = true;
        socket.write(buildCommand(args));
      }
    }

    socket.on('data', (chunk) => {
      buffer = Buffer.concat([buffer, chunk]);
      try {
        if (!authenticated && config.password) {
          const authResp = buffer.toString();
          if (authResp.startsWith('+OK')) {
            authenticated = true;
            buffer = Buffer.alloc(0);
            socket.write(buildCommand(args));
            return;
          }
          if (authResp.startsWith('-')) {
            clearTimeout(timeout);
            socket.destroy();
            reject(new Error('redis auth failed: ' + authResp.slice(1).trim()));
            return;
          }
          return;
        }

        const result = parseRESP(buffer);
        clearTimeout(timeout);
        socket.destroy();
        resolve(result);
      } catch (e) {
        // might not have full response yet, wait for more data
      }
    });

    socket.on('error', (e) => {
      clearTimeout(timeout);
      reject(new Error('redis connection failed: ' + e.message));
    });

    socket.on('close', () => {
      clearTimeout(timeout);
    });
  });
}

async function restCommand(...args) {
  const url = process.env.KV_REST_API_URL
    || process.env.KV_REST_URL
    || process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.KV_REST_API_TOKEN
    || process.env.KV_REST_TOKEN
    || process.env.UPSTASH_REDIS_REST_TOKEN;

  let res;
  try {
    res = await fetch(url, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(args),
    });
  } catch (e) {
    console.error('kv fetch failed:', e.message, 'url:', url);
    throw new Error('KV connection failed — check env vars');
  }
  if (!res.ok) {
    const text = await res.text().catch(() => '');
    console.error('kv error:', res.status, text, 'url:', url);
    throw new Error(`KV error (${res.status}): ${text || 'check credentials'}`);
  }
  const data = await res.json();
  return data.result;
}

async function kvCommand(...args) {
  const restUrl = process.env.KV_REST_API_URL
    || process.env.KV_REST_URL
    || process.env.UPSTASH_REDIS_REST_URL;
  const restToken = process.env.KV_REST_API_TOKEN
    || process.env.KV_REST_TOKEN
    || process.env.UPSTASH_REDIS_REST_TOKEN;

  if (restUrl && restToken) {
    return restCommand(...args);
  }

  const config = getRedisConfig();
  if (!config) return null;
  return tcpCommand(config, ...args);
}

async function getToday() {
  const raw = await kvCommand('GET', 'posts:today');
  if (!raw) return null;
  try { return JSON.parse(raw); } catch { return null; }
}

async function setToday(data) {
  await kvCommand('SET', 'posts:today', JSON.stringify(data), 'EX', 86400);
}

function normalize(text) {
  return text.toLowerCase().trim().replace(/\s+/g, ' ');
}

function getWords(text) {
  return normalize(text).split(' ').filter((w) => w.length > 2);
}

function similarity(a, b) {
  const wordsA = new Set(getWords(a));
  const wordsB = new Set(getWords(b));
  if (wordsA.size === 0 || wordsB.size === 0) return 0;
  let intersection = 0;
  for (const w of wordsA) {
    if (wordsB.has(w)) intersection++;
  }
  const union = new Set([...wordsA, ...wordsB]).size;
  return intersection / union;
}

async function getPostHistory() {
  const raw = await kvCommand('GET', 'posts:history');
  if (!raw) return [];
  try { return JSON.parse(raw); } catch { return []; }
}

async function addToHistory(text) {
  const history = await getPostHistory();
  history.push(normalize(text));
  const trimmed = history.slice(-200);
  await kvCommand('SET', 'posts:history', JSON.stringify(trimmed));
}

async function isDuplicate(text) {
  if (!isKVConfigured()) return false;
  const history = await getPostHistory();
  const norm = normalize(text);
  for (const past of history) {
    if (past === norm) return true;
    if (similarity(norm, past) > 0.75) return true;
  }
  return false;
}

async function getStats() {
  const history = await getPostHistory();
  const today = await getToday();
  const posted = today ? today.slots.filter((s) => s.status === 'posted').length : 0;
  const pending = today ? today.slots.filter((s) => s.status === 'pending').length : 0;
  const approved = today ? today.slots.filter((s) => s.status === 'approved').length : 0;
  return {
    totalPosts: history.length,
    maxHistory: 200,
    todayPosted: posted,
    todayPending: pending,
    todayApproved: approved,
    todayDate: today ? today.date : null,
  };
}

module.exports = { getToday, setToday, isKVConfigured, addToHistory, isDuplicate, getStats };
