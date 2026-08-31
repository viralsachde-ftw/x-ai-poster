import json
import os
import re


def _get_redis_url():
    return os.environ.get("REDIS_URL") or os.environ.get("KV_URL")


def _get_redis():
    url = _get_redis_url()
    if not url:
        return None
    try:
        import redis
        return redis.from_url(url, decode_responses=True, socket_timeout=10)
    except Exception as e:
        print(f"redis connect failed: {e}")
        return None


def is_kv_configured():
    return bool(_get_redis_url())


def get_today():
    r = _get_redis()
    if not r:
        return None
    raw = r.get("posts:today")
    if not raw:
        return None
    try:
        return json.loads(raw)
    except Exception:
        return None


def set_today(data):
    r = _get_redis()
    if not r:
        return
    r.set("posts:today", json.dumps(data), ex=86400)


def _normalize(text):
    return re.sub(r"\s+", " ", text.lower().strip())


def _get_words(text):
    return [w for w in _normalize(text).split(" ") if len(w) > 2]


def _similarity(a, b):
    words_a = set(_get_words(a))
    words_b = set(_get_words(b))
    if not words_a or not words_b:
        return 0
    intersection = len(words_a & words_b)
    union = len(words_a | words_b)
    return intersection / union


def get_post_history():
    r = _get_redis()
    if not r:
        return []
    raw = r.get("posts:history")
    if not raw:
        return []
    try:
        return json.loads(raw)
    except Exception:
        return []


def add_to_history(text):
    r = _get_redis()
    if not r:
        return
    history = get_post_history()
    history.append(_normalize(text))
    trimmed = history[-200:]
    r.set("posts:history", json.dumps(trimmed))


def is_duplicate(text):
    if not is_kv_configured():
        return False
    history = get_post_history()
    norm = _normalize(text)
    for past in history:
        if past == norm:
            return True
        if _similarity(norm, past) > 0.75:
            return True
    return False
