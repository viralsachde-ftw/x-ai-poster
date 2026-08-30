async function postTweet(text) {
  const cronSecret = process.env.CRON_SECRET;
  if (!cronSecret) {
    throw new Error('CRON_SECRET not set');
  }

  const baseUrl = process.env.VERCEL_URL
    ? `https://${process.env.VERCEL_URL}`
    : 'http://localhost:3000';

  const res = await fetch(`${baseUrl}/api/tweet`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${cronSecret}`,
    },
    body: JSON.stringify({ text }),
    signal: AbortSignal.timeout(60000),
  });

  let data;
  try {
    data = await res.json();
  } catch {
    throw new Error(`tweet endpoint returned invalid response (status ${res.status})`);
  }

  if (!data.success) {
    throw new Error(data.error || 'posting failed');
  }

  return { data: { id: data.tweet_id || null } };
}

module.exports = { postTweet };
