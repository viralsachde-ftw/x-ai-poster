const { isKVConfigured, getStats } = require('../lib/kv');

module.exports = async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'method not allowed' });
  }

  if (!isKVConfigured()) {
    return res.status(200).json({ configured: false });
  }

  try {
    const stats = await getStats();
    return res.status(200).json({ configured: true, ...stats });
  } catch (e) {
    console.error('stats error:', e);
    return res.status(500).json({ error: e.message });
  }
};
