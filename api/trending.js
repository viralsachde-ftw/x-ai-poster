const { getTrendingTopics } = require('../lib/topics');

module.exports = async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'method not allowed' });
  }

  try {
    const topics = await getTrendingTopics();
    return res.status(200).json({ topics });
  } catch (e) {
    console.error('trending error:', e);
    return res.status(500).json({ error: e.message });
  }
};
