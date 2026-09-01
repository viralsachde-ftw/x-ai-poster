const { generatePost } = require('../lib/grok');
const { buildPrompt, buildTrendingPrompt } = require('../lib/prompts');
const { pickRandomTopics, getTrendingTopics } = require('../lib/topics');
const { getToday, setToday, isKVConfigured, addToHistory, isDuplicate } = require('../lib/kv');

const SLOT_TYPES = ['daily', 'daily', 'trending'];
const SLOT_TIMES = ['10:00 AM', '3:00 PM', '8:00 PM'];
const SLOT_WINDOWS = [
  [4.0, 5.0],
  [9.0, 10.0],
  [14.0, 15.0],
];

function randomInRange(min, max) {
  return min + Math.random() * (max - min);
}

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
  let text = await generatePost(prompt);
  let retries = 0;
  while (await isDuplicate(text) && retries < 3) {
    text = await generatePost(prompt);
    retries++;
  }
  return { text, topic, type };
}

module.exports = async function handler(req, res) {
  try {
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
      const now = new Date();
      const dateStr = now.toISOString().split('T')[0];
      const slots = [];
      for (let i = 0; i < 3; i++) {
        const post = await generateSlotPost(SLOT_TYPES[i]);
        const [winMin, winMax] = SLOT_WINDOWS[i];
        slots.push({
          text: post.text,
          topic: post.topic,
          type: post.type,
          status: 'pending',
          scheduledTime: SLOT_TIMES[i],
          postAtUTC: randomInRange(winMin, winMax),
        });
      }
      const data = { date: dateStr, slots };
      await setToday(data);
      return res.status(200).json(data);
    }

    if (action === 'regenerate' && typeof slot === 'number' && slot >= 0 && slot < 3) {
      const today = await getToday();
      if (!today) {
        return res.status(400).json({ error: 'no posts generated today' });
      }
      const post = await generateSlotPost(SLOT_TYPES[slot]);
      const existingPostAt = today.slots[slot].postAtUTC;
      today.slots[slot] = {
        text: post.text,
        topic: post.topic,
        type: post.type,
        status: 'pending',
        scheduledTime: SLOT_TIMES[slot],
        postAtUTC: existingPostAt || randomInRange(...SLOT_WINDOWS[slot]),
      };
      await setToday(today);
      return res.status(200).json(today);
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

    if (action === 'prepare_post' && typeof slot === 'number' && slot >= 0 && slot < 3) {
      const today = await getToday();
      if (!today) {
        return res.status(400).json({ error: 'no posts generated today' });
      }
      const s = today.slots[slot];
      if (s.status === 'posted') {
        return res.status(400).json({ error: 'already posted' });
      }
      const dup = await isDuplicate(s.text);
      if (dup) {
        return res.status(400).json({ error: 'duplicate post — regenerate before posting' });
      }
      return res.status(200).json({ text: s.text, slot });
    }

    if (action === 'mark_posted' && typeof slot === 'number' && slot >= 0 && slot < 3) {
      const today = await getToday();
      if (!today) {
        return res.status(400).json({ error: 'no posts generated today' });
      }
      const { tweetId } = req.body;
      await addToHistory(today.slots[slot].text);
      today.slots[slot].status = 'posted';
      today.slots[slot].tweetId = tweetId || null;
      await setToday(today);
      return res.status(200).json({
        ...today,
        postedUrl: tweetId ? `https://x.com/i/status/${tweetId}` : null,
      });
    }

    return res.status(400).json({ error: 'invalid action' });
  } catch (e) {
    console.error('today api error:', e);
    return res.status(500).json({ error: e.message });
  }
};
