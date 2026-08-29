const { generatePost } = require('../../lib/grok');
const { buildPrompt, buildTrendingPrompt } = require('../../lib/prompts');
const { pickRandomTopics, getTrendingTopics } = require('../../lib/topics');
const { setToday, isKVConfigured } = require('../../lib/kv');

const SLOT_TYPES = ['daily', 'daily', 'trending'];
const SLOT_TIMES = ['10:00 AM', '3:00 PM', '8:00 PM'];

module.exports = async function handler(req, res) {
  if (req.headers.authorization !== `Bearer ${process.env.CRON_SECRET}`) {
    return res.status(401).json({ error: 'unauthorized' });
  }

  if (!isKVConfigured()) {
    return res.status(500).json({ error: 'KV not configured' });
  }

  try {
    const now = new Date();
    const dateStr = now.toISOString().split('T')[0];
    const slots = [];

    for (let i = 0; i < 3; i++) {
      let prompt, topic;
      if (SLOT_TYPES[i] === 'trending') {
        const topics = await getTrendingTopics();
        topic = topics.join(', ');
        prompt = buildTrendingPrompt(topics, 'auto');
      } else {
        const topics = pickRandomTopics(2);
        topic = topics.join(', ');
        prompt = buildPrompt(topics.join(' and '), 'auto');
      }
      const text = await generatePost(prompt);
      slots.push({
        text,
        topic,
        type: SLOT_TYPES[i],
        status: 'pending',
        scheduledTime: SLOT_TIMES[i],
      });
    }

    const data = { date: dateStr, slots };
    await setToday(data);

    console.log('daily posts generated:', slots.map((s) => s.text));
    return res.status(200).json({ success: true, data });
  } catch (e) {
    console.error('generate-daily cron error:', e);
    return res.status(500).json({ error: e.message });
  }
};
