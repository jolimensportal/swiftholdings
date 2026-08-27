#!/usr/bin/env bash
# Stable preview server for the Swift Project homepage visual redesign.
# Serves the brainstorm dir on port 59195 so candidate URLs never change.
set -euo pipefail
DIR="docs/superpowers/brainstorm/2026-08-21-homepage-visual"
PORT=59195

if pgrep -f "http.server $PORT --directory $DIR" >/dev/null; then
  echo "already running — http://localhost:$PORT/"
  exit 0
fi

nohup python3 -m http.server "$PORT" --directory "$DIR" \
  > /tmp/preview59195.log 2>&1 &
sleep 1
echo "preview server up — http://localhost:$PORT/"
echo "chooser:  http://localhost:$PORT/index.html"