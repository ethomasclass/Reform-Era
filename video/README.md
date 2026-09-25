# Fix Everything: America's Reform Era (video project)

Built with the same pipeline as the Jackson videos (`ethomasclass/Jackson`, folder `video/`): Remotion for picture,
ElevenLabs for narration, Gemini for images no archive can supply, and ffmpeg for mastering.

## Setup

```sh
cd video
npm install
pip install pillow numpy imageio-ffmpeg scipy
# create video/.env with ELEVENLABS_API_KEY, VOICE_ID, GEMINI_API_KEY (gitignored)
export REMOTION_CHROME=$(ls -d /opt/pw-browsers/chromium_headless_shell-*/chrome-linux/headless_shell | head -1)
```

## Narration pace

`tools/voice.py` has four pace controls, all set with environment variables:

| Variable | Default | What it does |
|---|---|---|
| `VOICE_SENT_GAP` | 0.45 | Silence added after each sentence (seconds) |
| `VOICE_PARA_GAP` | 0.9 | Silence between paragraphs (seconds) |
| `VOICE_MAX_PAUSE` | 0 (off) | Shortens the voice's own pauses to at most this many seconds |
| `VOICE_STRETCH` | 1.0 | Speeds the audio up without changing pitch (`eleven_v3` ignores `VOICE_SPEED`) |

Only the ElevenLabs request costs credits. It is cached in `public/audio/cache/`, so re-running with different
pace settings is free, except for one forced-alignment call per new result. Set `VOICE_NO_ALIGN=1` to skip that
call for audio-only tests.

Settings for the fastest test (about 188 wpm on the cold open):

```sh
VOICE_MAX_PAUSE=0.25 VOICE_SENT_GAP=0 VOICE_PARA_GAP=0.35 VOICE_STRETCH=1.15 python3 tools/voice.py script/test_dix.txt test_dix
```

## Style test

- Compositions: `StyleTest` (the whole reel), plus `A-Cold`, `A-Dix`, `A-Gallons` (collage) and `B-Cold`, `B-Dix`, `B-Gallons` (cinematic).
- `python3 tools/collage_prep.py` builds the torn-paper cut-outs and halftones in `public/img/prep/`.
- Stills: `node tools/stills_all.mjs '{"A-Dix":[13.3]}'` writes to `out/stills/`.
- Render: `npx remotion render src/index.ts StyleTest out/style_test.mp4 --crf=18 --browser-executable=$REMOTION_CHROME`

Image credits are in `public/img/credits.json`. The Savannah waterfront and the coat are Gemini images (`tools/gemini_image.py`).

## Full build

- Script: `script/ch01_cold_open.txt` … `script/ch11_why.txt` (one file per chapter).
- Narration: `tools/voice_all.sh` voices every chapter at the locked pace (chapters 6, 10 and 11 run slower).
  Chapter WAVs and word timings are in `public/audio/ch*.wav` / `.words.json`.
- Music: `python3 tools/music_lyria.py <cue>` (Gemini Lyria) writes `public/music/<cue>.mp3`; prompts are in `CUES`.
- Look: palette `locked` in `src/jh/Kit.tsx` (teal outlines, orange titles, coral subject); graphics step at 12 fps.
- Chapters: `src/ch/Ch01.tsx` …, composition ids `Ch01` …. Review renders go to `review/chapters/`.
