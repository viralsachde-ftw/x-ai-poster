import json
import os
import sys
import traceback
from datetime import datetime, timezone
from http.server import BaseHTTPRequestHandler

sys.path.insert(0, os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", ".."))

from lib.x_poster import do_post_tweet
from lib.redis_helper import get_today, set_today, is_kv_configured, is_duplicate, add_to_history


def _send_json(handler, status, data):
    handler.send_response(status)
    handler.send_header("Content-Type", "application/json")
    handler.end_headers()
    handler.wfile.write(json.dumps(data).encode())


class handler(BaseHTTPRequestHandler):
    def do_GET(self):
        cron_secret = os.environ.get("CRON_SECRET", "")
        auth = self.headers.get("Authorization", "")
        if auth != f"Bearer {cron_secret}":
            _send_json(self, 401, {"error": "unauthorized"})
            return

        if not is_kv_configured():
            _send_json(self, 500, {"error": "KV not configured"})
            return

        try:
            today = get_today()
            if not today or not today.get("slots"):
                _send_json(self, 200, {"message": "no posts for today"})
                return

            now = datetime.now(timezone.utc)
            current_utc = now.hour + now.minute / 60

            posted = []
            skipped = []

            for i, slot in enumerate(today["slots"]):
                if slot.get("status") == "posted":
                    continue
                if slot.get("status") not in ("approved", "pending"):
                    continue

                post_at = slot.get("postAtUTC")
                if post_at is None:
                    continue
                if current_utc < post_at:
                    continue

                if is_duplicate(slot["text"]):
                    print(f"slot {i} skipped: duplicate detected")
                    skipped.append({"slot": i, "reason": "duplicate"})
                    continue

                result = do_post_tweet(slot["text"])
                if not result.get("success"):
                    print(f"slot {i} failed: {result.get('error')}")
                    skipped.append({"slot": i, "reason": result.get("error", "unknown")})
                    continue

                add_to_history(slot["text"])
                today["slots"][i]["status"] = "posted"
                today["slots"][i]["tweetId"] = result.get("tweet_id")
                posted.append({"slot": i, "tweetId": result.get("tweet_id")})
                print(f"slot {i} posted: {slot['text'][:50]}")

            if posted or skipped:
                set_today(today)

            msg = f"posted {len(posted)} slot(s)" if posted else "nothing to post right now"
            _send_json(self, 200, {
                "success": True,
                "posted": posted,
                "skipped": skipped,
                "message": msg,
            })
        except Exception as e:
            tb = traceback.format_exc()
            print(f"post-scheduled cron error: {tb}")
            _send_json(self, 500, {"error": str(e)})
