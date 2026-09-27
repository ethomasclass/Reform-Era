# Handoff: Fix Everything: America's Reform Era

A 17:02 YouTube history video, finished and ready to upload. This page covers where everything is, how the
video is built, and how to change or rebuild it.

**Branch:** `claude/charming-tesla-rtj8kl` on `ethomasclass/Reform-Era`

## API keys

The pipeline uses two paid services. Their keys belong in `video/.env`, which git ignores and which is never
committed:

```
ELEVENLABS_API_KEY=...   # narration, word timings, sound effects
VOICE_ID=...             # the ElevenLabs narrator voice
GEMINI_API_KEY=...       # AI images (gemini-3-pro-image) and music (Lyria)
```

The values are **not** in this repository. They were handed over separately in `HANDOFF_KEYS.local.md`.
Anyone who has seen those keys can spend on those accounts, so rotate them in the ElevenLabs and Google AI
Studio dashboards when the project changes hands or if they are ever pasted somewhere public.

You only need keys to make **new** narration, images or music. Rendering the video from what is already here
needs no keys: every voice take, image and music cue is committed.

## Where things are

| What | Where |
|---|---|
| YouTube upload master, 1080p, −14 LUFS | `review/master/` (six parts; join them as its README explains) |
| 720p copy (92 MB) and 480p preview (27 MB) | `review/full/` |
| Eleven chapter videos, 720p | `review/chapters/` |
| Thumbnail | `review/thumbnails/Thumbnail_Fix_Everything.png` |
| YouTube title, description, chapters, tags | `review/YouTube_description.md` |
| Look and style rules | `review/DESIGN_STYLE_GUIDE.md` |
| Prompts used for the AI images | `review/GEMINI_PROMPTS.md` |
| Narration script, one file per chapter | `video/script/ch01_cold_open.txt` … `ch11_why.txt` |
| Image credits (84 archival images) | `video/public/img/credits.json` |
| AI-generated images (about a dozen scenes) | `video/public/img/gen/` |

## Chapters

| Start | Chapter | Script | Composition |
|---|---|---|---|
| 0:00 | Cold open: the pamphlet in Savannah | `ch01_cold_open.txt` | `Ch01` |
| 1:16 | Burned Over (Second Great Awakening) | `ch02_burned_over.txt` | `Ch02` |
| 2:38 | Knock Once for Yes (new religions) | `ch03_knock_once.txt` | `Ch03` |
| 4:13 | Know Nothing (immigration, nativism) | `ch04_know_nothing.txt` | `Ch04` |
| 6:03 | Seven Gallons (temperance) | `ch05_seven_gallons.txt` | `Ch05` |
| 7:08 | Cages (Dorothea Dix) | `ch06_cages.txt` | `Ch06` |
| 8:21 | The Equalizer (Horace Mann) | `ch07_equalizer.txt` | `Ch07` |
| 9:19 | The Curtain (Seneca Falls) | `ch08_curtain.txt` | `Ch08` |
| 10:49 | Utopia (Transcendentalists, Shakers, Oneida) | `ch09_utopia.txt` | `Ch09` |
| 12:50 | Not Someday (Walker, Garrison) | `ch10_now.txt` | `Ch10` |
| 16:09 | Why (conclusion) | `ch11_why.txt` | `Ch11` |

## How it's built

Same pipeline as the Jackson videos (`ethomasclass/Jackson`):

1. **Narration:** ElevenLabs `eleven_v3` via `video/tools/voice.py`, one WAV and a word-timing file per
   chapter in `video/public/audio/`. `tools/voice_all.sh` voices everything at the locked pace; chapters 6, 10
   and 11 run slower. Requests are cached in `public/audio/cache/`, so re-running costs nothing unless the
   text changes.
2. **Images:** archival images from the Library of Congress, Wikimedia Commons, Internet Archive and The Met
   (`tools/find_images.py`, `tools/commons.py`). Scenes with no surviving image come from Gemini
   (`tools/gemini_image.py`).
3. **Music:** Gemini Lyria via `tools/music_lyria.py <cue>`; the cue prompts are in its `CUES` table.
   Sound effects come from ElevenLabs (`tools/sfx_eleven.py`).
4. **Picture:** Remotion (React). Chapters are `video/src/ch/Ch01.tsx` … `Ch11.tsx`; the shared look and
   palette are in `video/src/jh/Kit.tsx`.
5. **Mastering:** `tools/master.py` normalizes loudness to YouTube's −14 LUFS (true peak −1.5 dBTP).

## Setup

```sh
cd video
npm install
pip install pillow numpy imageio-ffmpeg scipy
cp /path/to/keys video/.env     # only needed for new narration, images or music
export REMOTION_CHROME=$(ls -d /opt/pw-browsers/chromium_headless_shell-*/chrome-linux/headless_shell | head -1)
```

Off Claude's cloud machines, point `REMOTION_CHROME` at any Chrome or Chromium, or leave out
`--browser-executable` and let Remotion download its own.

## Common changes

**Change a line of narration**
1. Edit the chapter's script in `video/script/`.
2. Re-voice that chapter. Use the same pace settings as `tools/voice_all.sh`, e.g. for chapter 4:
   `VOICE_MAX_PAUSE=0.25 VOICE_SENT_GAP=0 VOICE_PARA_GAP=0.35 VOICE_STRETCH=1.15 python3 tools/voice.py script/ch04_know_nothing.txt ch04_know_nothing`
3. Check the chapter's timings in `src/ch/Ch04.tsx`. Scenes are keyed to the word timings, so a changed
   line can shift what follows.
4. Re-render it: `tools/render_chapter.sh 04 Ch04_Know_Nothing`.

**Rebuild the full video**
1. Render every chapter with `tools/render_chapter.sh 01 Ch01_Cold_Open 02 Ch02_Burned_Over …`, which writes
   the raw renders to `video/out/`.
2. Run `tools/render_full.sh` to join them and master once, into `video/out/Fix_Everything_1080p.mp4`.

**Preview while editing:** `npx remotion studio` from `video/` opens every composition in the browser.

## Things to know

- **Disk space:** the full render needs about 2 GB free while it runs. `video/out/` is safe to empty; it holds
  only renders.
- **GitHub's 100 MB limit:** the 1080p master had to be split into parts to fit, as `review/master/` shows.
  Split any other file that large the same way, or use Git LFS.
- **AI disclosure:** when uploading, YouTube asks about altered or synthetic content. The AI-illustrated scenes
  could pass for real historical images, so answer **Yes**.
- **Next video:** the ending sets up "how the fight over slavery split the country in two."
