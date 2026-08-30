async function generatePost(prompt) {
  if (!process.env.XAI_API_KEY) {
    throw new Error('XAI_API_KEY not set. get one from console.x.ai');
  }

  let response;
  try {
    response = await fetch('https://api.x.ai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.XAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'grok-3-mini',
        messages: [{ role: 'user', content: prompt }],
        max_tokens: 512,
        temperature: 0.9,
      }),
      signal: AbortSignal.timeout(8000),
    });
  } catch (e) {
    if (e.name === 'TimeoutError') {
      throw new Error('grok api timed out (8s). try again.');
    }
    throw new Error(`grok api unreachable: ${e.message}`);
  }

  if (!response.ok) {
    const err = await response.text().catch(() => '');
    if (response.status === 401) {
      throw new Error('invalid XAI_API_KEY. check console.x.ai');
    }
    if (response.status === 429) {
      throw new Error('grok rate limit hit. wait a minute and try again.');
    }
    throw new Error(`grok api error (${response.status}): ${err}`);
  }

  let data;
  try {
    data = await response.json();
  } catch {
    throw new Error('grok api returned invalid response');
  }

  if (!data.choices || !data.choices[0] || !data.choices[0].message) {
    throw new Error('grok api returned empty response');
  }

  let text = data.choices[0].message.content.trim();
  text = text.replace(/^["']|["']$/g, '');
  return text;
}

module.exports = { generatePost };
