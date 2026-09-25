"""Replace the synthesized stand-in sound effects with ElevenLabs sound generation.
Writes the same filenames in public/sfx/, so no scene code changes.

  python3 tools/sfx_eleven.py            # all
  python3 tools/sfx_eleven.py shot boom  # just these
  python3 tools/sfx_eleven.py --finish   # re-trim/normalise the saved originals (free)
"""
import json, os, re, subprocess, sys, urllib.error, urllib.request

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from voice import FFMPEG, env  # noqa: E402

OUT = os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", "public", "sfx")
RAW = os.path.join(OUT, "raw")

SFX = {
    # name: (prompt, seconds)
    "marker_tick": ("A single quick stroke of a felt-tip marker on paper, close up, soft and short, one swipe, no voice.", 0.5),
    "pencil_soft": ("A soft, short graphite pencil scribble on paper, close up and gentle, a quick two-stroke note.", 0.6),
    "pen_flick": ("A light ballpoint pen flick across paper, a tiny soft scratch, very short and quiet.", 0.5),
    "knock": ("Two sharp, hollow knocks on an old wooden table in a quiet room, close up, eerie, then silence.", 1.0),
    "chalk_tap": ("A soft piece of chalk writing one quick short word on a chalkboard, gentle, close up.", 0.6),
}


def generate(name, prompt, seconds=None):
    body = {"text": prompt, "prompt_influence": 0.55}
    if seconds:
        body["duration_seconds"] = seconds
    req = urllib.request.Request("https://api.elevenlabs.io/v1/sound-generation", data=json.dumps(body).encode(),
                                 headers={"xi-api-key": os.environ["ELEVENLABS_API_KEY"],
                                          "Content-Type": "application/json"}, method="POST")
    try:
        mp3 = urllib.request.urlopen(req, timeout=180).read()
    except urllib.error.HTTPError as e:
        sys.exit(f"ElevenLabs {e.code}: {e.read().decode()[:400]}")
    os.makedirs(RAW, exist_ok=True)
    open(os.path.join(RAW, name + ".mp3"), "wb").write(mp3)   # keep the paid-for original
    finish(name)


def finish(name):
    """Trim leading silence so the hit lands on its frame, then normalise the peak to -2 dBFS."""
    src = os.path.join(RAW, name + ".mp3")
    dst = os.path.join(OUT, name + ".wav")
    trim = "silenceremove=start_periods=1:start_threshold=-50dB:start_silence=0.01"
    probe = subprocess.run([FFMPEG, "-hide_banner", "-i", src, "-af", trim + ",volumedetect", "-f", "null", "-"],
                           capture_output=True, text=True).stderr
    m = re.search(r"max_volume: ([-0-9.]+) dB", probe)
    if not m:
        sys.exit(f"{name}: nothing above -50 dB; regenerate it with a different prompt")
    peak = float(m.group(1))
    subprocess.run([FFMPEG, "-v", "error", "-y", "-i", src, "-af", f"{trim},volume={-2 - peak}dB",
                    "-ac", "2", "-ar", "44100", dst], check=True)
    print(f"sfx/ {name}  (peak {peak:.1f} dB -> -2 dB)")


if __name__ == "__main__":
    env()
    if sys.argv[1:2] == ["--finish"]:          # re-process saved originals, no credits
        for n in sys.argv[2:] or list(SFX):
            finish(n)
        sys.exit()
    names = sys.argv[1:] or list(SFX)
    for n in names:
        spec = SFX[n]
        prompt, secs = spec if isinstance(spec, tuple) else (spec, None)
        generate(n, prompt, secs)
