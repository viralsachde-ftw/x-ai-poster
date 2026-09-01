import json
import os
import sys
import traceback
from http.server import BaseHTTPRequestHandler

sys.path.insert(0, os.path.join(os.path.dirname(os.path.abspath(__file__)), ".."))

from lib.x_poster import do_post_tweet, get_health
from lib.redis_helper import is_duplicate, add_to_history, is_kv_configured


def _send_json(handler, status, data):
    handler.send_response(status)
    handler.send_header("Content-Type", "application/json")
    handler.end_headers()
    handler.wfile.write(json.dumps(data).encode())


class handler(BaseHTTPRequestHandler):
    def do_GET(self):
        _send_json(self, 200, get_health())

    def do_POST(self):
        cron_secret = os.environ.get("CRON_SECRET", "")
        auth = self.headers.get("Authorization", "")

        if auth and auth != f"Bearer {cron_secret}":
            _send_json(self, 401, {"error": "unauthorized"})
            return

        length = int(self.headers.get("Content-Length", 0))
        body = json.loads(self.rfile.read(length)) if length > 0 else {}
        text = body.get("text", "")

        if not text:
            _send_json(self, 400, {"error": "text is required"})
            return

        if len(text) > 280:
            _send_json(self, 400, {"error": "post exceeds 280 characters"})
            return

        try:
            if is_kv_configured() and is_duplicate(text):
                _send_json(self, 400, {
                    "success": False,
                    "error": "duplicate post detected — this text is too similar to a recent post",
                })
                return

            result = do_post_tweet(text)
            status = 200 if result.get("success") else 400

            if result.get("success") and is_kv_configured():
                try:
                    add_to_history(text)
                except Exception as e:
                    print(f"add to history failed: {e}")

            _send_json(self, status, result)
        except Exception as e:
            tb = traceback.format_exc()
            print(f"tweet error: {tb}")
            _send_json(self, 500, {"success": False, "error": str(e)})
