const CATEGORIES = [
  {
    name: 'gym and fitness',
    seeds: [
      'leg day', 'gym crush', 'protein shake', 'squat rack', 'rest day',
      'cardio', 'pre workout', 'gym playlist', 'foam rolling', 'bench press',
      'treadmill thoughts', 'gym mirror', 'creatine', 'post workout hunger',
      'gym bros', 'deadlift pr', 'skipping gym', 'gym reels', 'bulking season',
      'cutting phase', 'gym bag smell', 'personal trainer', 'morning gym vs night gym',
      'gym water bottle', 'stretching', 'shoulder day', 'arm pump', 'gym friends',
      'workout split', 'progressive overload', 'muscle soreness', 'gym towel',
    ],
  },
  {
    name: 'music and songs',
    seeds: [
      'song on repeat', 'old songs', 'sad songs at 2am', 'new artist discovery',
      'noise cancelling headphones', 'shuffle ruining mood', 'playlist for someone',
      'bollywood 2010 era', 'arijit singh', 'airpods dying', 'breakup song',
      'spotify wrapped', 'humming unknown song', 'concert tickets', 'shower singing',
      'aux control', 'album on loop', 'songs that remind you of places',
      'discovering a genre', 'lo-fi while working', 'earworm', 'vinyl records',
      'music taste as personality', 'crying to a song', 'road trip playlist',
      'indie music phase', 'singing wrong lyrics confidently', 'bass boosted',
    ],
  },
  {
    name: 'food and eating',
    seeds: [
      'garlic naan at 1am', 'biryani debate', 'vadapav', 'ordering food again',
      'cooking gone wrong', 'swiggy delivery guy', 'late night cravings',
      'street food', 'law garden food', 'manek chowk', 'eating alone',
      'chai at tapri', 'second coffee', 'coffee vs chai', 'maggi at 3am',
      'pani puri', 'butter chicken debate', 'favourite restaurant',
      'dabba from home', 'cutting chai', 'midnight ice cream', 'eating healthy fail',
      'zomato gold', 'food coma', 'restaurant portions', 'samosa from canteen',
      'bhurji pav', 'khichdi when sick', 'thali meals', 'dosa at midnight',
      'paratha vs roti', 'chole bhature', 'filter coffee', 'jalebi fafda',
      'gujarati food', 'egg bhurji', 'sandwich from a cart', 'lassi in summer',
    ],
  },
  {
    name: 'office and work',
    seeds: [
      'monday morning', 'meeting that was an email', 'slack messages',
      'wanting to quit', 'linkedin comparison', 'soul eating commute',
      'work from home', 'pretending to be busy', 'sounds good email',
      'lunch break', 'oversharing coworker', 'appraisal anxiety',
      'salary disappearing', 'opening laptop monday', 'corporate jargon',
      'zoom camera off', 'bio break scroll', 'reply all guy',
      'friday vs sunday feeling', 'office AC', 'passive aggressive emails',
      'doodling in meetings', 'standup meetings', 'deadline panic',
      'imposter syndrome at work', 'office politics', 'free office food',
      'team outing', 'notice period', 'job interview anxiety',
      'onboarding confusion', 'ctrl z life', 'work laptop vs personal laptop',
    ],
  },
  {
    name: 'city life bombay',
    seeds: [
      'rain in bombay', 'marine drive at night', 'local train rush',
      'monsoon flooding', 'bandra to andheri traffic', 'carter road sunday',
      'juhu beach sunset', 'first rain smell', 'bombay bus stop chaos',
      'south bombay vs suburbs', 'local train friendships', 'dabbawalas',
      'bandstand at night', 'worli sea link', 'colaba causeway',
      'bombay rent', 'powai lake', 'andheri station crowd',
      'western line vs central line', 'bandra fort', 'sion to dadar walk',
      'taxi meter', 'best bus', 'chowpatty beach', 'hanging gardens',
      'linking road shopping', 'gateway of india', 'crawford market smells',
    ],
  },
  {
    name: 'city life ahmedabad',
    seeds: [
      'ahmedabad heat', 'night walks', 'sabarmati riverfront',
      'auto rides', 'SG highway traffic', 'law garden', 'manek chowk midnight',
      'ahmedabad winter mornings', 'kankaria lake', 'CG road',
      'LD college area', 'prahladnagar vibes', 'drive in road',
      'ahmedabad to bombay flight', 'dry state problems',
      'IIM road', 'sindhu bhavan road', 'thaltej crossroads',
      'vastrapur lake walk', 'old city pol houses', 'ric rickshaw',
      'alpha one mall on weekends', 'riverfront cycling', 'bopal feels like a village still',
      'satellite road traffic', 'bodakdev cafe culture', 'iscon cross roads chaos',
      'parimal garden morning walks', 'science city nostalgia', 'adalaj stepwell on a quiet day',
      'sarkhej roza vibes', 'dust everywhere during summer', 'AM to PM rickshaw meter debate',
      'ahmedabad metro finally happening', 'gift city being another planet',
    ],
  },
  {
    name: 'navratri and garba',
    seeds: [
      'navratri outfit shopping starting in august', 'garba practice in the society',
      'first night of navratri energy', 'garba steps you still cant get right',
      'dandiya bruises on your hands', 'that one person who goes too hard with dandiya',
      'navratri pass prices every year', 'falguni pathak live', 'GMDC ground navratri',
      'united way garba', 'club navratri vs society garba', 'chaniya choli shopping drama',
      'kediyu fitting', 'navratri food stalls outside the venue', 'garba at 3am still going strong',
      'aarti at midnight during navratri', 'navratri playlist on loop for a month',
      'non gujju friends experiencing navratri for the first time',
      'garba with your crew', 'that one uncle who outdances everyone',
      'navratri crush you see every night but never talk to',
      'legs dying after 4 hours of garba', 'dodhiya rounds',
      'the day after navratri feeling empty', 'nine nights going by too fast',
      'matchmaking season during navratri', 'rasgarba vs commercial garba debate',
      'garba in bombay vs garba in ahmedabad',
    ],
  },
  {
    name: 'gujju food culture',
    seeds: [
      'thepla on every trip', 'undhiyu season', 'dal dhokli on a sunday',
      'fafda jalebi sunday morning', 'khaman vs dhokla debate', 'handvo from moms kitchen',
      'sev khamani cravings', 'gathiya with chai', 'mohanthal during diwali',
      'basundi at weddings', 'shrikhand with puri', 'gujarati thali that never ends',
      'rotla with ringan no olo', 'kathiyawadi food hitting different',
      'farsan variety at every gathering', 'muthiya steamed fresh',
      'doodh pak at home', 'aamras season waiting all year', 'keri no ras with puri',
      'lilva kachori', 'patra rolls from scratch', 'sukhdi when you need comfort',
      'ganthia sev in everything', 'dabeli from the right stall',
      'khakhra as travel food', 'methi na gota in monsoon', 'bajri no rotlo in winter',
      'chhundo with paratha', 'gor keri pickle nostalgia',
      'jain food adaptations being a whole cuisine', 'ghee on everything no debate',
      'sweet dal is valid and i wont argue', 'gujarati wedding food being elite',
      'mixing sugar in dal and ppl losing their minds',
    ],
  },
  {
    name: 'gujju life and culture',
    seeds: [
      'kem cho as a greeting', 'family business conversations at dinner',
      'gujju wedding that lasts 4 days', 'mama ni house during summer holidays',
      'garba in your blood', 'uttarayan kite flying all day',
      'getting your kite cut and the pain', 'undhiyu on uttarayan morning',
      'til chikki during makar sankranti', 'bhai dooj at masis place',
      'dhanteras gold shopping with mom', 'diwali card party at home',
      'bhabhi making you do stuff at family events',
      'gujarati aunties knowing everyones business',
      'mandap ma javu che energy', 'pithi ceremony vibes',
      'gujju startup culture', 'family ka business vs your own dreams',
      'everyone in the family having a business', 'jugaad is a lifestyle',
      'the gujju networking thing being real', 'NRI relatives visiting in december',
      'sunday sabji market with parents', 'society garba ground being the hub',
      'gujju friendships that start with food', 'road trip to diu with friends',
      'dwarka trip with family', 'somnath darshan', 'statue of unity trip',
      'gir forest plan', 'kutch rann utsav vibes', 'saputara in monsoon',
      'polo forest camping', 'ajwa garden vibes',
    ],
  },
  {
    name: 'dating and relationships',
    seeds: [
      'talking stage', 'getting ghosted', 'first date', 'situationship',
      'hinge profiles', 'missing someone', 'wanting to text', 'being single',
      'story watcher who never texts', 'deleting dating apps', 'bad date',
      'talking stage ending', 'typing and deleting', 'ex in dreams',
      'almost person', 'holding hands first time', 'liking idea vs person',
      'double texting regret', 'ill let you know', 'youre nice but',
      'long distance', 'quality time', 'good morning text', 'catching feelings',
      'commitment issues', 'red flags you ignore', 'green flags',
      'meeting their friends', 'late night calls', 'shared spotify playlists',
      'leaving stuff at their place', 'the "what are we" conversation',
    ],
  },
  {
    name: 'loneliness and feelings',
    seeds: [
      'overthinking at 2am', 'urge to disappear', 'last one awake',
      'silence after everyone leaves', 'night walk', 'doomscrolling',
      'feeling behind', 'gap between versions of yourself', 'doing nothing',
      'tired for no reason', 'sunday melancholy', 'sunset fixing things',
      'wanting company and solitude', 'lonely in a crowd', 'ceiling staring',
      '3am thoughts', 'laughing alone', 'walking home alone', 'hollow after good day',
      'middle of night confusion', 'unspoken conversations', 'background character',
      'emotional numbness', 'feeling everything at once', 'the void',
      'rainy day mood', 'empty apartment', 'echoing rooms',
    ],
  },
  {
    name: 'nostalgia and growing up',
    seeds: [
      'childhood nostalgia', 'old friends drifting', 'parents aging',
      'old cringey chats', 'quarter life crisis', 'no direction',
      'childhood dreams vs reality', 'old school photos', 'friend group drifting',
      'school crush memories', 'childhood house smaller now', 'adulting confusion',
      'missing old self', 'becoming your parents', 'that one teacher',
      'college in hindsight', 'childhood freedom', 'nobody figured it out',
      'old birthday photos', 'parents are just people', 'cartoon network era',
      'school assembly memories', 'first phone', 'summer holidays as a kid',
      'board exams nostalgia', 'tuition class friends', 'report card day',
      'farewell day', 'last day of college', 'old school uniform',
    ],
  },
  {
    name: 'social media and internet culture',
    seeds: [
      'scrolling too long', 'deleting a post', 'close friends story',
      'explore page accuracy', 'rewatching reels', 'cafe window watching',
      'online comparison', 'almost posting', 'linkedin hustle culture',
      'effortless influencer', 'checking story views', 'unfollowing spree',
      'spam notification dopamine', 'curated feed', 'daily gym stories person',
      'aesthetic feed pressure', 'twitter arguments', 'screenshot to friend',
      'going viral anxiety', 'ratio', 'main character energy', 'npc behaviour',
      'doom posting', 'touch grass', 'parasocial relationships',
      'comment section sociology', 'meme as communication',
    ],
  },
  {
    name: 'sleep and routines',
    seeds: [
      'phone check first thing', 'weekend just sleeping', 'regretting late nights',
      'snooze five times', 'perfect nap', 'night owl problems', 'sleeping at 4am',
      'alarm betrayal', 'dreading tomorrow already', 'rare 8 hour sleep',
      'melatonin gummies', 'saturday nothing to do', 'sunday scaries at 6pm',
      'morning routine fantasy', 'bedtime procrastination', 'dream you cant remember',
      'waking up thinking its monday', 'weekend over too fast', 'bed gravity',
      'pillow cold side', 'rain and sleep', 'nap that ruins your night',
    ],
  },
  {
    name: 'fashion and appearance',
    seeds: [
      'birkenstocks', 'bad haircut', 'unnecessary online purchase', 'random good purchase',
      'skincare from a reel', 'perfume memories', 'expensive sneakers',
      'invincible outfit', 'dressed up nowhere to go', 'fresh haircut confidence',
      '2am online shopping', 'sunglasses emotional support', 'all season jacket',
      'trial room disappointment', 'wardrobe of black clothes', 'ironing vs not',
      'jewellery you never take off', 'watch collection', 'thrift shopping',
      'uniqlo basics', 'streetwear phase', 'comfort over fashion',
    ],
  },
  {
    name: 'tech and internet',
    seeds: [
      'coding at 2am', 'tech twitter', 'new phone launch urge', 'wifi dying',
      'stack overflow', 'git commit "fix"', 'mechanical keyboard', 'new laptop setup',
      'abandoned side project', 'documentation confusion', 'ai doing your job',
      'dark mode everything', 'phone at 3%', 'app update ruining things',
      'keyboard shortcuts flex', 'tab hoarding', 'incognito mode',
      'password reset loop', 'api rate limits', 'deploy on friday',
      'merge conflicts', 'localhost working prod broken', 'npm install prayer',
      'cursor blinking', 'debugging for 3 hours then its a typo',
    ],
  },
  {
    name: 'travel and places',
    seeds: [
      'airport feelings', 'wrong playlist road trip', 'life changing trip',
      'hotel checkout too fast', 'window seat clouds', 'packing vs unpacking',
      'solo travel', 'getting lost in new city', 'train stranger conversations',
      'first morning new city', 'post trip bed', 'goa plan that never happens',
      'manali with friends', 'pondicherry vibes', 'udaipur sunsets',
      'kashmir dreams', 'bus journey overnight', 'backpacking budget',
      'hostel friendships', 'flight delay bonding', 'airport lounge flex',
      'booking vs actually going', 'google maps trust issues',
    ],
  },
  {
    name: 'family and home',
    seeds: [
      'wedding interrogation', 'festivals alone', 'marriage questions',
      'family whatsapp chaos', 'mom calling when busy', 'dad jokes improving',
      'visiting home eating spree', 'responsible one pressure', 'sibling theft',
      'same family stories', 'uncle career advice', 'grandparents phone calls',
      'cousin wedding pressure', 'mom guilt tripping', 'dad not saying much but meaning everything',
      'raksha bandhan distance', 'diwali cleaning', 'holi with neighbours',
      'home cooked food after months', 'parents discovering emojis',
      'family photo where nobody is ready', 'being the tech support of the family',
      'baa making you eat more', 'mummy ka tiffin when visiting',
      'papa saying nothing but paying for everything', 'fua na ghar jaavu',
      'family function dress code drama', 'cousin group planning a trip that never happens',
      'ba calling to ask if you ate', 'festival prep starting a week early at home',
      'family ka ek hi tv and the remote war', 'dadi telling the same story with new details each time',
    ],
  },
  {
    name: 'random observations',
    seeds: [
      'familiar strangers', 'daily walk dogs', 'unnamed sunset feeling',
      'monday rain commute', 'silence before rain', 'overheard conversations',
      'street eye contact', 'money in old jacket', 'confident pigeons',
      'auto driver music', 'security guard smile', 'tired city trees',
      'full moon walking alone', 'ceiling fan comfort', 'clouds with nobody to show',
      'sunlight at 4pm', 'stranger kindness', 'building stray cat',
      'first cool breeze', 'sitting in parked car', 'elevator small talk',
      'escalator standing side', 'people watching at cafes',
      'rain smell on concrete', 'old building character', 'street light warmth',
      'morning chai seller sound', 'newspaper vendor disappearing',
    ],
  },
  {
    name: 'money and adulting',
    seeds: [
      'salary and rent', 'credit card shock', 'weekend blowing savings',
      'budgeting app unused', 'bill splitting awkward', 'friend forgets wallet',
      'bombay rent attack', 'nice things vs saving', 'lifestyle vs salary',
      'stocks checking obsession', 'googling adult things', 'taxes confusion',
      'emi life', 'credit score anxiety', 'UPI making spending too easy',
      'mutual funds sahi hai', 'insurance calls', 'first big purchase',
      'splitting rent with roommate', 'electricity bill shock', 'adulting starter pack',
      'grocery shopping realization', 'comparing prices for everything',
    ],
  },
  {
    name: 'movies and entertainment',
    seeds: [
      'rewatching comfort movie', 'solo bollywood night', 'movie hits different second time',
      'binge emptiness', 'scene living rent free', 'crying in theatre',
      'unsolicited movie recs', 'trailer better than movie', 'mid show cant stop',
      'webseries everyone talks about', 'animated movies as adult', 'end credits scene',
      'movie dialogue you quote daily', 'watching old sitcoms', 'documentary at 3am',
      'horror movie alone', 'intermission samosa', 'first day first show energy',
      'subtitles on everything', 'movie that changed your perspective',
      'that one director you trust blindly', 'comfort sitcom rewatch',
    ],
  },
  {
    name: 'overthinking and vibes',
    seeds: [
      'procrastination sport', 'hoping plans cancel', 'head version vs reality',
      'replaying 3 year old conversation', 'imagining scenarios', 'unread notification anxiety',
      'wanting fresh start', 'old compliment on replay', '3am wikipedia spiral',
      'unfunny self', 'abandoned journal', 'choice paralysis', 'empty to do list',
      'night motivation morning death', '11pm random energy', 'questioning choices',
      'talking to yourself', 'shower existential crisis', 'music video walking',
      'daydreaming alternate life', 'routine comfort vs stuck fear', 'finishing a book feeling',
      'therapist friend no therapist', 'saying im fine', 'things left unsaid',
      'brain at 3am vs brain at 3pm', 'random memory at wrong time',
      'main character delusion', 'imposter syndrome', 'analysis paralysis',
    ],
  },
  {
    name: 'weather and seasons',
    seeds: [
      'first rain of monsoon', 'summer heat melting', 'winter morning blanket',
      'perfect weather wasted indoors', 'sweating in formal clothes', 'ac vs fan debate',
      'rain and pakoras', 'foggy morning commute', 'humidity ruining hair',
      'heatwave and power cut', 'winter night chai', 'spring allergies',
      'cloudy sky mood', 'too hot to exist', 'pleasant evening wasted at work',
    ],
  },
  {
    name: 'friends and social life',
    seeds: [
      'friend group chat dead', 'plan that keeps getting postponed', 'that one reliable friend',
      'friend who cancels last minute', 'friendship after college', 'drunk conversations',
      'friend who moved abroad', 'inside jokes nobody else gets', 'birthday planning stress',
      'friend you only meet twice a year', 'growing apart from best friend',
      'new friend group energy', 'party introvert', 'designated driver',
      'friends wedding making you feel old', 'road trip with friends',
      'friend who always has gossip', 'texting vs meeting difference',
    ],
  },
  {
    name: 'pets and animals',
    seeds: [
      'stray dog that follows you', 'cat videos at work', 'wanting a dog but cant',
      'neighbourhood aunty with 5 cats', 'puppy eyes manipulation', 'crow intelligence',
      'pigeons on your balcony', 'feeding strays', 'dog park observations',
      'pet parent friends', 'that one dog at the park who loves everyone',
      'fish tank as therapy', 'bird sounds in the morning', 'squirrels at the park',
    ],
  },
  {
    name: 'health and wellness',
    seeds: [
      'skipping breakfast again', 'water intake guilt', 'step count obsession',
      'back pain at 24', 'screen time report shame', 'posture check',
      'therapy normalization', 'meditation lasting 30 seconds', 'stretching forgotten',
      'annual checkup avoidance', 'vitamin d deficiency gang', 'eye strain from screens',
      'headache from dehydration', 'stomach upset from street food', 'cold in summer',
    ],
  },
  {
    name: 'gaming',
    seeds: [
      'one more game at 3am', 'rage quitting', 'gaming setup envy',
      'squad not online', 'lag spike at crucial moment', 'grinding for hours',
      'gaming vs responsibilities', 'nostalgia for old games', 'mobile gaming shame',
      'esports dreams at 24', 'gaming chair as office chair', 'steam sale buying games you wont play',
      'valorant ranking anxiety', 'minecraft at midnight', 'co-op with friends',
    ],
  },
  {
    name: 'cricket and sports',
    seeds: [
      'ipl season obsession', 'gully cricket memories', 'cricket commentary from uncle',
      'watching match alone', 'last over heart attack', 'fantasy league delusion',
      'cricket in the rain', 'stadium atmosphere', 'f1 watching at weird hours',
      'football vs cricket debate', 'sports bar with friends', 'morning run motivation dying',
      'badminton at society', 'swimming pool in summer', 'cycling at 5am for one week then stopping',
    ],
  },
];

const MOODS = [
  'slightly melancholic', 'dry humor', 'self-deprecating', 'purely observational',
  'absurd', 'nostalgic', 'peaceful', 'chaotic energy', 'lowkey annoyed',
  'weirdly philosophical', 'deadpan', 'tender', 'restless', 'detached',
  'amused', 'bittersweet', 'confused', 'content', 'wistful', 'sarcastic',
  'quietly happy', 'existential', 'numb', 'grateful but wont say it',
  'dramatic for no reason', 'sleepy', 'manic energy', 'calm acceptance',
];

const ANGLES = [
  'focus on one tiny specific detail',
  'compare two unrelated things',
  'ask a rhetorical question',
  'state it like an obvious fact',
  'make it sound like a confession',
  'leave the thought unfinished',
  'describe only the feeling not the event',
  'exaggerate one small part',
  'understate something big',
  'talk about the before or after not the thing itself',
  'personify an object',
  'frame it as advice you wont follow',
  'describe it like a movie scene',
  'make it about timing',
  'frame it as a realization',
  'write it like youre texting a friend',
  'make it sound like a shower thought',
  'phrase it as something you noticed today',
  'write it like the start of a story with no ending',
  'make it about what you almost did but didnt',
  'frame it as a pattern you just recognized',
  'write it like a small win',
  'make it about waiting for something',
  'describe the gap between expectation and reality',
];

const TIME_CONTEXTS = [
  'at 2am', 'at 3am', 'at 4am', 'early morning', 'monday morning',
  'sunday evening', 'friday night', 'during lunch', 'while commuting',
  'in an auto ride', 'waiting for food delivery', 'in the shower',
  'right before sleeping', 'middle of a meeting', 'walking home from work',
  'during monsoon', 'peak summer', 'winter night', 'on a holiday',
  'between meetings', 'waiting in line', 'stuck in traffic',
  'at a cafe alone', 'at a party feeling out of place', 'after midnight',
  'dawn when the city is empty', 'right after waking up',
  'during a power cut', 'on a lazy sunday', 'on your birthday',
];

function pick(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function pickN(arr, n) {
  const shuffled = [...arr].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, n);
}

function generateTopicPrompt() {
  const cat = pick(CATEGORIES);
  const seeds = pickN(cat.seeds, 2);
  const mood = pick(MOODS);
  const angle = pick(ANGLES);
  const time = Math.random() > 0.4 ? pick(TIME_CONTEXTS) : '';
  const uniqueId = Date.now().toString(36) + Math.random().toString(36).slice(2, 6);

  let topic = `category: ${cat.name}\n`;
  topic += `seed vibes: ${seeds.join(', ')}\n`;
  topic += `mood: ${mood}\n`;
  topic += `angle: ${angle}\n`;
  if (time) topic += `time/setting: ${time}\n`;
  topic += `uniqueness key: ${uniqueId}`;

  return topic;
}

function pickRandomTopics(count = 1) {
  if (count === 1) return [generateTopicPrompt()];
  const results = [];
  const usedCats = new Set();
  for (let i = 0; i < count; i++) {
    let topic = generateTopicPrompt();
    let attempts = 0;
    while (usedCats.has(topic.split('\n')[0]) && attempts < 10) {
      topic = generateTopicPrompt();
      attempts++;
    }
    usedCats.add(topic.split('\n')[0]);
    results.push(topic);
  }
  return results;
}

// block serious/sensitive topics and indian politics (global politics is fine)
const SKIP_KEYWORDS = [
  'flood', 'floods', 'earthquake', 'tsunami', 'cyclone', 'landslide',
  'drought', 'famine', 'starvation', 'refugee', 'relief', 'stranded',
  'rescue', 'rescued', 'missing persons',
  'rape', 'murder', 'killed', 'killing', 'dead body', 'death toll',
  'attack', 'terror', 'bomb', 'blast', 'shooting', 'lynching',
  'mob violence', 'riot', 'communal',
  'arrest', 'arrested', 'jail', 'prison', 'scam', 'fraud',
  'abuse', 'assault', 'harassment', 'trafficking', 'victim',
  'isis', 'taliban', 'militant', 'extremist', 'hostage',
  'suicide', 'pandemic', 'epidemic', 'outbreak',
  'modi', 'rahul gandhi', 'kejriwal', 'mamata', 'yogi',
  'bjp', 'congress party', 'aap party', 'rss', 'jdu', 'nda', 'india bloc',
  'lok sabha', 'rajya sabha', 'parliament session',
  'chief minister', 'union minister', 'governor',
  'caste', 'reservation', 'dalit',
  'telangana congress', 'karnataka minister',
  'isi links', 'espionage',
  'gaza casualties', 'civilian deaths',
];

function isLightTopic(title) {
  const lower = title.toLowerCase();
  return !SKIP_KEYWORDS.some((kw) => lower.includes(kw));
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

module.exports = { pickRandomTopics, getTrendingTopics, generateTopicPrompt };
