#!/bin/sh
# Render, master and export review copies: tools/render_chapter.sh 01 Ch01_Cold_Open [02 Ch02_Burned_Over ...]
cd "$(dirname "$0")/.."
export REMOTION_CHROME=$(ls -d /opt/pw-browsers/chromium_headless_shell-*/chrome-linux/headless_shell | head -1)
FF=$(python3 -c "import imageio_ffmpeg;print(imageio_ffmpeg.get_ffmpeg_exe())")
mkdir -p ../review/chapters
while [ $# -ge 2 ]; do
  n=$1; name=$2; shift 2
  npx remotion render src/index.ts Ch$n out/ch${n}_raw.mp4 --crf=18 --browser-executable=$REMOTION_CHROME --concurrency=4 > out/render_ch$n.log 2>&1 || exit 1
  python3 tools/master.py out/ch${n}_raw.mp4 out/ch${n}_1080p.mp4 || exit 1
  $FF -v error -y -i out/ch${n}_1080p.mp4 -vf scale=1280:720 -c:v libx264 -crf 23 -preset slow -c:a aac -b:a 160k -movflags +faststart ../review/chapters/${name}_720p.mp4 || exit 1
  echo "done $name"
done
