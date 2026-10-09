# Fix Everything: YouTube Shorts

Two vertical (1080×1920) shorts cut from the full video. The narration, on-screen titles and notes, pictures and music
are the video's own, laid out for a phone screen. The only new asset is a 7-second outro line in the same voice clone
and pace: "Want the rest of the story? Watch the full video, Fix Everything, right here on the channel. And subscribe for
more 15 Minute History." It plays over the Fix Everything thumbnail, then the wordmark and SUBSCRIBE.

Code: `video/src/shorts/` (`Short.tsx` = the vertical shell; one file per short). Compositions `Short-Fox` and
`Short-Temperance`. Render with `npx remotion render src/index.ts Short-Fox out/shorts/raw.mp4`, then
`python3 tools/master.py out/shorts/raw.mp4 <final>.mp4` (−14 LUFS).

## Covers (thumbnails)

YouTube doesn't document which frame it picks for a Short's cover, and you can choose one in the YouTube app. So:
- **Frame 0 is a finished cover:** the hook headline on orange tape plus the strongest picture, fully drawn.
- **The headline stays on screen for the whole short**, so any frame YouTube grabs reads as a thumbnail.
- **The 25%, 50% and 75% points were checked:** each shows a picture with the headline, never a half-finished cut or the outro.
- **To choose it yourself:** pick **0:00** in the app (the Shorts editor → thumbnail → scrub to the start).

## Short 1 · The Fox sisters ("Knock once for yes…")

**File:** `review/shorts/Fix_Everything_Short_Fox_Sisters.mp4` (about 58 s, −14 LUFS)
**Narration:** ch03 0:06–0:56, "Take 1848. Hydesville, New York…" through "She'd been cracking her toe joints." + the outro
**Cover (0:00):** the 1852 daguerreotype of Kate and Maggie Fox, coral-tinted and traced in teal, under KNOCK ONCE / FOR YES…
**Music:** `spirits.mp3` (the playful-eerie music box cue; its first ~50 s were written for the Fox sisters), dipped under the Civil War beat

**Caption (title)**
```
Two Sisters Fooled America for 40 Years… With Their Toes 👻
```
Alternate: `The Fox Sisters: Knock Once for Yes 👻`

**Description**
```
In 1848, two sisters in Hydesville, New York said a spirit was knocking in their house. Their séances launched a movement that reached all the way to the White House. Forty years later, one of them admitted how she did it.

▶ Watch the full 15-minute story: <link to Fix Everything>
🔔 Subscribe for more 15 Minute History.

#history #APUSH #USHistory
```

## Short 2 · The Temperance Movement ("Americans drank 7 gallons a year")

**File:** `review/shorts/Fix_Everything_Short_Temperance.mp4` (about 68 s, −14 LUFS; Shorts can run up to 3 minutes)
**Narration:** ch05 0:05–1:04, "Because here's a number that sounds made up…" through "…it started with people signing a piece of paper." + the outro
**Cover (0:00):** seven jugs on the desk under AMERICANS DRANK / 7 GALLONS A YEAR
**Music:** `temperance.mp3` (the chapter's own honky-tonk piano, fiddle and tuba), dipped under "the damage everywhere"

**Caption (title)**
```
Americans Used to Drink 7 Gallons of Alcohol a Year 🥃
```
Alternate: `Whiskey Was Cheaper Than Milk 🥃`

**Description**
```
Around 1830, the average American adult drank about seven gallons of pure alcohol a year, roughly three times what Americans drink today. Then the Temperance Movement got hundreds of thousands of people to sign a pledge, and it actually worked.

▶ Watch the full 15-minute story: <link to Fix Everything>
🔔 Subscribe for more 15 Minute History.

#history #APUSH #USHistory
```

## Upload settings (both)

- **Related video:** link the full *Fix Everything* video, so the "full video is linked below" line in the outro has something to tap.
- **Altered or synthetic content:** the Temperance short includes two AI-illustrated scenes (the whiskey ration and the breakfast), so answer **Yes**. The Fox short uses only archival pictures; its narration is your voice clone, so answer as you did for the full video.
- **Category:** Education.
