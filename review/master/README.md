# Fix Everything — 1080p upload master

`Fix_Everything_1080p.mp4` (17:02, 1920×1080, 30 fps, H.264 + AAC 48 kHz, −14 LUFS) is split into six
parts because GitHub refuses files over 100 MB. Download all six `.part_` files into one folder, then join them.

**Mac / Linux** (Terminal, in that folder):

```
cat Fix_Everything_1080p.mp4.part_* > Fix_Everything_1080p.mp4
```

**Windows PowerShell** (the default Windows terminal, in that folder):

```
cmd /c "copy /b Fix_Everything_1080p.mp4.part_aa + Fix_Everything_1080p.mp4.part_ab + Fix_Everything_1080p.mp4.part_ac + Fix_Everything_1080p.mp4.part_ad + Fix_Everything_1080p.mp4.part_ae + Fix_Everything_1080p.mp4.part_af Fix_Everything_1080p.mp4"
```

(In PowerShell, plain `copy` is a different command that rejects the `+` syntax; `cmd /c` runs the
classic one. In the old Command Prompt, the same line works without `cmd /c "` and the closing `"`.)

**Check it** (optional): the joined file's SHA-256 should be

```
87c4fdf42206df3633bca0a5e993d81c17b5406dd95e24e83970ff5d22db9ab7
```

Mac: `shasum -a 256 Fix_Everything_1080p.mp4` · Windows PowerShell: `Get-FileHash Fix_Everything_1080p.mp4`

To rebuild the master from source instead: render the chapters with `video/tools/render_chapter.sh`,
then run `video/tools/render_full.sh`.
