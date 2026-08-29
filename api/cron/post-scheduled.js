const { postTweet } = require('../../lib/twitter');
const { getToday, setToday, isKVConfigured } = require('../../lib/kv');

const SLOT_UTC_HOURS = [4.5, 9.5, 14.5];

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
    const currentHourUTC = now.getUTCHours() + now.getUTCMinutes() / 60;

    let posted = [];

    for (let i = 0; i < today.slots.length; i++) {
      const slot = today.slots[i];
      if (slot.status === 'posted') continue;

      const slotHour = SLOT_UTC_HOURS[i];
      if (currentHourUTC < slotHour) continue;
      if (currentHourUTC > slotHour + 1) continue;

      if (slot.status === 'approved' || slot.status === 'pending') {
        const result = await postTweet(slot.text);
        today.slots[i].status = 'posted';
        today.slots[i].tweetId = result.data.id;
        posted.push({ slot: i, tweetId: result.data.id });
        console.log(`slot ${i} posted:`, slot.text);
      }
    }

    if (posted.length > 0) {
      await setToday(today);
    }

    return res.status(200).json({
      success: true,
      posted,
      message: posted.length === 0 ? 'nothing to post right now' : `posted ${posted.length} slot(s)`,
    });
  } catch (e) {
    console.error('post-scheduled cron error:', e);
    return res.status(500).json({ error: e.message });
  }
};
