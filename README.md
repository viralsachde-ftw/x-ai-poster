# x poster

ai-powered x/twitter auto-poster that writes posts in your voice, powered by grok (xAI). posts for free using x-automation — no official x api, no per-post charges.

generates posts as a 24 year old guy from bombay/ahmedabad. lowercase, casual, unpolished, dry humor, sometimes lonely, sometimes funny. no corporate language, no motivational bs.

## what it does

- generates 3 posts every morning automatically (2 daily life + 1 trending topic)
- posts them at randomized times throughout the day (~10 AM, ~3 PM, ~8 PM IST)
- you can preview, approve, regenerate, or post manually from the dashboard
- hard-blocks duplicate/similar posts (checks last 200 posts)
- runs 24/7 in the cloud — no PC needed

## cost

| service | cost |
|---------|------|
| vercel (hosting + crons) | free |
| vercel kv (storage) | free |
| render (posting service) | free |
| grok api (post generation) | ~$0.06/month |
| residential proxy (only if needed) | $0-3/month |
| **total** | **$0-3/month** |

---

## setup (step by step)

### step 1: get your x.com browser cookies

these are used by x-automation to post as you. no api keys needed.

1. open chrome, go to [x.com](https://x.com), log in
2. press **F12** to open devtools
3. click **Application** tab (top bar)
4. in the left sidebar, click **Cookies** > `https://x.com`
5. find `auth_token` — double-click its value, copy it, save it somewhere
6. find `ct0` — double-click its value, copy it, save it somewhere

these cookies last ~12 months. when they expire you'll see `AUTH_EXPIRED` errors — just re-export them.

### step 2: generate your api keys

you need two random strings. open a terminal and run:

```bash
# generates a random api key for x-automation
python3 -c "import secrets; print(secrets.token_hex(32))"

# generates a random cron secret for vercel
python3 -c "import secrets; print(secrets.token_hex(16))"
```

save both somewhere. first one = `X_AUTOMATION_API_KEY`, second one = `CRON_SECRET`.

(if you don't have python, just type any long random string — it's just a password you make up)

### step 3: deploy x-automation on render (posting service)

this is the service that actually posts to x. it's a separate python app.

1. go to [github.com/elnino-hub/x-automation](https://github.com/elnino-hub/x-automation)
2. click **Fork** (top right) to copy it to your github
3. go to [render.com](https://render.com) and sign up (free)
4. click **New** > **Web Service**
5. connect your github account, select your forked `x-automation` repo
6. fill in the settings:

| setting | value |
|---------|-------|
| Name | `x-automation` (or anything) |
| Runtime | `Python 3` |
| Build Command | `pip install -r requirements.txt` |
| Start Command | `uvicorn execution.main:app --host 0.0.0.0 --port $PORT` |
| Instance Type | `Free` |

7. click **Environment** in the left sidebar, add these variables:

| key | value |
|-----|-------|
| `X_AUTH_TOKEN` | your `auth_token` cookie from step 1 |
| `X_CT0` | your `ct0` cookie from step 1 |
| `API_KEY` | the first random string from step 2 |
| `PROXY_URL` | leave blank for now (see step 3b if needed) |

8. click **Deploy Web Service**
9. wait 2-3 minutes for it to deploy

#### test it

render gives you a URL like `https://x-automation-xxxx.onrender.com`. open these in your browser:

- `https://x-automation-xxxx.onrender.com/health` — should show json with cache info
- `https://x-automation-xxxx.onrender.com/ip` — shows the outbound IP

save this URL — you'll need it in step 5.

#### step 3b: if you get AUTOMATION_DETECTED errors

render uses datacenter IPs which x sometimes blocks. if posting fails with `AUTOMATION_DETECTED`:

1. sign up at [dataimpulse.com](https://dataimpulse.com) (pay-per-GB, cheapest option)
2. get your proxy credentials
3. go to render dashboard > your service > **Environment**
4. set `PROXY_URL` to `http://username:password@proxy-host:port`
5. redeploy

at 3 tweets/day this costs literal pennies per month.

### step 4: get your xAI (grok) api key

this is for generating post text. grok-3-mini is dirt cheap.

1. go to [console.x.ai](https://console.x.ai/)
2. sign up or log in
3. click **API Keys** > **Create API Key**
4. copy the key, save it

you get $25 free credits on signup. at ~$0.00021 per generation, that's ~119,000 posts worth.

### step 5: deploy x-ai-poster on vercel (this repo)

this is the main app — dashboard + cron jobs + post generation.

1. go to [github.com/viralsachde-ftw/x-ai-poster](https://github.com/viralsachde-ftw/x-ai-poster)
2. click **Fork** to copy it to your github
3. go to [vercel.com](https://vercel.com) and sign up (free, use your github)
4. click **Add New** > **Project**
5. import your forked `x-ai-poster` repo
6. click **Deploy** (default settings are fine)

### step 6: set up vercel kv (storage)

this stores your daily posts and duplicate history.

1. in your vercel dashboard, click on your `x-ai-poster` project
2. go to **Storage** tab
3. click **Create Database** > **KV**
4. select **Hobby (Free)**
5. click **Create & Connect**
6. it automatically adds `KV_REST_API_URL` and `KV_REST_API_TOKEN` to your project

### step 7: set environment variables

1. in your vercel dashboard, click on your `x-ai-poster` project
2. go to **Settings** > **Environment Variables**
3. add these one by one:

| key | value |
|-----|-------|
| `X_AUTOMATION_URL` | your render URL from step 3 (e.g. `https://x-automation-xxxx.onrender.com`) |
| `X_AUTOMATION_API_KEY` | the first random string from step 2 (same as render's `API_KEY`) |
| `XAI_API_KEY` | your xAI api key from step 4 |
| `CRON_SECRET` | the second random string from step 2 |

(`KV_REST_API_URL` and `KV_REST_API_TOKEN` should already be there from step 6)

### step 8: redeploy

1. go to **Deployments** tab in your vercel project
2. click the **...** menu on the latest deployment
3. click **Redeploy** (so it picks up the new env vars)

### step 9: set up keep-alive ping (optional but recommended)

render free tier spins down after 15 min of inactivity. first request after spindown takes ~30-50 seconds which can cause timeouts.

1. go to [uptimerobot.com](https://uptimerobot.com) (free)
2. sign up, click **Add New Monitor**
3. type: **HTTP(s)**
4. URL: `https://x-automation-xxxx.onrender.com/health`
5. monitoring interval: **5 minutes**
6. click **Create Monitor**

this keeps your render service warm 24/7.

### done

that's it. everything is now running:

- **7:30 AM IST** — 3 posts auto-generated
- **~10 AM IST** — post 1 goes out (daily life topic)
- **~3 PM IST** — post 2 goes out (daily life topic)
- **~8 PM IST** — post 3 goes out (trending topic)

open your vercel URL to see the dashboard. you can preview today's posts, regenerate ones you don't like, or post manually.

---

## dashboard

your vercel deployment URL (e.g. `https://x-ai-poster.vercel.app`) is your dashboard:

- **today's posts** — top section shows your 3 daily slots with approve/regenerate/post-now buttons
- **custom** tab — type any thought and generate a post from it
- **daily life** tab — random topic from the combo system
- **trending india** tab — fetches google trends and writes a casual take

## how the anti-detection works

### randomized posting times

each morning, every post gets a random posting time within a 1-hour window:
- slot 1: anywhere between 9:30-10:30 AM IST
- slot 2: anywhere between 2:30-3:30 PM IST
- slot 3: anywhere between 7:30-8:30 PM IST

so monday might post at 10:12 AM, tuesday at 9:47 AM, wednesday at 10:31 AM — never the same pattern.

### duplicate detection

every post is checked against your last 200 posts:
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
| `AUTOMATION_DETECTED` | add a residential proxy (step 3b) |
| `AUTH_EXPIRED` | re-export cookies from x.com (step 1) |
| `RATE_LIMIT` | posting too much, stay under ~50/day |
| `DUPLICATE_TWEET` | x rejected it as duplicate — the dedup system should prevent this |
| cron not firing | check vercel dashboard > Crons tab. make sure you're on a production deployment |
| render cold start timeout | set up uptimerobot keep-alive (step 9) |
| `X_AUTOMATION_URL and X_AUTOMATION_API_KEY must be set` | env vars not set in vercel (step 7) |
| `KV not configured` | vercel kv not connected (step 6) |

## env variables reference

| variable | where | description |
|----------|-------|-------------|
| `X_AUTOMATION_URL` | vercel | URL of your render x-automation service |
| `X_AUTOMATION_API_KEY` | vercel | must match the `API_KEY` you set on render |
| `XAI_API_KEY` | vercel | grok api key from console.x.ai |
| `CRON_SECRET` | vercel | random string protecting cron endpoints |
| `KV_REST_API_URL` | vercel | auto-added by vercel kv |
| `KV_REST_API_TOKEN` | vercel | auto-added by vercel kv |
| `X_AUTH_TOKEN` | render | auth_token cookie from x.com |
| `X_CT0` | render | ct0 cookie from x.com |
| `API_KEY` | render | same value as `X_AUTOMATION_API_KEY` on vercel |
| `PROXY_URL` | render | residential proxy URL (optional) |

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
│   ├── kv.js                 # vercel kv + duplicate detection
│   ├── prompts.js            # voice prompt + format instructions
│   ├── topics.js             # dynamic topic combo system
│   └── twitter.js            # x-automation HTTP client
├── public/
│   ├── index.html            # dashboard
│   ├── app.js                # frontend logic
│   └── style.css             # dark theme styles
├── vercel.json               # cron schedules
├── package.json
└── .env.example
```
