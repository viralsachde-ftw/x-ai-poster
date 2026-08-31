import os
import re
import time
import uuid

try:
    from curl_cffi.requests import Session
    HAS_CURL = True
    CURL_ERROR = ""
except ImportError as e:
    HAS_CURL = False
    CURL_ERROR = str(e)

try:
    from bs4 import BeautifulSoup
    HAS_BS4 = True
except ImportError:
    HAS_BS4 = False

BROWSER = "chrome136"
CLIENT_UUID = str(uuid.uuid4())
BEARER = "AAAAAAAAAAAAAAAAAAAAANRILgAAAAAAnNwIzUejRCOuH5E6I8xnZz4puTs%3D1Zv7ttfk8LF81IUq16cHjhLTvJu4FA33AGWWjCpTnA"
FALLBACK_QUERY_ID = "IID9x6WsdMnTlXnzXGq8ng"

FALLBACK_FEATURES = {
    "premium_content_api_read_enabled": False,
    "communities_web_enable_tweet_community_results_fetch": True,
    "articles_preview_enabled": True,
    "c9s_tweet_anatomy_moderator_badge_enabled": True,
    "content_disclosure_ai_generated_indicator_enabled": True,
    "content_disclosure_indicator_enabled": True,
    "freedom_of_speech_not_reach_fetch_enabled": True,
    "graphql_is_translatable_rweb_tweet_is_translatable_enabled": True,
    "longform_notetweets_consumption_enabled": True,
    "longform_notetweets_inline_media_enabled": False,
    "longform_notetweets_rich_text_read_enabled": True,
    "post_ctas_fetch_enabled": True,
    "profile_label_improvements_pcf_label_in_post_enabled": True,
    "responsive_web_edit_tweet_api_enabled": True,
    "responsive_web_enhance_cards_enabled": False,
    "responsive_web_graphql_skip_user_profile_image_extensions_enabled": False,
    "responsive_web_graphql_timeline_navigation_enabled": True,
    "responsive_web_grok_analysis_button_from_backend": True,
    "responsive_web_grok_analyze_button_fetch_trends_enabled": False,
    "responsive_web_grok_analyze_post_followups_enabled": True,
    "responsive_web_grok_annotations_enabled": True,
    "responsive_web_grok_community_note_auto_translation_is_enabled": False,
    "responsive_web_grok_image_annotation_enabled": True,
    "responsive_web_grok_imagine_annotation_enabled": True,
    "responsive_web_grok_share_attachment_enabled": True,
    "responsive_web_grok_show_grok_translated_post": False,
    "responsive_web_jetfuel_frame": True,
    "responsive_web_profile_redirect_enabled": False,
    "responsive_web_twitter_article_tweet_consumption_enabled": True,
    "rweb_tipjar_consumption_enabled": False,
    "standardized_nudges_misinfo": True,
    "tweet_with_visibility_results_prefer_gql_limited_actions_policy_enabled": True,
    "verified_phone_label_enabled": True,
    "view_counts_everywhere_api_enabled": True,
}

_gql_cache = {}
_features_cache = {}
_transaction_ctx = None
_cache_ts = 0
CACHE_TTL = 3600


def _scrape_config():
    global _gql_cache, _features_cache, _transaction_ctx, _cache_ts

    if not HAS_CURL:
        return

    if _gql_cache and (time.time() - _cache_ts) < CACHE_TTL:
        return

    proxy_url = os.environ.get("PROXY_URL")
    proxies = {"https": proxy_url, "http": proxy_url} if proxy_url else None

    try:
        with Session(impersonate=BROWSER, proxies=proxies) as s:
            resp = s.get("https://x.com/x", timeout=15)
            html = resp.text

            if ">document.location =" in html:
                url = html.split('document.location = "')[1].split('"')[0]
                resp = s.get(url, timeout=15)
                html = resp.text

            try:
                from x_client_transaction import ClientTransaction
                from x_client_transaction.constants import (
                    ON_DEMAND_FILE_REGEX,
                    ON_DEMAND_HASH_PATTERN,
                    ON_DEMAND_FILE_URL,
                )

                if HAS_BS4:
                    soup = BeautifulSoup(html, "html.parser")
                    ondemand_match = ON_DEMAND_FILE_REGEX.search(html)
                    if ondemand_match:
                        chunk_id = ondemand_match.group(1)
                        hash_pattern = ON_DEMAND_HASH_PATTERN.format(chunk_id)
                        hash_match = re.search(hash_pattern, html)
                        if hash_match:
                            ondemand_url = ON_DEMAND_FILE_URL.format(filename=hash_match.group(1))
                            od_resp = s.get(ondemand_url, timeout=15)
                            if od_resp.status_code == 200:
                                _transaction_ctx = ClientTransaction(soup, od_resp.text)
            except Exception as e:
                print(f"transaction init failed: {e}")

            script_urls = re.findall(
                r'src="(https://abs\.twimg\.com/responsive-web/client-web[^"]+\.js)"',
                html,
            )

            ops = {}
            for url in script_urls:
                try:
                    js_resp = s.get(url, timeout=15)
                    if js_resp.status_code != 200:
                        continue
                    js_text = js_resp.text
                    pairs = re.findall(
                        r'queryId:"([^"]+)".+?operationName:"([^"]+)"',
                        js_text,
                    )
                    for qid, op_name in pairs:
                        ops[op_name] = qid

                    ct_match = re.search(
                        r'operationName:"CreateTweet".*?featureSwitches:\[([^\]]+)\]',
                        js_text,
                    )
                    if ct_match:
                        names = re.findall(r'"([^"]+)"', ct_match.group(1))
                        if names:
                            _features_cache.update({n: True for n in names})
                except Exception:
                    continue

            if ops:
                _gql_cache = ops
                _cache_ts = time.time()

    except Exception as e:
        print(f"scrape failed: {e}")


def _get_query_id():
    _scrape_config()
    return _gql_cache.get("CreateTweet", FALLBACK_QUERY_ID)


def _get_features():
    return _features_cache if _features_cache else FALLBACK_FEATURES


def _build_headers(method, path):
    auth_token = os.environ.get("X_AUTH_TOKEN", "")
    ct0 = os.environ.get("X_CT0", "")

    headers = {
        "authorization": f"Bearer {BEARER}",
        "cookie": f"auth_token={auth_token}; ct0={ct0}",
        "x-csrf-token": ct0,
        "content-type": "application/json",
        "x-twitter-active-user": "yes",
        "x-twitter-auth-type": "OAuth2Session",
        "x-twitter-client-language": "en",
        "x-client-uuid": CLIENT_UUID,
        "accept": "*/*",
        "accept-language": "en-US,en;q=0.9",
        "origin": "https://x.com",
        "referer": "https://x.com/compose/post",
        "sec-fetch-dest": "empty",
        "sec-fetch-mode": "cors",
        "sec-fetch-site": "same-origin",
    }

    if _transaction_ctx and method and path:
        try:
            tid = _transaction_ctx.generate_transaction_id(method=method, path=path)
            headers["x-client-transaction-id"] = tid
        except Exception as e:
            print(f"transaction id failed: {e}")

    return headers


def _classify_error(data, status_code):
    if status_code in (401, 403):
        return "AUTH_EXPIRED: Cookies invalid or expired. Re-export from x.com browser."
    errors = data.get("errors", [])
    if not errors:
        return ""
    code = errors[0].get("code") or errors[0].get("extensions", {}).get("code")
    msg = errors[0].get("message", "")
    error_map = {
        32: "AUTH_EXPIRED: Re-export cookies from browser.",
        89: "AUTH_EXPIRED: Token expired. Re-export cookies.",
        130: "RATE_LIMIT: X is over capacity. Wait and retry.",
        131: "INTERNAL_ERROR: X internal error. Wait and retry.",
        187: "DUPLICATE_TWEET: This text was already posted.",
        226: "AUTOMATION_DETECTED: Request flagged as automated. Try adding PROXY_URL.",
        326: "ACCOUNT_LOCKED: Account locked. Log in via browser to unlock.",
        344: "RATE_LIMIT: Daily tweet limit reached. Wait 24h.",
    }
    return error_map.get(code, f"X_ERROR_{code}: {msg}")


def _extract_tweet_id(data):
    try:
        results = data["data"]["create_tweet"]["tweet_results"]
        result = results.get("result") or results.get("tweet", {})
        return result.get("rest_id") or result.get("tweet", {}).get("rest_id")
    except (KeyError, TypeError, AttributeError):
        return None


def _attempt_tweet(text, query_id):
    proxy_url = os.environ.get("PROXY_URL")
    proxies = {"https": proxy_url, "http": proxy_url} if proxy_url else None

    path = f"/i/api/graphql/{query_id}/CreateTweet"
    url = f"https://x.com{path}"
    payload = {
        "variables": {
            "tweet_text": text,
            "dark_request": False,
            "media": {"media_entities": [], "possibly_sensitive": False},
            "semantic_annotation_ids": [],
        },
        "features": _get_features(),
        "queryId": query_id,
    }

    with Session(impersonate=BROWSER, proxies=proxies) as s:
        resp = s.post(
            url,
            headers=_build_headers("POST", path),
            json=payload,
            timeout=30,
        )
    return {"status_code": resp.status_code, "data": resp.json()}


def do_post_tweet(text):
    if not HAS_CURL:
        return {"success": False, "error": f"curl_cffi not available: {CURL_ERROR}"}

    query_id = _get_query_id()
    result = _attempt_tweet(text, query_id)
    data = result["data"]
    status = result["status_code"]

    if status != 200:
        err = _classify_error(data, status) or f"X API error: {status}"
        return {"success": False, "error": err}

    tweet_id = _extract_tweet_id(data)
    if tweet_id:
        return {"success": True, "tweet_id": tweet_id}

    if "errors" in data:
        err = _classify_error(data, status)
        if err.startswith("DUPLICATE_TWEET"):
            return {"success": True, "tweet_id": None}
        return {"success": False, "error": err}

    global _cache_ts
    _cache_ts = 0
    new_query_id = _get_query_id()
    result = _attempt_tweet(text, new_query_id)
    data = result["data"]
    status = result["status_code"]

    if status != 200:
        err = _classify_error(data, status) or f"X API error: {status}"
        return {"success": False, "error": err}

    tweet_id = _extract_tweet_id(data)
    if tweet_id:
        return {"success": True, "tweet_id": tweet_id}

    if "errors" in data:
        err = _classify_error(data, status)
        if err.startswith("DUPLICATE_TWEET"):
            return {"success": True, "tweet_id": None}
        return {"success": False, "error": err}

    return {"success": False, "error": "EMPTY_RESULT: Tweet silently rejected"}


def get_health():
    return {
        "status": "ok",
        "curl_cffi": HAS_CURL,
        "curl_error": CURL_ERROR if not HAS_CURL else None,
        "bs4": HAS_BS4,
        "query_id": _gql_cache.get("CreateTweet", FALLBACK_QUERY_ID),
        "query_id_source": "scraped" if _gql_cache else "fallback",
        "transaction_ctx": _transaction_ctx is not None,
        "cache_age": int(time.time() - _cache_ts) if _cache_ts else None,
    }
