const DAILY_LIFE_TOPICS = [
  'gym session today',
  'listening to music on the train',
  'eating alone at a restaurant',
  'sunday evening melancholy',
  'monday morning at work',
  'overthinking at 2am',
  'missing someone you cant text',
  'a random walk through the city at night',
  'cooking something and messing it up',
  'scrolling instagram for too long',
  'the talking stage with someone',
  'getting ghosted',
  'old songs that remind you of someone',
  'watching ppl from a cafe window',
  'being tired for no reason',
  'wanting to quit your job',
  'ordering food again instead of cooking',
  'that one friend who never texts first',
  'gym crush you never talk to',
  'protein shake life',
  'wearing birkenstocks everywhere',
  'rain in bombay',
  'marine drive at night',
  'local train during rush hour',
  'chai at a tapri after work',
  'comparing yourself to ppl on linkedin',
  'deleting a post after 5 minutes',
  'the urge to disappear for a week',
  'rewatching the same movie again',
  'late night drive with no destination',
  'garlic naan at 1am',
  'office slack messages that could have been nothing',
  'biryani debate with friends',
  'vadapav supremacy',
  'haircut that went wrong',
  'buying something you dont need online',
  'the feeling after a good workout',
  'waking up and immediately checking your phone',
  'not knowing what youre doing with your life',
  'quarter life crisis at full speed',
  'childhood nostalgia hitting at random moments',
  'losing touch with old friends',
  'parents getting older and you noticing',
  'finding old chats and cringing',
  'hinge profiles that all look the same',
  'coffee vs chai internal debate',
  'watching a sunset and feeling something but not knowing what',
  'noise cancelling headphones as a lifestyle',
  'that one song on repeat for three days straight',
  'swiggy delivery guy knowing your address by heart',
  'being the last one awake in the house',
  'ahmedabad heat in summer',
  'night walks in ahmedabad',
  'law garden street food run',
  'sabarmati riverfront vibes',
  'auto rides in ahmedabad',
  'the commute that eats your soul',
  'weddings where everyone asks about your life',
  'festivals when you live alone',
  'airports and the feeling of leaving',
  'strangers who feel familiar',
  'dogs you see on your walk every day',
  'the peace of doing absolutely nothing',
  'feeling behind while everyone moves forward',
  'doomscrolling at 3am',
  'a good sunset making everything temporarily okay',
  'close friends story that nobody watches',
  'random purchase that actually made you happy',
  'monsoon in the city',
  'being single and okay with it mostly',
  'the gym playlist that hits different',
  'street food at midnight',
  'that meeting that should have been an email',
  'skincare routine you saw on a reel',
  'perfume that reminds you of someone',
  'coding at 2am because the bug wont let you sleep',
  'late night cravings and empty fridge',
  'the gap between who you are and who you wanted to be',
  'first date anxiety',
  'situationship energy',
  'watching a bollywood movie alone on a weeknight',
  'the silence after everyone leaves',
  'weekend plans that became just sleeping',
  'trying a new cafe alone',
  'the second coffee of the day hitting different',
  'gym bros giving unsolicited advice',
  'supplement stack that costs more than rent',
  'rain on a monday morning commute',
  'traffic at SG highway',
  'manek chowk at midnight',
  'missing bombay from ahmedabad',
  'instagram explore page knowing you too well',
  'that reel you watched seven times',
  'old bollywood songs at the gym',
  'wedding season and the inevitable questions',
  'the last auto driver who overcharged you',
  'finding peace in a crowded city',
];

function pickRandomTopics(count = 1) {
  const shuffled = [...DAILY_LIFE_TOPICS].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
}

async function fetchGoogleTrendsIndia() {
  const url = 'https://trends.google.com/trending/rss?geo=IN';
  const response = await fetch(url, {
    headers: { 'User-Agent': 'Mozilla/5.0' },
    redirect: 'follow',
  });

  if (!response.ok) {
    throw new Error(`google trends returned ${response.status}`);
  }

  const xml = await response.text();
  const topics = [];
  const itemRegex = /<item>[\s\S]*?<\/item>/g;
  const titleRegex = /<title><!\[CDATA\[(.*?)\]\]><\/title>|<title>(.*?)<\/title>/;
  const trafficRegex = /<ht:approx_traffic>(.*?)<\/ht:approx_traffic>/;

  let match;
  while ((match = itemRegex.exec(xml)) !== null && topics.length < 15) {
    const item = match[0];
    const titleMatch = titleRegex.exec(item);
    const trafficMatch = trafficRegex.exec(item);
    const title = titleMatch ? (titleMatch[1] || titleMatch[2]) : '';
    const traffic = trafficMatch ? trafficMatch[1] : '';
    if (title) {
      topics.push(traffic ? `${title} (${traffic} searches)` : title);
    }
  }

  return topics;
}

async function getTrendingTopics() {
  try {
    const topics = await fetchGoogleTrendsIndia();
    if (topics.length > 0) return topics;
  } catch (e) {
    console.error('google trends fetch failed:', e.message);
  }
  return [
    'whatever is happening in indian cricket right now',
    'latest bollywood release or controversy',
    'some tech news everyone is talking about',
    'weather across indian cities',
    'something on indian twitter thats blowing up',
  ];
}

module.exports = { pickRandomTopics, getTrendingTopics, DAILY_LIFE_TOPICS };
