const DAILY_LIFE_TOPICS = [
  // gym and fitness
  'gym session today',
  'leg day and regretting it already',
  'gym crush you never talk to',
  'gym bros giving unsolicited advice',
  'protein shake that tastes like chalk',
  'supplement stack that costs more than rent',
  'the feeling after a good workout',
  'skipping gym and feeling guilty all day',
  'gym playlist that hits different',
  'old bollywood songs at the gym',
  'that one guy hogging the squat rack',
  'bench press ego lift gone wrong',
  'pre workout hitting too hard at 10pm',
  'measuring progress in the mirror every day',
  'gym mirror selfie you almost posted',
  'cardio is boring and nobody can change my mind',
  'running on the treadmill thinking about life',
  'foam rolling and pretending its not painful',
  'rest day guilt',
  'watching gym reels instead of actually going',
  'creatine loading phase making you bloated',
  'that post workout hunger that wont stop',

  // music and songs
  'listening to music on the train',
  'that one song on repeat for three days straight',
  'old songs that remind you of someone',
  'sad songs at 2am hitting different',
  'discovering a new artist and playing their entire discography',
  'noise cancelling headphones as a lifestyle',
  'a song came on shuffle and ruined my whole mood',
  'making a playlist for someone who will never hear it',
  'bollywood songs from 2010 era were peak',
  'that one arijit singh song that gets you every time',
  'listening to the same album on loop for a week',
  'airpods dying at the worst possible moment',
  'the song that played during your last breakup',
  'spotify wrapped revealing your sad boy hours',
  'humming a song all day but not remembering its name',
  'concert tickets you cant afford',
  'singing in the shower like youre performing at coachella',
  'that friend who controls the aux and plays trash',

  // food and eating
  'garlic naan at 1am',
  'biryani debate with friends',
  'vadapav supremacy',
  'ordering food again instead of cooking',
  'cooking something and messing it up',
  'swiggy delivery guy knowing your address by heart',
  'late night cravings and empty fridge',
  'street food at midnight',
  'law garden street food run',
  'manek chowk at midnight',
  'eating alone at a restaurant',
  'chai at a tapri after work',
  'the second coffee of the day hitting different',
  'coffee vs chai internal debate',
  'maggi at 3am solving all problems temporarily',
  'pani puri from that one specific stall',
  'butter chicken is overrated there i said it',
  'that one restaurant you keep going back to',
  'dabba from home vs office canteen',
  'cutting chai on a rainy evening',
  'ice cream at midnight because why not',
  'trying to eat healthy and giving up by lunch',
  'zomato gold membership carrying your social life',
  'food coma after a big meal',
  'the audacity of restaurant portions these days',
  'samosa from the office canteen being the highlight of the day',
  'dessert stomach is real and i will die on this hill',
  'that specific bhurji pav place near the station',
  'khichdi when youre sick hits different than any other time',

  // office and work
  'monday morning at work',
  'that meeting that should have been an email',
  'office slack messages that could have been nothing',
  'wanting to quit your job',
  'comparing yourself to ppl on linkedin',
  'the commute that eats your soul',
  'work from home day being the best day',
  'pretending to look busy when the boss walks by',
  'replying "sounds good" to an email you didnt read',
  'lunch break being the only reason you survive',
  'that one coworker who overshares everything',
  'annual appraisal anxiety',
  'salary coming in and disappearing the same day',
  'opening laptop on a monday and wanting to close it immediately',
  'corporate jargon making you lose braincells',
  'zoom calls with camera off living your best life',
  'taking a "bio break" thats actually a 20 minute scroll session',
  'the guy who replies all on company emails',
  'friday evening feeling vs sunday evening dread',
  'office AC being either arctic or sahara no in between',
  'passive aggressive emails from that one manager',
  'pretending to take notes in a meeting while doodling',

  // city life bombay and ahmedabad
  'rain in bombay',
  'marine drive at night',
  'local train during rush hour',
  'ahmedabad heat in summer',
  'night walks in ahmedabad',
  'sabarmati riverfront vibes',
  'auto rides in ahmedabad',
  'traffic at SG highway',
  'missing bombay from ahmedabad',
  'monsoon in the city',
  'finding peace in a crowded city',
  'the last auto driver who overcharged you',
  'late night drive with no destination',
  'bombay rains and flooded streets but you still love this city',
  'bandra to andheri in peak traffic testing your patience',
  'carter road on a sunday evening',
  'juhu beach at sunset with too many people',
  'the smell of bombay after the first rain',
  'ahmedabad winter mornings with chai',
  'rickshaw drivers who take the longest route possible',
  'potholes deeper than your existential crisis',
  'that one shortcut only locals know about',
  'moving to a new city and missing home food',
  'the sound of the city at 4am when everything is quiet',
  'walking through old parts of the city and feeling something',
  'bombay local train friendships that exist only on the train',
  'the chaos of a bombay bus stop',
  'sg highway flyover at night with the windows down',
  'ahmedabad to bombay flight and the shift in energy',
  'south bombay vs suburbs debate',

  // dating and relationships
  'the talking stage with someone',
  'getting ghosted',
  'first date anxiety',
  'situationship energy',
  'hinge profiles that all look the same',
  'missing someone you cant text',
  'wanting to text someone but not texting',
  'being single and okay with it mostly',
  'that person who watches all your stories but never texts',
  'deleting dating apps for the fourth time this year',
  'going on a date and realizing within 5 minutes its not it',
  'the talking stage ending without explanation',
  'writing and deleting a message seven times',
  'that ex who still shows up in your dreams for no reason',
  'being someones almost but never their person',
  'holding hands for the first time and forgetting how to breathe',
  'the difference between liking someone and liking the idea of them',
  'double texting and immediately regretting it',
  'they said "ill let you know" and never let you know',
  'the audacity of "youre really nice but"',
  'falling for someone who lives in another city',
  'love language being quality time but nobody has time',
  'that one good morning text that changes your whole day',
  'catching feelings when you said you wouldnt',

  // loneliness and feelings
  'overthinking at 2am',
  'the urge to disappear for a week',
  'being the last one awake in the house',
  'the silence after everyone leaves',
  'a random walk through the city at night',
  'doomscrolling at 3am',
  'feeling behind while everyone moves forward',
  'the gap between who you are and who you wanted to be',
  'the peace of doing absolutely nothing',
  'being tired for no reason',
  'sunday evening melancholy',
  'a good sunset making everything temporarily okay',
  'wanting company but also wanting to be alone',
  'that specific loneliness of being surrounded by people',
  'lying in bed staring at the ceiling thinking about nothing and everything',
  'the 3am thoughts that feel so real but disappear by morning',
  'laughing at something alone and having nobody to share it with',
  'walking home alone at night and the city feels like its yours',
  'that hollow feeling after a really good day ends',
  'waking up in the middle of the night and not knowing what year it is',
  'the weight of a conversation you never had',
  'feeling like a background character in your own life',

  // nostalgia and growing up
  'childhood nostalgia hitting at random moments',
  'losing touch with old friends',
  'parents getting older and you noticing',
  'finding old chats and cringing',
  'quarter life crisis at full speed',
  'not knowing what youre doing with your life',
  'the gap between childhood dreams and adult reality',
  'old photos from school making you feel ancient',
  'that one friend group that slowly drifted apart',
  'remembering your school crush and wondering where they are',
  'the house you grew up in looking smaller now',
  'adulthood is just paying bills and being confused',
  'missing the version of yourself that didnt overthink',
  'becoming your parents without realizing it',
  'that teacher who believed in you more than you did',
  'college days seeming magical only in hindsight',
  'the freedom of childhood that you didnt appreciate then',
  'growing up and realizing nobody has it figured out',
  'old birthday photos with people you dont talk to anymore',
  'the first time you realized your parents are just people too',

  // instagram and social media
  'scrolling instagram for too long',
  'deleting a post after 5 minutes',
  'close friends story that nobody watches',
  'instagram explore page knowing you too well',
  'that reel you watched seven times',
  'watching ppl from a cafe window',
  'comparing yourself to people online',
  'the urge to post something then not posting it',
  'linkedin hustle culture making you feel inadequate',
  'that influencer who makes everything look effortless',
  'posting a story and checking views every 2 minutes',
  'unfollowing people for your mental health',
  'the dopamine hit of a notification that turns out to be spam',
  'curating your feed to look like you have your life together',
  'that one person who posts gym stories every single day',
  'the pressure of maintaining an aesthetic feed',
  'twitter arguments at midnight that achieve nothing',
  'screenshotting something to send to your friend',

  // sleep and routines
  'waking up and immediately checking your phone',
  'weekend plans that became just sleeping',
  'late nights and regretting them every morning',
  'the alarm going off and hitting snooze five times',
  'that perfect nap that fixes everything',
  'being a night owl in a morning person world',
  'sleeping at 4am and wondering where the night went',
  'the betrayal of waking up 5 minutes before your alarm',
  'dreading tomorrow before today is even over',
  'that one night you actually slept 8 hours and felt like a new person',
  'melatonin gummies becoming a personality trait',
  'waking up on a saturday with nothing to do and its perfect',
  'the sunday scaries hitting at exactly 6pm',

  // fashion and appearance
  'wearing birkenstocks everywhere',
  'haircut that went wrong',
  'buying something you dont need online',
  'random purchase that actually made you happy',
  'skincare routine you saw on a reel',
  'perfume that reminds you of someone',
  'sneakers that cost more than your weekly groceries',
  'that one outfit you feel invincible in',
  'dressing up with nowhere to go',
  'the confidence boost from a fresh haircut',
  'online shopping at 2am and regretting it by morning',
  'sunglasses as an emotional support accessory',
  'that one jacket you wear in every season',
  'trying on clothes in a trial room and feeling nothing fits right',

  // tech and internet
  'coding at 2am because the bug wont let you sleep',
  'tech twitter being insufferable',
  'a new phone launch and the urge to upgrade',
  'wifi going down at the worst possible moment',
  'stack overflow saving your career daily',
  'that one github commit message thats just "fix"',
  'mechanical keyboard sounds being oddly satisfying',
  'setting up a new laptop and forgetting all your passwords',
  'the urge to build a side project you will abandon in 2 weeks',
  'reading documentation and understanding nothing',
  'chatgpt doing your job better than you',
  'dark mode on everything always',
  'phone battery at 3% and no charger in sight',
  'that one app update that ruins everything',

  // travel and places
  'airports and the feeling of leaving',
  'road trips with the wrong playlist',
  'that one trip that changed something in you',
  'hotel checkout time coming too fast',
  'window seat on a flight watching clouds',
  'the excitement of packing vs the depression of unpacking',
  'travelling alone and realizing you enjoy your own company',
  'getting lost in a new city and finding something unexpected',
  'train journeys and the conversations with strangers',
  'the first morning in a new city when everything feels possible',
  'coming home after a trip and the bed feeling different',

  // family and events
  'weddings where everyone asks about your life',
  'festivals when you live alone',
  'wedding season and the inevitable questions',
  'relatives asking when youre getting married',
  'family whatsapp group being chaotic',
  'mom calling exactly when youre busy',
  'dads jokes getting funnier as you grow older',
  'visiting home and eating like youve been starving',
  'the pressure of being the "responsible" one',
  'siblings borrowing your stuff and never returning it',
  'family dinners where the same stories get told every time',
  'that one uncle who gives unsolicited career advice',

  // random moments and observations
  'strangers who feel familiar',
  'dogs you see on your walk every day',
  'watching a sunset and feeling something but not knowing what',
  'rain on a monday morning commute',
  'that specific silence right before it rains',
  'overhearing a conversation and getting invested in strangers lives',
  'making eye contact with someone on the street and never seeing them again',
  'the specific joy of finding money in an old jacket',
  'pigeons having more confidence than you',
  'auto drivers who play the best music',
  'that one security guard who always smiles at you',
  'trees in the city looking tired',
  'full moon hitting different when youre walking alone',
  'the sound of a ceiling fan being the most comforting thing',
  'clouds that look like something but you have nobody to show',
  'the way sunlight hits a room at 4pm',
  'random acts of kindness from strangers restoring your faith temporarily',
  'that one stray cat that adopted your building',
  'the first cool breeze after a hot day',
  'sitting in a parked car not wanting to go inside yet',

  // money and adulting
  'salary coming in and rent taking it away',
  'the shock of seeing your credit card statement',
  'saving money for a week then blowing it on the weekend',
  'budgeting apps you download and never open',
  'splitting the bill and the awkwardness around it',
  'that one friend who always forgets their wallet',
  'rent in bombay being a personal attack',
  'wanting nice things but also wanting to save',
  'the gap between your lifestyle and your salary',
  'investing in stocks and checking the app every 10 minutes',
  'adulting is just googling how to do basic things',
  'paying taxes and having no idea where it goes',

  // movies tv and entertainment
  'rewatching the same movie again',
  'watching a bollywood movie alone on a weeknight',
  'a movie that hits different the second time',
  'binge watching a show and feeling empty when it ends',
  'that one scene in a movie that lives rent free in your head',
  'crying in a theatre and pretending you didnt',
  'movie recommendations that nobody asked for',
  'the trailers being better than the actual movie',
  'watching something mid but being too deep to stop',
  'that one webseries everyone is talking about',
  'animated movies hitting harder as an adult',
  'the end credits scene that nobody stays for',

  // random overthinking and vibes
  'procrastination as an extreme sport',
  'making plans and hoping they get cancelled',
  'the version of you that exists in your head vs reality',
  'thinking about a conversation you had 3 years ago',
  'imagining scenarios that will never happen',
  'the specific anxiety of an unread notification',
  'wanting to start fresh but not knowing where to begin',
  'that one compliment from years ago you still think about',
  'the urge to google something at 3am and ending up on wikipedia for 2 hours',
  'thinking youre funny but nobody laughing',
  'starting a journal and abandoning it after 3 days',
  'the paradox of choice when picking something to watch',
  'making a to do list and doing none of it',
  'feeling motivated at night but dead in the morning',
  'that random burst of energy at 11pm',
  'wondering if the choices you made were right',
  'talking to yourself and having full conversations',
  'the existential crisis that hits in the shower',
  'pretending youre in a music video while walking',
  'daydreaming about a life you might never have',
  'the comfort of a routine vs the fear of being stuck in one',
  'that feeling when you finish a really good book',
  'being the therapist friend but having no therapist',
  'saying "im fine" when youre absolutely not fine',
  'the weight of things left unsaid',
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
