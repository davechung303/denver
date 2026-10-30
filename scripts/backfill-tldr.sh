#!/usr/bin/env bash
# Backfill tldr field for all existing review summaries.
# Runs generate-summaries?refresh_tldr=true in batches of 50 until done.

API="https://davelovesdenver.com/api/generate-summaries?batch=50&refresh_tldr=true"
AUTH="Authorization: Bearer dld_cron_2026"
DELAY=8  # seconds between batches — gives Claude/DB time to breathe
batch=0

echo "Starting tldr backfill at $(date)"

while true; do
  batch=$((batch + 1))
  response=$(curl -s -H "$AUTH" "$API")
  processed=$(echo "$response" | grep -o '"processed":[0-9]*' | grep -o '[0-9]*')
  ok=$(echo "$response" | grep -o '"summaries_generated":[0-9]*' | grep -o '[0-9]*')
  failed=$(echo "$response" | grep -o '"failed":[0-9]*' | grep -o '[0-9]*')
  no_reviews=$(echo "$response" | grep -o '"no_reviews":[0-9]*' | grep -o '[0-9]*')

  echo "[$(date +%H:%M:%S)] batch $batch — processed=$processed generated=$ok failed=$failed no_reviews=$no_reviews"

  # Stop when nothing left to process, or when nothing was generated
  # (e.g. remaining places have no cached reviews — won't improve without a refresh)
  if [ -z "$processed" ] || [ "$processed" -eq 0 ] || [ "${ok:-0}" -eq 0 ]; then
    echo "Done — all places have tldr (or remaining have no cached reviews). Total batches: $batch"
    break
  fi

  sleep $DELAY
done
