async function generatePost(prompt) {
  const response = await fetch('https://api.x.ai/v1/chat/completions', {
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
  });

  if (!response.ok) {
    const err = await response.text();
    throw new Error(`grok api error (${response.status}): ${err}`);
  }

  const data = await response.json();
  let text = data.choices[0].message.content.trim();
  text = text.replace(/^["']|["']$/g, '');
  return text;
}

module.exports = { generatePost };
