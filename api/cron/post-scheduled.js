const { postTweet } = require('../../lib/twitter');
const { getToday, setToday, isKVConfigured, addToHistory, isDuplicate } = require('../../lib/kv');

module.exports = async function handler(req, res) {
  if (req.headers.authorization !== `Bearer ${process.env.CRON_SECRET}`) {
    return res.status(401).json({ error: 'unauthorized' });
  }

  if (!isKVConfigured()) {
    return res.status(500).json({ error: 'KV not configured' });
  }

  try {
    const today = await getToday();
    if (!today || !today.slots) {
      return res.status(200).json({ message: 'no posts for today' });
    }

    const now = new Date();
    const currentUTC = now.getUTCHours() + now.getUTCMinutes() / 60;

    let posted = [];
    let skipped = [];

    for (let i = 0; i < today.slots.length; i++) {
      const slot = today.slots[i];
      if (slot.status === 'posted') continue;
      if (slot.status !== 'approved' && slot.status !== 'pending') continue;

      const postAt = slot.postAtUTC;
      if (postAt === undefined || postAt === null) continue;
      if (currentUTC < postAt) continue;

      const dup = await isDuplicate(slot.text);
      if (dup) {
        console.log(`slot ${i} skipped: duplicate detected`);
        skipped.push({ slot: i, reason: 'duplicate' });
        continue;
      }

      const result = await postTweet(slot.text);
      await addToHistory(slot.text);
      today.slots[i].status = 'posted';
      today.slots[i].tweetId = result.data.id;
      posted.push({ slot: i, tweetId: result.data.id });
      console.log(`slot ${i} posted:`, slot.text);
    }

    if (posted.length > 0 || skipped.length > 0) {
      await setToday(today);
    }

    return res.status(200).json({
      success: true,
      posted,
      skipped,
      message: posted.length === 0 ? 'nothing to post right now' : `posted ${posted.length} slot(s)`,
    });
  } catch (e) {
    console.error('post-scheduled cron error:', e);
    return res.status(500).json({ error: e.message });
  }
};
