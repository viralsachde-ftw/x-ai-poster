# x poster

ai-powered x/twitter auto-poster that writes posts in your voice, powered by grok (xAI).

generates posts as a 24 year old guy from bombay/ahmedabad. lowercase, casual, unpolished, dry humor, sometimes lonely, sometimes funny. no corporate language, no motivational bs.

## features

- **3 daily auto-posts** with morning preview dashboard
  - morning cron generates 3 posts (2 daily life + 1 trending)
  - review, approve, or regenerate any post before it goes live
  - auto-posts at 10:00 AM, 3:00 PM, and 8:00 PM IST
- **custom post generation** from any topic/mood/thought
- **trending india posts** that react to what's trending (filters out indian politics, disasters, heavy stuff)
- **unlimited topic variety** via dynamic combo system (category x seeds x mood x angle x time = millions of unique combos)
- **28 topic categories** including gym, music, food, city life bombay, city life ahmedabad, navratri and garba, gujju food culture, gujju life, dating, loneliness, overthinking, cricket, tech, and more
- **zero repetition** enforced at prompt level with anti-repetition rules
- **format selection**: auto, one-liner, short, or long stream-of-consciousness
- **post history** stored in browser (localStorage)
- **dark theme** dashboard

## tech stack

- **vercel** serverless functions + cron jobs
- **grok-3-mini** (xAI API) for post generation
- **twitter-api-v2** npm package for posting (OAuth 1.0a)
- **vercel kv** (upstash redis) for daily post storage
- **google trends/news rss** for trending topics
- **native fetch** (node 18+), no openai package needed

## cost estimate

grok-3-mini pricing: **$0.25/M input tokens, $0.50/M output tokens**

each post uses roughly:
- ~700 input tokens (voice prompt + format + topic instructions)
- ~70 output tokens (the actual tweet)
- **~$0.00021 per post**

| budget | posts | at 3/day lasts |
|--------|-------|----------------|
| free tier | rate-limited but $0 | ongoing |
| $5 | ~23,000 posts | ~21 years |
| $25 | ~115,000 posts | ~105 years |

**tldr: $5 is more than enough. you'll literally never run out.**

even if you regenerate 10 posts per day (dashboard previews + custom), you're spending ~$0.002/day = ~$0.06/month.

## setup

### 1. clone and deploy to vercel

```bash
git clone https://github.com/viralsachde-ftw/x-ai-poster.git
cd x-ai-poster
npm install
```

deploy to vercel:
```bash
npx vercel
```

### 2. get your api keys

#### xAI / grok api key
1. go to [console.x.ai](https://console.x.ai/)
2. create an account or sign in
3. generate an api key
4. copy the key

#### x / twitter api credentials
1. go to [developer.x.com](https://developer.x.com/en/portal/dashboard)
2. create a project and app
3. set up **User Authentication Settings**:
   - app permissions: **Read and Write**
   - type: **Web App**
   - callback url: any valid url (not used for this app)
4. go to **Keys and Tokens** tab
5. generate:
   - **API Key** (consumer key)
   - **API Key Secret** (consumer secret)
   - **Access Token** (with read+write)
   - **Access Token Secret**

#### vercel kv (for today's posts feature)
1. go to your vercel dashboard
2. go to **Storage** tab
3. click **Create Database** > **KV**
4. select the free tier (hobby plan)
5. connect it to your project
6. it auto-adds `KV_REST_API_URL` and `KV_REST_API_TOKEN` to your env vars

### 3. set environment variables

in your vercel project settings > environment variables, add:

```
X_API_KEY=your_twitter_api_key
X_API_SECRET=your_twitter_api_secret
X_ACCESS_TOKEN=your_twitter_access_token
X_ACCESS_SECRET=your_twitter_access_secret
XAI_API_KEY=your_xai_api_key
CRON_SECRET=any_random_string_you_make_up
KV_REST_API_URL=auto_added_by_vercel_kv
KV_REST_API_TOKEN=auto_added_by_vercel_kv
```

### 4. deploy

```bash
npx vercel --prod
```

that's it. crons start running automatically.

## how it works

### daily auto-posting flow

1. **7:30 AM IST** (2:00 UTC) — `generate-daily` cron runs, generates 3 posts, stores in vercel kv
2. **you check the dashboard** — see all 3 posts, regenerate any you don't like, approve them
3. **10:00 AM IST** (4:30 UTC) — slot 1 posts automatically (daily life topic)
4. **3:00 PM IST** (9:30 UTC) — slot 2 posts automatically (daily life topic)
5. **8:00 PM IST** (14:30 UTC) — slot 3 posts automatically (trending topic)

posts go out whether you approve them or not (pending = auto-posts too). if you don't like one, regenerate it before its scheduled time.

### dashboard

the web dashboard has:
- **today's posts** — top section showing your 3 daily slots with approve/regenerate/post-now buttons
- **custom** tab — type any thought and generate a post from it
- **daily life** tab — random topic from the combo system
- **trending india** tab — fetches google trends and writes a casual take

### topic system

topics are generated dynamically from combinations of:
- **28 categories** (each with 20-34 seed words)
- **28 moods** (chill, chaotic, existential, nostalgic, etc.)
- **24 angles** (hot take, confession, question, observation, etc.)
- **30 time contexts** (2am thoughts, monday morning, weekend plans, etc.)

this gives millions of unique topic prompts so posts never feel repetitive.

### trending topic filters

- picks from: bollywood, cricket, sports, tech, entertainment, food, lifestyle, celebrity, pop culture, gaming, gadgets, global politics, space/science
- blocks: indian politics (modi, bjp, congress, etc.), disasters, floods, crimes, deaths, wars
- global politics is allowed if funny/interesting (like trump drama)

## project structure

```
x-ai-poster/
├── api/
│   ├── generate.js          # POST - generate a post (custom/daily/trending)
│   ├── post.js               # POST - post text to x/twitter
│   ├── today.js              # GET/POST - today's posts CRUD
│   ├── trending.js           # GET - fetch trending topics
│   └── cron/
│       ├── generate-daily.js # cron - morning post generation
│       └── post-scheduled.js # cron - scheduled posting (runs 3x/day)
├── lib/
│   ├── grok.js               # xAI API wrapper
│   ├── kv.js                 # vercel kv (upstash redis) wrapper
│   ├── prompts.js            # voice prompt + format instructions
│   ├── topics.js             # dynamic topic combo system + trending
│   └── twitter.js            # twitter api v2 wrapper
├── public/
│   ├── index.html            # dashboard
│   ├── app.js                # frontend logic
│   └── style.css             # dark theme styles
├── vercel.json               # cron schedules
├── package.json
└── .env.example
```

## local development

```bash
# install deps
npm install

# copy env file and fill in your keys
cp .env.example .env

# run locally with vercel cli
npx vercel dev
```

open `http://localhost:3000` to use the dashboard.

note: cron jobs only run on vercel production, not locally. to test cron endpoints locally:
```bash
curl -X POST http://localhost:3000/api/cron/generate-daily \
  -H "Authorization: Bearer YOUR_CRON_SECRET"
```

## env variables reference

| variable | required | description |
|----------|----------|-------------|
| `X_API_KEY` | yes | twitter api key (consumer key) |
| `X_API_SECRET` | yes | twitter api secret (consumer secret) |
| `X_ACCESS_TOKEN` | yes | twitter access token (read+write) |
| `X_ACCESS_SECRET` | yes | twitter access token secret |
| `XAI_API_KEY` | yes | xAI grok api key |
| `CRON_SECRET` | yes | any random string to protect cron endpoints |
| `KV_REST_API_URL` | for daily posts | vercel kv rest api url |
| `KV_REST_API_TOKEN` | for daily posts | vercel kv rest api token |
