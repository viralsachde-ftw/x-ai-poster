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

module.exports = { getToday, setToday, isKVConfigured };
