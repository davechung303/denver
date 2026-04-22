#!/bin/bash
# Chains Fever sync batches until complete
# Usage: ./scripts/sync-fever.sh

BASE_URL="https://davelovesdenver.com/api/sync-fever"
AUTH="Authorization: Bearer dld_cron_2026"
TOTAL=0
BATCH=1

echo "Starting Fever sync..."

NEXT_START_AFTER=""

while true; do
  if [ -z "$NEXT_START_AFTER" ]; then
    URL="$BASE_URL"
  else
    URL="$BASE_URL?startAfter=$NEXT_START_AFTER"
  fi

  echo "Batch $BATCH: $URL"
  RESPONSE=$(curl -s "$URL" -H "$AUTH")
  echo "  → $RESPONSE"

  # Check for empty or invalid JSON response
  if [ -z "$RESPONSE" ] || ! echo "$RESPONSE" | python3 -c "import sys,json; json.load(sys.stdin)" 2>/dev/null; then
    echo ""
    echo "ERROR: Batch $BATCH returned an invalid response — sync incomplete at cursor: $NEXT_START_AFTER"
    echo "Total synced before error: $TOTAL"
    exit 1
  fi

  COUNT=$(echo "$RESPONSE" | python3 -c "import sys,json; print(json.load(sys.stdin).get('count',0))" 2>/dev/null)
  NEXT=$(echo "$RESPONSE" | python3 -c "import sys,json; v=json.load(sys.stdin).get('nextStartAfter'); print(v if v else '')" 2>/dev/null)

  TOTAL=$((TOTAL + COUNT))
  BATCH=$((BATCH + 1))

  if [ -z "$NEXT" ]; then
    echo ""
    echo "Done! Total Denver events synced: $TOTAL"
    break
  fi

  NEXT_START_AFTER="$NEXT"
  sleep 2  # brief pause between batches
done
