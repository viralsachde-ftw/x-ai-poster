async function postTweet(text) {
  const cronSecret = process.env.CRON_SECRET;
  if (!cronSecret) {
    throw new Error('CRON_SECRET not set');
  }

  const baseUrl = process.env.VERCEL_URL
    ? `https://${process.env.VERCEL_URL}`
    : 'http://localhost:3000';

  const headers = {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${cronSecret}`,
  };

  const bypassSecret = process.env.VERCEL_AUTOMATION_BYPASS_SECRET;
  if (bypassSecret) {
    headers['x-vercel-protection-bypass'] = bypassSecret;
  }

  const res = await fetch(`${baseUrl}/api/tweet`, {
    method: 'POST',
    headers,
    body: JSON.stringify({ text }),
    signal: AbortSignal.timeout(60000),
  });

  let data;
  try {
    const body = await res.text();
    data = JSON.parse(body);
  } catch {
    throw new Error(`tweet endpoint returned invalid response (status ${res.status})`);
  }

  if (!data.success) {
    let errMsg = data.error;
    if (errMsg && typeof errMsg === 'object') {
      errMsg = errMsg.message || errMsg.code || JSON.stringify(errMsg);
    }
    throw new Error(errMsg || `posting failed (status ${res.status})`);
  }

  return { data: { id: data.tweet_id || null } };
}

module.exports = { postTweet };
