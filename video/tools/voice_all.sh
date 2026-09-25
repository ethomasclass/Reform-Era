#!/bin/sh
# Voice every chapter at the locked pace. Heavier chapters (Dix, abolition, the ending) run slower.
cd "$(dirname "$0")/.."
for f in script/ch*.txt; do
  n=$(basename "$f" .txt)
  case "$n" in
    ch06_*|ch10_*|ch11_*) export VOICE_MAX_PAUSE=0.35 VOICE_SENT_GAP=0.05 VOICE_PARA_GAP=0.55 VOICE_STRETCH=1.08 ;;
    *)                    export VOICE_MAX_PAUSE=0.25 VOICE_SENT_GAP=0    VOICE_PARA_GAP=0.35 VOICE_STRETCH=1.15 ;;
  esac
  echo "== $n (stretch $VOICE_STRETCH)"
  python3 tools/voice.py "$f" "$n" 2>&1 | tail -1 || exit 1
done
