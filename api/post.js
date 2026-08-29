const { postTweet } = require('../lib/twitter');
const { isDuplicate, addToHistory, isKVConfigured } = require('../lib/kv');

module.exports = async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'method not allowed' });
  }

  try {
    const { text } = req.body;
    if (!text || text.length === 0) {
      return res.status(400).json({ error: 'text is required' });
    }
    if (text.length > 280) {
      return res.status(400).json({ error: 'post exceeds 280 characters' });
    }

    if (isKVConfigured()) {
      const dup = await isDuplicate(text);
      if (dup) {
        return res.status(400).json({
          error: 'duplicate post detected — this text is too similar to a recent post',
        });
      }
    }

    const result = await postTweet(text);

    if (isKVConfigured()) {
      await addToHistory(text);
    }

    return res.status(200).json({
      success: true,
      tweetId: result.data.id,
      url: result.data.id ? `https://x.com/i/status/${result.data.id}` : null,
    });
  } catch (e) {
    console.error('post error:', e);
    return res.status(500).json({ error: e.message });
  }
};
