const { generatePost } = require('../lib/grok');
const { buildPrompt, buildTrendingPrompt } = require('../lib/prompts');
const { pickRandomTopics, getTrendingTopics } = require('../lib/topics');

module.exports = async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'method not allowed' });
  }

  try {
    const { mode, format, context } = req.body;

    let prompt;
    let topicUsed;

    if (mode === 'trending') {
      const topics = await getTrendingTopics();
      topicUsed = topics;
      prompt = buildTrendingPrompt(topics, format || 'auto');
    } else if (mode === 'custom' && context) {
      topicUsed = context;
      prompt = buildPrompt(context, format || 'auto');
    } else {
      const topics = pickRandomTopics(2);
      topicUsed = topics.join(', ');
      prompt = buildPrompt(topics.join(' and '), format || 'auto');
    }

    const post = await generatePost(prompt);
    return res.status(200).json({ post, topic: topicUsed });
  } catch (e) {
    console.error('generate error:', e);
    return res.status(500).json({ error: e.message });
  }
};
