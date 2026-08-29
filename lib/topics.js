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

// block serious/sensitive topics and indian politics (global politics is fine)
const SKIP_KEYWORDS = [
  // disasters and tragedy
  'flood', 'floods', 'earthquake', 'tsunami', 'cyclone', 'landslide',
  'drought', 'famine', 'starvation', 'refugee', 'relief', 'stranded',
  'rescue', 'rescued', 'missing persons',
  // crime and violence
  'rape', 'murder', 'killed', 'killing', 'dead body', 'death toll',
  'attack', 'terror', 'bomb', 'blast', 'shooting', 'lynching',
  'mob violence', 'riot', 'communal',
  'arrest', 'arrested', 'jail', 'prison', 'scam', 'fraud',
  'abuse', 'assault', 'harassment', 'trafficking', 'victim',
  'isis', 'taliban', 'militant', 'extremist', 'hostage',
  // health tragedies
  'suicide', 'pmdd', 'agony',
  'pandemic', 'epidemic', 'outbreak', 'h1n1', 'covid',
  // indian politics (block these specifically)
  'modi', 'rahul gandhi', 'kejriwal', 'mamata', 'yogi',
  'bjp', 'congress party', 'aap party', 'rss', 'jdu', 'nda', 'india bloc',
  'lok sabha', 'rajya sabha', 'parliament session',
  'chief minister', 'union minister', 'governor',
  'manuwadi', 'valmiki', 'dalit',
  'caste', 'reservation',
  'telangana congress', 'karnataka minister',
  'smear campaign', 'oust me from cabinet',
  'isi links', 'espionage',
  // war zones (when they're about casualties/suffering)
  'gaza casualties', 'civilian deaths',
];

function isLightTopic(title) {
  const lower = title.toLowerCase();
  return !SKIP_KEYWORDS.some((kw) => lower.includes(kw));
}

function pickRandomTopics(count = 1) {
  const shuffled = [...DAILY_LIFE_TOPICS].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
}

async function fetchRSS(url) {
  const response = await fetch(url, {
    headers: { 'User-Agent': 'Mozilla/5.0' },
    redirect: 'follow',
  });

  if (!response.ok) {
    throw new Error(`rss fetch returned ${response.status}`);
  }

  const xml = await response.text();
  const topics = [];
  const itemRegex = /<item>[\s\S]*?<\/item>/g;
  const titleRegex = /<title><!\[CDATA\[(.*?)\]\]><\/title>|<title>(.*?)<\/title>/;
  const trafficRegex = /<ht:approx_traffic>(.*?)<\/ht:approx_traffic>/;

  let match;
  while ((match = itemRegex.exec(xml)) !== null && topics.length < 30) {
    const item = match[0];
    const titleMatch = titleRegex.exec(item);
    const trafficMatch = trafficRegex.exec(item);
    const title = titleMatch ? (titleMatch[1] || titleMatch[2]) : '';
    const traffic = trafficMatch ? trafficMatch[1] : '';
    if (title && isLightTopic(title)) {
      topics.push(traffic ? `${title} (${traffic} searches)` : title);
    }
  }

  return topics;
}

async function getTrendingTopics() {
  const feeds = [
    'https://trends.google.com/trending/rss?geo=IN',
    'https://news.google.com/rss/topics/CAAqBwgKMJ_m9Aww4fW5BA?hl=en-IN&gl=IN&ceid=IN:en',
    'https://news.google.com/rss/topics/CAAqBwgKMKHL9QwwptC1BA?hl=en-IN&gl=IN&ceid=IN:en',
    'https://news.google.com/rss/topics/CAAqBwgKMPSE_Qow4cax?hl=en-IN&gl=IN&ceid=IN:en',
  ];

  const allTopics = [];
  const seen = new Set();

  for (const url of feeds) {
    try {
      const topics = await fetchRSS(url);
      for (const t of topics) {
        const key = t.toLowerCase().replace(/\s*\(.*?\)\s*$/, '').trim();
        if (!seen.has(key)) {
          seen.add(key);
          allTopics.push(t);
        }
      }
    } catch (e) {
      console.error(`rss fetch failed for ${url}:`, e.message);
    }
  }

  if (allTopics.length > 0) {
    return allTopics.slice(0, 20);
  }

  return [
    'latest bollywood movie release',
    'ipl or cricket related news',
    'new phone or gadget launch in india',
    'some celebrity doing something on instagram',
    'a song thats trending on reels right now',
  ];
}

module.exports = { pickRandomTopics, getTrendingTopics, DAILY_LIFE_TOPICS };
