async function kvCommand(...args) {
  const url = process.env.KV_REST_API_URL;
  const token = process.env.KV_REST_API_TOKEN;
  if (!url || !token) return null;
  const res = await fetch(url, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(args),
  });
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
  return !!(process.env.KV_REST_API_URL && process.env.KV_REST_API_TOKEN);
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

module.exports = { getToday, setToday, isKVConfigured, addToHistory, isDuplicate };
