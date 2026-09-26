#!/bin/sh
# Join the chapter renders into the full video and master it once:   tools/render_full.sh
# Uses the high-quality raw renders (out/chNN_raw.mp4, written by render_chapter.sh), so the picture
# is encoded only once more, and loudness is normalized across the whole programme to -14 LUFS.
cd "$(dirname "$0")/.."
FF=$(python3 -c "import imageio_ffmpeg;print(imageio_ffmpeg.get_ffmpeg_exe())")
LIST=out/full_list.txt
: > $LIST
for n in 01 02 03 04 05 06 07 08 09 10 11; do
  [ -f out/ch${n}_raw.mp4 ] || { echo "missing out/ch${n}_raw.mp4 (run tools/render_chapter.sh first)"; exit 1; }
  echo "file '$(pwd)/out/ch${n}_raw.mp4'" >> $LIST
done
# Video is copied as-is (every chapter comes from the same encoder settings); audio is decoded to PCM so
# the chapter joins are sample-accurate before the single mastering pass.
$FF -v error -y -f concat -safe 0 -i $LIST -c:v copy -c:a pcm_s16le out/full_raw.mkv || exit 1
python3 tools/master.py out/full_raw.mkv out/Fix_Everything_1080p.mp4 || exit 1
mkdir -p ../review
$FF -v error -y -i out/Fix_Everything_1080p.mp4 -vf scale=1280:720 -c:v libx264 -crf 23 -preset slow -c:a aac -b:a 160k -movflags +faststart ../review/Fix_Everything_720p.mp4 || exit 1
echo "done Fix_Everything"
