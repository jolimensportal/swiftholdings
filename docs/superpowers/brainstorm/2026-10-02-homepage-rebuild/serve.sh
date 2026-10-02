#!/usr/bin/env bash
# Stable preview server for the Swift Horizon homepage rebuild (2026-10-02).
# Port never changes, so candidate URLs stay stable across sessions.
set -euo pipefail
DIR="docs/superpowers/brainstorm/2026-10-02-homepage-rebuild"
PORT=59196

if pgrep -f "http.server $PORT --directory $DIR" >/dev/null; then
  echo "already running — http://localhost:$PORT/"
  exit 0
fi

nohup python3 -m http.server "$PORT" --directory "$DIR" \
  > /tmp/preview59196.log 2>&1 &
sleep 1
echo "preview server up — http://localhost:$PORT/"
echo "chooser:  http://localhost:$PORT/index.html"
echo "1a:       http://localhost:$PORT/1a-the-ledger.html"
echo "1b:       http://localhost:$PORT/1b-the-long-room.html"
echo "1c:       http://localhost:$PORT/1c-four-rooms.html"