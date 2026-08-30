# x poster

ai-powered x/twitter auto-poster that writes posts in your voice, powered by grok (xAI). posts for free using x's internal graphql api — no official x api, no per-post charges, no second service to host.

generates posts as a 24 year old guy from bombay/ahmedabad. lowercase, casual, unpolished, dry humor, sometimes lonely, sometimes funny. no corporate language, no motivational bs.

## what it does

- generates 3 posts every morning automatically (2 daily life + 1 trending topic)
- posts them at randomized times throughout the day (~10 AM, ~3 PM, ~8 PM IST)
- you can preview, approve, regenerate, or post manually from the dashboard
- hard-blocks duplicate/similar posts (checks last 200 posts)
- runs 24/7 in the cloud — no PC needed
- everything in one vercel deployment — no second service

## cost

| service | cost |
|---------|------|
| vercel (hosting + crons) | free |
| redis (storage) | free |
| grok api (post generation) | ~$0.06/month |
| **total** | **~$0.06/month** |

($5 of grok credits = ~119,000 post generations. lasts years.)

---

## setup (step by step)

### step 1: get your x.com browser cookies

these let the app post as you. no api keys needed.

1. open chrome, go to [x.com](https://x.com), log in
2. press **F12** to open devtools
3. click **Application** tab (top bar)
4. in the left sidebar, click **Cookies** > `https://x.com`
5. find `auth_token` — double-click its value, copy it, save it somewhere
6. find `ct0` — double-click its value, copy it, save it somewhere

these cookies last ~12 months. when they expire you'll see `AUTH_EXPIRED` errors — just re-export them.

### step 2: get your xAI (grok) api key

this generates the post text. grok-3-mini is dirt cheap.

1. go to [console.x.ai](https://console.x.ai/)
2. sign up or log in
3. click **API Keys** > **Create API Key**
4. copy the key, save it

you get $25 free credits on signup — that's ~119,000 post generations.

### step 3: generate a cron secret

open a terminal and run:

```bash
python3 -c "import secrets; print(secrets.token_hex(16))"
```

(or just type any long random string — it's just a password you make up to protect cron endpoints)

### step 4: deploy to vercel

1. go to [github.com/viralsachde-ftw/x-ai-poster](https://github.com/viralsachde-ftw/x-ai-poster)
2. click **Fork** (top right) to copy it to your github
3. go to [vercel.com](https://vercel.com) and sign up (free, use your github)
4. click **Add New** > **Project**
5. import your forked `x-ai-poster` repo
6. click **Deploy** (default settings are fine)

### step 5: set up redis (storage)

this stores your daily posts and duplicate history. works with any redis provider.

**option A: redis cloud (free)**
1. go to [redis.io/try-free](https://redis.io/try-free) and create an account
2. create a free database (30 MB free forever)
3. copy the **public endpoint** and **default user password**
4. your REDIS_URL will look like: `redis://default:YOUR_PASSWORD@redis-XXXXX.c123.region.ec2.cloud.redislabs.com:PORT`

**option B: upstash (free)**
1. go to [upstash.com](https://upstash.com) and create an account
2. create a free redis database (10k commands/day free)
3. copy the connection string from the dashboard

**option C: vercel kv**
1. in your vercel dashboard, go to **Storage** > **Create Database** > **KV**
2. it auto-adds `KV_REST_API_URL` and `KV_REST_API_TOKEN` to your project (also works)

### step 6: set environment variables

1. in your vercel dashboard, click on your `x-ai-poster` project
2. go to **Settings** > **Environment Variables**
3. add these one by one:

| key | value |
|-----|-------|
| `X_AUTH_TOKEN` | your `auth_token` cookie from step 1 |
| `X_CT0` | your `ct0` cookie from step 1 |
| `XAI_API_KEY` | your xAI api key from step 2 |
| `CRON_SECRET` | your random string from step 3 |

(if you used option A or B in step 5, add `REDIS_URL` here too)

### step 7: redeploy

1. go to **Deployments** tab in your vercel project
2. click the **...** menu on the latest deployment
3. click **Redeploy** (so it picks up the new env vars)

### done

that's it. everything is now running:

- **7:30 AM IST** — 3 posts auto-generated
- **~10 AM IST** — post 1 goes out (daily life topic)
- **~3 PM IST** — post 2 goes out (daily life topic)
- **~8 PM IST** — post 3 goes out (trending topic)

open your vercel URL to see the dashboard.

---

## if you get AUTOMATION_DETECTED errors

x sometimes blocks requests from cloud server IPs. if this happens, add a residential proxy:

1. sign up at [dataimpulse.com](https://dataimpulse.com) (pay-per-GB, cheapest option — pennies/month at 3 tweets/day)
2. get your proxy credentials
3. in vercel > Settings > Environment Variables, add:
   - `PROXY_URL` = `http://username:password@proxy-host:port`
4. redeploy

---

## dashboard

your vercel deployment URL (e.g. `https://x-ai-poster.vercel.app`) is your dashboard:

- **today's posts** — top section shows your 3 daily slots with the actual randomized posting time for each (e.g. "10:12 AM IST", "3:47 PM IST" — different every day). each slot has approve/regenerate/post-now buttons
- **custom** tab — type any thought and generate a post from it
- **daily life** tab — random topic from the combo system
- **trending india** tab — fetches google trends and writes a casual take

## how it works

### daily auto-posting flow

1. **7:30 AM IST** (2:00 UTC) — cron generates 3 posts with randomized posting times, stores in redis
2. **you check the dashboard** — see all 3 posts, regenerate any you don't like, approve them
3. **~10:00 AM IST** (randomized within 9:30-10:30 AM) — slot 1 posts automatically
4. **~3:00 PM IST** (randomized within 2:30-3:30 PM) — slot 2 posts automatically
5. **~8:00 PM IST** (randomized within 7:30-8:30 PM) — slot 3 posts automatically

posts go out whether you approve them or not (pending = auto-posts too). if you don't like one, regenerate it before its scheduled time.

### how posting works

the app posts directly using x's internal graphql api — the same api your browser uses when you click "Post" on x.com. it uses your browser session cookies (`auth_token` + `ct0`) to authenticate, so no official api keys or per-post charges.

### randomized posting times

each morning, every post gets a random posting time within a 1-hour window:
- slot 1: anywhere between 9:30-10:30 AM IST
- slot 2: anywhere between 2:30-3:30 PM IST
- slot 3: anywhere between 7:30-8:30 PM IST

so monday might post at 10:12 AM, tuesday at 9:47 AM, wednesday at 10:31 AM — never the same pattern.

### duplicate detection

every post is checked against the last 200 posts before posting:
- **exact match** — catches identical tweets
- **similarity check** — uses word overlap scoring (jaccard similarity). if >75% of words match a previous post, it's blocked
- during generation: auto-regenerates up to 3 times
- during posting: hard rejects with an error

### topic variety

posts come from a dynamic combo system:
- 28 categories × 28 moods × 24 angles × 30 time contexts = millions of unique prompts
- trending posts filter out indian politics, disasters, heavy stuff
- global politics allowed if funny/interesting

## troubleshooting

| error | fix |
|-------|-----|
| `AUTOMATION_DETECTED` | add `PROXY_URL` with a residential proxy |
| `AUTH_EXPIRED` | re-export cookies from x.com (step 1) |
| `RATE_LIMIT` | posting too much, stay under ~50/day |
| `DUPLICATE_TWEET` | x rejected it as duplicate — the dedup system should prevent this |
| `ACCOUNT_LOCKED` | log into x.com in browser to unlock, then re-export cookies |
| cron not firing | check vercel dashboard > Crons tab. must be a production deployment |
| `X_AUTH_TOKEN and X_CT0 must be set` | env vars not set (step 6) |
| `KV not configured` | add `REDIS_URL` env var. any redis provider works (step 5) |

## env variables reference

| variable | required | description |
|----------|----------|-------------|
| `X_AUTH_TOKEN` | yes | `auth_token` cookie from x.com browser session |
| `X_CT0` | yes | `ct0` cookie from x.com browser session |
| `XAI_API_KEY` | yes | xAI grok api key from console.x.ai |
| `CRON_SECRET` | yes | any random string to protect cron endpoints |
| `REDIS_URL` | yes* | redis connection URL — works with any provider (redis cloud, upstash, etc.) |
| `KV_REST_API_URL` | yes* | alternative: upstash/vercel kv REST API url (auto-added by vercel kv) |
| `KV_REST_API_TOKEN` | yes* | alternative: upstash/vercel kv REST API token (auto-added by vercel kv) |

*need either `REDIS_URL` alone (recommended), or a REST url+token pair
| `PROXY_URL` | no | residential proxy URL, only if AUTOMATION_DETECTED |

## local development

```bash
npm install
cp .env.example .env
# fill in your keys in .env
npx vercel dev
```

open `http://localhost:3000` for the dashboard.

cron jobs only run on vercel production. to test locally:
```bash
curl -X POST http://localhost:3000/api/cron/generate-daily \
  -H "Authorization: Bearer YOUR_CRON_SECRET"
```

## project structure

```
x-ai-poster/
├── api/
│   ├── generate.js          # generate a post (custom/daily/trending)
│   ├── post.js               # post to x (with duplicate blocking)
│   ├── today.js              # today's posts CRUD
│   ├── trending.js           # fetch trending topics
│   └── cron/
│       ├── generate-daily.js # morning post generation + random times
│       └── post-scheduled.js # randomized scheduled posting
├── lib/
│   ├── grok.js               # xAI API wrapper
│   ├── kv.js                 # redis storage + duplicate detection
│   ├── prompts.js            # voice prompt + format instructions
│   ├── topics.js             # dynamic topic combo system
│   └── twitter.js            # x graphql api client (direct posting)
├── public/
│   ├── index.html            # dashboard
│   ├── app.js                # frontend logic
│   └── style.css             # dark theme styles
├── vercel.json               # cron schedules
├── package.json
└── .env.example
```
