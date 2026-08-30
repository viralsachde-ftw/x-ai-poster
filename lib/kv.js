function parseRedisURL(redisUrl) {
  try {
    const parsed = new URL(redisUrl);
    const host = parsed.hostname;
    const token = decodeURIComponent(parsed.password);
    if (!host || !token) return null;
    return { url: `https://${host}`, token };
  } catch {
    return null;
  }
}

function getKVConfig() {
  const url = process.env.KV_REST_API_URL
    || process.env.KV_REST_URL
    || process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.KV_REST_API_TOKEN
    || process.env.KV_REST_TOKEN
    || process.env.UPSTASH_REDIS_REST_TOKEN;
  if (url && token) return { url, token };
  const redisUrl = process.env.REDIS_URL || process.env.KV_URL;
  if (redisUrl) {
    const parsed = parseRedisURL(redisUrl);
    if (parsed) return parsed;
  }
  return { url, token };
}

async function kvCommand(...args) {
  const { url, token } = getKVConfig();
  if (!url || !token) return null;
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
    throw new Error('KV connection failed — check REDIS_URL or KV env vars');
  }
  if (!res.ok) {
    const text = await res.text().catch(() => '');
    console.error('kv error:', res.status, text, 'url:', url);
    throw new Error(`KV error (${res.status}): ${text || 'check credentials'}`);
  }
  const data = await res.json();
  return data.result;
}

async function getToday() {
  const raw = await kvCommand('GET', 'posts:today');
  if (!raw) return null;
  try { return JSON.parse(raw); } catch { return null; }
}

async function setToday(data) {
  await kvCommand('SET', 'posts:today', JSON.stringify(data), 'EX', 86400);
}

function isKVConfigured() {
  const { url, token } = getKVConfig();
  return !!(url && token);
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
