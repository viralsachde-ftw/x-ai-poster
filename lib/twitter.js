const crypto = require('crypto');

const BEARER =
  'AAAAAAAAAAAAAAAAAAAAANRILgAAAAAAnNwIzUejRCOuH5E6I8xnZz4puTs%3D1Zv7ttfk8LF81IUq16cHjhLTvJu4FA33AGWWjCpTnA';

const FALLBACK_QUERY_ID = 'IID9x6WsdMnTlXnzXGq8ng';

const FEATURES = {
  premium_content_api_read_enabled: false,
  communities_web_enable_tweet_community_results_fetch: true,
  articles_preview_enabled: true,
  c9s_tweet_anatomy_moderator_badge_enabled: true,
  content_disclosure_ai_generated_indicator_enabled: true,
  content_disclosure_indicator_enabled: true,
  freedom_of_speech_not_reach_fetch_enabled: true,
  graphql_is_translatable_rweb_tweet_is_translatable_enabled: true,
  longform_notetweets_consumption_enabled: true,
  longform_notetweets_inline_media_enabled: false,
  longform_notetweets_rich_text_read_enabled: true,
  post_ctas_fetch_enabled: true,
  profile_label_improvements_pcf_label_in_post_enabled: true,
  responsive_web_edit_tweet_api_enabled: true,
  responsive_web_enhance_cards_enabled: false,
  responsive_web_graphql_skip_user_profile_image_extensions_enabled: false,
  responsive_web_graphql_timeline_navigation_enabled: true,
  responsive_web_grok_analysis_button_from_backend: true,
  responsive_web_grok_analyze_button_fetch_trends_enabled: false,
  responsive_web_grok_analyze_post_followups_enabled: true,
  responsive_web_grok_annotations_enabled: true,
  responsive_web_grok_community_note_auto_translation_is_enabled: false,
  responsive_web_grok_image_annotation_enabled: true,
  responsive_web_grok_imagine_annotation_enabled: true,
  responsive_web_grok_share_attachment_enabled: true,
  responsive_web_grok_show_grok_translated_post: false,
  responsive_web_jetfuel_frame: true,
  responsive_web_profile_redirect_enabled: false,
  responsive_web_twitter_article_tweet_consumption_enabled: true,
  rweb_tipjar_consumption_enabled: false,
  standardized_nudges_misinfo: true,
  tweet_with_visibility_results_prefer_gql_limited_actions_policy_enabled: true,
  verified_phone_label_enabled: true,
  view_counts_everywhere_api_enabled: true,
};

let clientUUID = null;
let cachedQueryId = null;
let cachedTransaction = null;
let cacheTimestamp = 0;
const CACHE_TTL = 3600000;

function getClientUUID() {
  if (!clientUUID) clientUUID = crypto.randomUUID();
  return clientUUID;
}

function getDispatcher() {
  const proxyUrl = process.env.PROXY_URL;
  if (!proxyUrl) return undefined;
  try {
    const { ProxyAgent } = require('undici');
    return new ProxyAgent(proxyUrl);
  } catch {
    return undefined;
  }
}

function extractTweetId(data) {
  try {
    const results = data.data.create_tweet.tweet_results;
    const result = results.result || results.tweet || {};
    return result.rest_id || (result.tweet && result.tweet.rest_id);
  } catch {
    return null;
  }
}

function classifyError(data, statusCode) {
  if (statusCode === 401 || statusCode === 403) {
    return 'AUTH_EXPIRED: Cookies invalid or expired. Re-export from x.com browser.';
  }
  const errors = data.errors || [];
  if (!errors.length) return '';
  const code = errors[0].code || (errors[0].extensions && errors[0].extensions.code);
  const msg = errors[0].message || '';
  const map = {
    32: 'AUTH_EXPIRED: Re-export cookies from browser.',
    36: 'ACCOUNT_SUSPENDED: This account is suspended.',
    64: 'ACCOUNT_SUSPENDED: This account is suspended.',
    89: 'AUTH_EXPIRED: Token expired. Re-export cookies.',
    130: 'RATE_LIMIT: X is over capacity. Wait and retry.',
    131: 'INTERNAL_ERROR: X internal error. Wait and retry.',
    187: 'DUPLICATE_TWEET: This text was already posted.',
    226: 'AUTOMATION_DETECTED: Request flagged as automated. Try adding PROXY_URL.',
    261: 'APP_SUSPENDED: Write access suspended.',
    326: 'ACCOUNT_LOCKED: Account locked. Log in via browser to unlock.',
    344: 'RATE_LIMIT: Daily tweet limit reached. Wait 24h.',
  };
  return map[code] || `X_ERROR_${code}: ${msg}`;
}

async function scrapeConfig() {
  if (cachedTransaction && cachedQueryId && (Date.now() - cacheTimestamp) < CACHE_TTL) {
    return { queryId: cachedQueryId, transaction: cachedTransaction };
  }

  console.log('scraping X JS bundles for fresh queryId + transaction context...');

  let ClientTransaction, fetchXDocument;
  try {
    const mod = require('x-client-transaction-id');
    ClientTransaction = mod.ClientTransaction;
    fetchXDocument = mod.fetchXDocument;
  } catch (e) {
    console.log('x-client-transaction-id not available:', e.message);
    return { queryId: cachedQueryId || FALLBACK_QUERY_ID, transaction: null };
  }

  let transaction = null;
  try {
    const document = await fetchXDocument();
    transaction = await ClientTransaction.create(document);
    console.log('transaction context initialized');
  } catch (e) {
    console.log('transaction init failed:', e.message);
  }

  let queryId = null;
  try {
    const htmlRes = await fetch('https://x.com/home', {
      headers: {
        'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/135.0.0.0 Safari/537.36',
        'accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
      },
      signal: AbortSignal.timeout(10000),
    });
    const html = await htmlRes.text();
    const scriptUrls = [];
    const scriptRe = /src="(https:\/\/abs\.twimg\.com\/responsive-web\/client-web[^"]+\.js)"/g;
    let m;
    while ((m = scriptRe.exec(html)) !== null) {
      scriptUrls.push(m[1]);
    }

    for (const url of scriptUrls.slice(0, 10)) {
      try {
        const bundleRes = await fetch(url, { signal: AbortSignal.timeout(10000) });
        const bundle = await bundleRes.text();
        const opRe = /queryId:"([A-Za-z0-9_-]+)"[^}]{0,200}operationName:"CreateTweet"/;
        const match = bundle.match(opRe);
        if (match) {
          queryId = match[1];
          console.log('resolved CreateTweet queryId from bundle:', queryId);
          break;
        }
      } catch {
        continue;
      }
    }
  } catch (e) {
    console.log('bundle scan failed:', e.message);
  }

  if (!queryId) {
    try {
      const ghRes = await fetch(
        'https://raw.githubusercontent.com/fa0311/twitter-openapi/refs/heads/main/src/config/placeholder.json',
        { signal: AbortSignal.timeout(8000) }
      );
      if (ghRes.ok) {
        const data = await ghRes.json();
        if (data.CreateTweet && data.CreateTweet.queryId) {
          queryId = data.CreateTweet.queryId;
          console.log('resolved CreateTweet queryId from github:', queryId);
        }
      }
    } catch (e) {
      console.log('github queryId lookup failed:', e.message);
    }
  }

  queryId = queryId || FALLBACK_QUERY_ID;
  cachedQueryId = queryId;
  if (transaction) cachedTransaction = transaction;
  cacheTimestamp = Date.now();

  return { queryId, transaction };
}

async function postTweet(text) {
  const authToken = process.env.X_AUTH_TOKEN;
  const ct0 = process.env.X_CT0;

  if (!authToken || !ct0) {
    throw new Error('X_AUTH_TOKEN and X_CT0 must be set');
  }

  const { queryId, transaction } = await scrapeConfig();

  const path = `/i/api/graphql/${queryId}/CreateTweet`;
  const url = `https://x.com${path}`;

  const headers = {
    authorization: `Bearer ${BEARER}`,
    cookie: `auth_token=${authToken}; ct0=${ct0}`,
    'x-csrf-token': ct0,
    'content-type': 'application/json',
    'x-twitter-active-user': 'yes',
    'x-twitter-auth-type': 'OAuth2Session',
    'x-twitter-client-language': 'en',
    'x-client-uuid': getClientUUID(),
    accept: '*/*',
    'accept-language': 'en-US,en;q=0.9',
    origin: 'https://x.com',
    referer: 'https://x.com/compose/post',
    'sec-fetch-dest': 'empty',
    'sec-fetch-mode': 'cors',
    'sec-fetch-site': 'same-origin',
  };

  if (transaction) {
    try {
      const tid = await transaction.generateTransactionId('POST', path);
      headers['x-client-transaction-id'] = tid;
    } catch (e) {
      console.log('transaction id generation failed:', e.message);
    }
  }

  const payload = {
    variables: {
      tweet_text: text,
      dark_request: false,
      media: { media_entities: [], possibly_sensitive: false },
      semantic_annotation_ids: [],
    },
    features: FEATURES,
    queryId,
  };

  const dispatcher = getDispatcher();
  const fetchOpts = {
    method: 'POST',
    headers,
    body: JSON.stringify(payload),
  };
  if (dispatcher) fetchOpts.dispatcher = dispatcher;

  let res = await fetch(url, fetchOpts);

  if (res.status === 404) {
    console.log('got 404, forcing config refresh and retrying...');
    cacheTimestamp = 0;
    const fresh = await scrapeConfig();
    const freshPath = `/i/api/graphql/${fresh.queryId}/CreateTweet`;
    const freshUrl = `https://x.com${freshPath}`;
    fetchOpts.body = JSON.stringify({ ...payload, queryId: fresh.queryId });
    if (fresh.transaction) {
      try {
        headers['x-client-transaction-id'] = await fresh.transaction.generateTransactionId('POST', freshPath);
      } catch {}
    }
    fetchOpts.headers = headers;
    res = await fetch(freshUrl, fetchOpts);
  }

  let data;
  try {
    const body = await res.text();
    data = JSON.parse(body);
  } catch {
    throw new Error(`X API returned invalid response (status ${res.status}). Check your X_AUTH_TOKEN and X_CT0 cookies — they may be expired or incorrect.`);
  }

  if (res.status !== 200) {
    const err = classifyError(data, res.status) || `X API error: ${res.status}`;
    throw new Error(err);
  }

  const tweetId = extractTweetId(data);
  if (tweetId) {
    return { data: { id: tweetId } };
  }

  if (data.errors) {
    const err = classifyError(data, res.status);
    if (err.startsWith('DUPLICATE_TWEET')) {
      return { data: { id: null } };
    }
    throw new Error(err);
  }

  throw new Error(
    'EMPTY_RESULT: Tweet may have been silently rejected (rate-limit, duplicate, or account restriction)'
  );
}

module.exports = { postTweet };
