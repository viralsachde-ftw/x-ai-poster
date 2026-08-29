const { postTweet } = require('../lib/twitter');

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

    const result = await postTweet(text);
    return res.status(200).json({
      success: true,
      tweetId: result.data.id,
      url: `https://x.com/i/status/${result.data.id}`,
    });
  } catch (e) {
    console.error('post error:', e);
    return res.status(500).json({ error: e.message });
  }
};
