async function postTweet(text) {
  const url = process.env.X_AUTOMATION_URL;
  const apiKey = process.env.X_AUTOMATION_API_KEY;

  if (!url || !apiKey) {
    throw new Error('X_AUTOMATION_URL and X_AUTOMATION_API_KEY must be set');
  }

  const endpoint = `${url.replace(/\/+$/, '')}/tweet`;
  const res = await fetch(endpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': apiKey,
    },
    body: JSON.stringify({ text }),
  });

  const data = await res.json();

  if (!res.ok || !data.success) {
    const errType = data.error_type || 'UNKNOWN';
    const errMsg = data.message || data.error || JSON.stringify(data);
    throw new Error(`${errType}: ${errMsg}`);
  }

  return { data: { id: data.tweet_id } };
}

module.exports = { postTweet };
