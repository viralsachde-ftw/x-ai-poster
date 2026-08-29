const { generatePost } = require('../lib/grok');
const { buildPrompt, buildTrendingPrompt } = require('../lib/prompts');
const { pickRandomTopics, getTrendingTopics } = require('../lib/topics');
const { postTweet } = require('../lib/twitter');
const { getToday, setToday, isKVConfigured } = require('../lib/kv');

const SLOT_TYPES = ['daily', 'daily', 'trending'];
const SLOT_TIMES = ['10:00 AM', '3:00 PM', '8:00 PM'];

async function generateSlotPost(type) {
  let prompt, topic;
  if (type === 'trending') {
    const topics = await getTrendingTopics();
    topic = topics.join(', ');
    prompt = buildTrendingPrompt(topics, 'auto');
  } else {
    const topics = pickRandomTopics(2);
    topic = topics.join(', ');
    prompt = buildPrompt(topics.join(' and '), 'auto');
  }
  const text = await generatePost(prompt);
  return { text, topic, type };
}

module.exports = async function handler(req, res) {
  if (!isKVConfigured()) {
    return res.status(200).json({ configured: false, slots: [] });
  }

  if (req.method === 'GET') {
    const today = await getToday();
    if (!today) {
      return res.status(200).json({ configured: true, slots: [] });
    }
    return res.status(200).json({ configured: true, ...today });
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'method not allowed' });
  }

  const { action, slot } = req.body;

  if (action === 'generate') {
    try {
      const now = new Date();
      const dateStr = now.toISOString().split('T')[0];
      const slots = [];
      for (let i = 0; i < 3; i++) {
        const post = await generateSlotPost(SLOT_TYPES[i]);
        slots.push({
          text: post.text,
          topic: post.topic,
          type: post.type,
          status: 'pending',
          scheduledTime: SLOT_TIMES[i],
        });
      }
      const data = { date: dateStr, slots };
      await setToday(data);
      return res.status(200).json(data);
    } catch (e) {
      console.error('generate today error:', e);
      return res.status(500).json({ error: e.message });
    }
  }

  if (action === 'regenerate' && typeof slot === 'number' && slot >= 0 && slot < 3) {
    try {
      const today = await getToday();
      if (!today) {
        return res.status(400).json({ error: 'no posts generated today' });
      }
      const post = await generateSlotPost(SLOT_TYPES[slot]);
      today.slots[slot] = {
        text: post.text,
        topic: post.topic,
        type: post.type,
        status: 'pending',
        scheduledTime: SLOT_TIMES[slot],
      };
      await setToday(today);
      return res.status(200).json(today);
    } catch (e) {
      console.error('regenerate slot error:', e);
      return res.status(500).json({ error: e.message });
    }
  }

  if (action === 'approve' && typeof slot === 'number' && slot >= 0 && slot < 3) {
    const today = await getToday();
    if (!today) {
      return res.status(400).json({ error: 'no posts generated today' });
    }
    today.slots[slot].status = 'approved';
    await setToday(today);
    return res.status(200).json(today);
  }

  if (action === 'approve_all') {
    const today = await getToday();
    if (!today) {
      return res.status(400).json({ error: 'no posts generated today' });
    }
    today.slots.forEach((s) => {
      if (s.status === 'pending') s.status = 'approved';
    });
    await setToday(today);
    return res.status(200).json(today);
  }

  if (action === 'post_now' && typeof slot === 'number' && slot >= 0 && slot < 3) {
    try {
      const today = await getToday();
      if (!today) {
        return res.status(400).json({ error: 'no posts generated today' });
      }
      const s = today.slots[slot];
      if (s.status === 'posted') {
        return res.status(400).json({ error: 'already posted' });
      }
      const result = await postTweet(s.text);
      today.slots[slot].status = 'posted';
      today.slots[slot].tweetId = result.data.id;
      await setToday(today);
      return res.status(200).json({
        ...today,
        postedUrl: `https://x.com/i/status/${result.data.id}`,
      });
    } catch (e) {
      console.error('post now error:', e);
      return res.status(500).json({ error: e.message });
    }
  }

  return res.status(400).json({ error: 'invalid action' });
};
