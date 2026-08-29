const { generatePost } = require('../../lib/grok');
const { buildTrendingPrompt } = require('../../lib/prompts');
const { getTrendingTopics } = require('../../lib/topics');
const { postTweet } = require('../../lib/twitter');

module.exports = async function handler(req, res) {
  if (req.headers.authorization !== `Bearer ${process.env.CRON_SECRET}`) {
    return res.status(401).json({ error: 'unauthorized' });
  }

  try {
    const topics = await getTrendingTopics();
    const prompt = buildTrendingPrompt(topics, 'auto');
    const post = await generatePost(prompt);
    const result = await postTweet(post);

    console.log('trending post sent:', post);
    return res.status(200).json({
      success: true,
      post,
      topics,
      tweetId: result.data.id,
    });
  } catch (e) {
    console.error('trending cron error:', e);
    return res.status(500).json({ error: e.message });
  }
};
