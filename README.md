# x poster

ai-powered x/twitter auto-poster that writes posts in your voice, powered by grok (xAI).

generates posts as a 24 year old guy from bombay/ahmedabad. lowercase, casual, unpolished, dry humor, sometimes lonely, sometimes funny. no corporate language, no motivational bs.

posts to x for free using [x-automation](https://github.com/elnino-hub/x-automation) — no official x api needed, no per-post charges.

## features

- **3 daily auto-posts** with morning preview dashboard
  - morning cron generates 3 posts (2 daily life + 1 trending)
  - review, approve, or regenerate any post before it goes live
  - randomized posting times within windows (never posts at the exact same minute twice)
- **duplicate detection** — hard blocks repeated/similar posts using word-level similarity matching against last 200 posts
- **custom post generation** from any topic/mood/thought
- **trending india posts** that react to what's trending (filters out indian politics, disasters, heavy stuff)
- **unlimited topic variety** via dynamic combo system (category x seeds x mood x angle x time = millions of unique combos)
- **28 topic categories** including gym, music, food, city life bombay, city life ahmedabad, navratri and garba, gujju food culture, gujju life, dating, loneliness, overthinking, cricket, tech, and more
- **zero repetition** enforced at prompt level with anti-repetition rules + KV-based duplicate blocking
- **format selection**: auto, one-liner, short, or long stream-of-consciousness
- **post history** stored in browser (localStorage)
- **dark theme** dashboard

## tech stack

- **vercel** serverless functions + cron jobs
- **grok-3-mini** (xAI API) for post generation
- **x-automation** for posting (browser fingerprinting, no official API)
- **vercel kv** (upstash redis) for daily post storage + duplicate detection
- **google trends/news rss** for trending topics
- **native fetch** (node 18+), zero npm dependencies

## cost estimate

### grok api (post generation)

grok-3-mini pricing: **$0.25/M input tokens, $0.50/M output tokens**

each post generation uses roughly:
- ~700 input tokens (voice prompt + format + topic instructions)
- ~70 output tokens (the actual tweet)
- **~$0.00021 per generation**

$5 of grok credits = ~23,000 generations. even regenerating 10x/day = ~$0.06/month.

### x posting (via x-automation)

**free.** x-automation uses x's internal graphql api with browser session cookies — no official api, no per-post charges. requires a residential proxy (~$1-5/month from dataimpulse/smartproxy).

### monthly cost at 3 posts/day

| service | monthly cost |
|---------|--------------|
| x posting (x-automation) | free |
| residential proxy | ~$1-5 |
| grok api (generation + regenerations) | ~$0.06 |
| vercel hosting (hobby plan) | free |
| vercel kv (redis storage) | free |
| **total** | **~$1-5/month** |

## setup

### 1. deploy x-automation (posting service)

this is the service that actually posts to x. it runs as a separate python service.

```bash
git clone https://github.com/elnino-hub/x-automation.git
cd x-automation
pip install -r requirements.txt
```

set up `.env` for x-automation:
- `X_AUTH_TOKEN` — get from browser cookies (devtools > application > cookies > x.com)
- `X_CT0` — same, from browser cookies
- `API_KEY` — make up a long random string (this becomes your `X_AUTOMATION_API_KEY`)
- `PROXY_URL` — residential proxy URL (`http://user:pass@host:port`)

deploy to render/railway/fly.io:
```bash
# render start command:
uvicorn execution.main:app --host 0.0.0.0 --port $PORT
```

test it works:
```bash
curl https://your-service.onrender.com/health
curl https://your-service.onrender.com/ip  # should show proxy IP, not datacenter
```

### 2. clone and deploy x-ai-poster (this repo)

```bash
git clone https://github.com/viralsachde-ftw/x-ai-poster.git
cd x-ai-poster
npm install
```

deploy to vercel:
```bash
npx vercel
```

### 3. get your xAI api key

1. go to [console.x.ai](https://console.x.ai/)
2. create an account or sign in
3. generate an api key
4. copy the key

### 4. set up vercel kv

1. go to your vercel dashboard
2. go to **Storage** tab
3. click **Create Database** > **KV**
4. select the free tier (hobby plan)
5. connect it to your project
6. it auto-adds `KV_REST_API_URL` and `KV_REST_API_TOKEN` to your env vars

### 5. set environment variables

in your vercel project settings > environment variables, add:

```
X_AUTOMATION_URL=https://your-x-automation-service.onrender.com
X_AUTOMATION_API_KEY=the_api_key_you_set_in_x_automation
XAI_API_KEY=your_xai_api_key
CRON_SECRET=any_random_string_you_make_up
KV_REST_API_URL=auto_added_by_vercel_kv
KV_REST_API_TOKEN=auto_added_by_vercel_kv
```

### 6. deploy

```bash
npx vercel --prod
```

that's it. crons start running automatically.

## how it works

### daily auto-posting flow

1. **7:30 AM IST** (2:00 UTC) — `generate-daily` cron runs, generates 3 posts with randomized posting times, stores in vercel kv
2. **you check the dashboard** — see all 3 posts, regenerate any you don't like, approve them
3. **~10:00 AM IST** (randomized within 9:30-10:30 AM) — slot 1 posts automatically
4. **~3:00 PM IST** (randomized within 2:30-3:30 PM) — slot 2 posts automatically
5. **~8:00 PM IST** (randomized within 7:30-8:30 PM) — slot 3 posts automatically

posting times are randomized daily so the pattern is never exactly the same — helps avoid bot detection.

posts go out whether you approve them or not (pending = auto-posts too). if you don't like one, regenerate it before its scheduled time.

### duplicate detection

every post is checked against the last 200 posts before posting:
- exact match detection (after normalization)
- similarity detection using word-level jaccard similarity (>75% overlap = blocked)
- during generation: auto-regenerates up to 3 times if duplicate detected
- during posting: hard rejects duplicates with an error

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
│   ├── post.js               # POST - post text to x (with duplicate blocking)
│   ├── today.js              # GET/POST - today's posts CRUD
│   ├── trending.js           # GET - fetch trending topics
│   └── cron/
│       ├── generate-daily.js # cron - morning post generation + random times
│       └── post-scheduled.js # cron - randomized scheduled posting
├── lib/
│   ├── grok.js               # xAI API wrapper
│   ├── kv.js                 # vercel kv wrapper + duplicate detection
│   ├── prompts.js            # voice prompt + format instructions
│   ├── topics.js             # dynamic topic combo system + trending
│   └── twitter.js            # x-automation HTTP client
├── public/
│   ├── index.html            # dashboard
│   ├── app.js                # frontend logic
│   └── style.css             # dark theme styles
├── vercel.json               # cron schedules (randomized windows)
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
| `X_AUTOMATION_URL` | yes | url of your deployed x-automation service |
| `X_AUTOMATION_API_KEY` | yes | api key you set in x-automation's `.env` |
| `XAI_API_KEY` | yes | xAI grok api key |
| `CRON_SECRET` | yes | any random string to protect cron endpoints |
| `KV_REST_API_URL` | yes | vercel kv rest api url (auto-added) |
| `KV_REST_API_TOKEN` | yes | vercel kv rest api token (auto-added) |

## x-automation notes

- x-automation uses browser session cookies (`auth_token` + `ct0`) — these last ~12 months
- requires a **residential proxy** — datacenter IPs (render, aws, etc.) are blocked by x
- keep posting under ~50 tweets/day to avoid rate limits
- if you get `AUTOMATION_DETECTED` errors, the browser version in x-automation may need updating
- the service is separate from this vercel app — deploy it on render (free tier works) with a residential proxy
