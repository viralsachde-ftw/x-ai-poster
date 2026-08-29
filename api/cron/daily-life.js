const { generatePost } = require('../../lib/grok');
const { buildPrompt } = require('../../lib/prompts');
const { pickRandomTopics } = require('../../lib/topics');
const { postTweet } = require('../../lib/twitter');

module.exports = async function handler(req, res) {
  if (req.headers.authorization !== `Bearer ${process.env.CRON_SECRET}`) {
    return res.status(401).json({ error: 'unauthorized' });
  }

  try {
    const topics = pickRandomTopics(2);
    const prompt = buildPrompt(topics.join(' and '), 'auto');
    const post = await generatePost(prompt);
    const result = await postTweet(post);

    console.log('daily life post sent:', post);
    return res.status(200).json({
      success: true,
      post,
      tweetId: result.data.id,
    });
  } catch (e) {
    console.error('daily life cron error:', e);
    return res.status(500).json({ error: e.message });
  }
};
