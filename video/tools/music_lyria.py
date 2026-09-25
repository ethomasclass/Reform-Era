"""Music cues from Google Lyria via the Gemini API: public/music/<name>.mp3 (+ .wav, gitignored).
About $0.08 per full-length cue and $0.04 per 30 s clip, billed to the Gemini key, so every
scene can have its own score and ElevenLabs credits are left for the narration.

  python3 tools/music_lyria.py revival
"""
import base64, json, os, subprocess, sys, urllib.error, urllib.request

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from voice import FFMPEG, env  # noqa: E402

OUT = os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", "public", "music")

BED = ("Instrumental only, no vocals, no lyrics. Modern documentary underscore for a history explainer in the style of "
       "investigative YouTube documentaries: tasteful, textured, cinematic; leave clear space in the midrange for a "
       "narrator; no heavy drum kit, no EDM, no pop hooks. Mix: warm and understated.")

# name: (model, prompt)
CUES = {
    "cold_open": ("lyria-3.5",
                  "A 75-second cue. Opens as a mystery: a low, patient felt-piano ostinato, muted pizzicato basses and a "
                  "soft ticking clock pulse, like investigators tracing a ship's route on a map. It tightens and "
                  "builds suspense to a sharp, dark accent at about 28 seconds, then opens up curious and restless: "
                  "brisk pizzicato strings and light percussion driving a quick montage, rising to a held, "
                  "questioning chord at the end. " + BED),
    "title_sting": ("lyria-3-clip-preview",
                    "A 10-second title sting for a history documentary called 'Fix Everything': one warm, bold "
                    "orchestral and piano hit with a low boom and a rising string swell that rings out. Instrumental only."),
    "revival": ("lyria-3.5",
                "A 90-second cue for an 1820s camp-meeting revival in upstate New York: a stomping, clapping 3/4 pulse, "
                "a droning fiddle, open-fifth harmonies with the rugged sound of shape-note Sacred Harp singing played "
                "by low strings and a wordless hummed choir pad (no words), building in fervor like a revival spreading "
                "from town to town, then settling to a warm glow at the end. " + BED),
    "spirits": ("lyria-3.5",
                "A 100-second cue: playful and eerie for a story about spirit rappings and seances in 1848: a music box, "
                "slightly detuned piano, tremolo strings and soft knocks, curious and a little comic; in the second half "
                "it turns earnest and wide for pioneers trekking west across the country. " + BED),
    "nativism": ("lyria-3.5",
                 "A 110-second cue about immigrants and the hostility they met, 1830s-1850s: opens with a sorrowful Irish "
                 "low whistle and cello lament over sustained strings (famine and emigration), then turns uneasy and "
                 "ominous with a low pulsing ostinato and dark brass swells (a mob, a burning building), then sly and "
                 "sardonic with plucked strings (a fake bestseller), ending with a tense, secretive march on muted snare. " + BED),
    "temperance": ("lyria-3.5",
                   "A 60-second cue: comic and bouncy for America's 1830s drinking habits: a honky-tonk upright piano and "
                   "fiddle with tuba and brushes, a little tipsy; halfway it shifts to hopeful and determined strings as "
                   "reformers get people to sign a pledge, ending warm and upbeat. " + BED),
    "dix": ("lyria-3.5",
            "A 60-second cue: grave, quiet and humane for a reformer documenting suffering in jails and poorhouses: a "
            "sparse solo piano and a low cello, cold and restrained, no melodrama; in the last 15 seconds a slow, "
            "hopeful rise with strings as her work succeeds. " + BED),
    "schools": ("lyria-3.5",
                "A 60-second cue: light, bright and curious for the story of the first free public schools: pizzicato "
                "strings, glockenspiel, clarinet and a bouncy piano, playful with a knowing, comic final button. " + BED),
    "curtain": ("lyria-3.5",
                "A 90-second cue for women's rights in the 1840s: starts restrained and quietly indignant (low strings, "
                "a steady piano pulse), builds with determination through rising strings and a noble horn line, and "
                "reaches a proud but restrained high point, then settles thoughtfully. " + BED),
    "utopia": ("lyria-3.5",
               "A 120-second cue in three parts: first dreamy and pastoral for writers seeking truth in nature (acoustic "
               "guitar, flute, soft strings, birdsong-like figures); then a gentle, plain hymn-like section in the style of "
               "the 1848 Shaker tune 'Simple Gifts', played by strings and flute; then it darkens into unease and quiet "
               "menace with low drones for a controlling commune, ending somber and unresolved. " + BED),
    "abolition_a": ("lyria-3.5",
                    "A 100-second cue: serious, resolute and dignified for the fight against slavery and David Walker's "
                    "Appeal of 1829: low strings and a slow, deep heartbeat drum, a solemn piano theme; tension rises for "
                    "a hidden pamphlet smuggled south and a bounty, then falls to a grieving quiet. No stereotypes. " + BED),
    "abolition_b": ("lyria-3.5",
                    "A 110-second cue: defiant and building for a newspaper editor who refuses to back down, 1831: driving "
                    "low strings and a steady pulse that grow into a powerful, uncompromising theme with timpani hits, "
                    "then danger and chaos (a mob) with dissonant strings, then a stubborn, resolved ending. " + BED),
    "ending": ("lyria-3.5",
               "A 60-second closing cue: reflective, warm piano and strings looking back over a story; in the second "
               "half it slowly turns dark and tense with low strings and brass, ending on an unresolved chord. " + BED),
}


def generate(name):
    model, prompt = CUES[name]
    body = {"model": model, "input": prompt}
    req = urllib.request.Request("https://generativelanguage.googleapis.com/v1beta/interactions",
                                 data=json.dumps(body).encode(), method="POST",
                                 headers={"x-goog-api-key": os.environ["GEMINI_API_KEY"], "Content-Type": "application/json"})
    try:
        r = json.loads(urllib.request.urlopen(req, timeout=600).read())
    except urllib.error.HTTPError as e:
        sys.exit(f"Lyria {e.code}: {e.read().decode()[:600]}")
    audio = []

    def walk(o):
        if isinstance(o, dict):
            if o.get("type") == "audio" and "data" in o:
                audio.append(o)
            for v in o.values():
                walk(v)
        elif isinstance(o, list):
            for v in o:
                walk(v)
    walk(r)
    if not audio:
        sys.exit(f"no audio in response: {json.dumps(r)[:600]}")
    os.makedirs(OUT, exist_ok=True)
    ext = "wav" if "wav" in audio[0].get("mime_type", "") else "mp3"
    raw = os.path.join(OUT, f"{name}.raw.{ext}")
    open(raw, "wb").write(base64.b64decode(audio[0]["data"]))
    mp3 = os.path.join(OUT, name + ".mp3")
    subprocess.run([FFMPEG, "-v", "error", "-y", "-i", raw, "-ar", "44100", "-ac", "2", "-b:a", "192k", mp3], check=True)
    os.remove(raw)
    dur = subprocess.run([FFMPEG, "-i", mp3], capture_output=True, text=True).stderr.split("Duration: ")[1][:11]
    print(f"music/{name}.mp3  {dur}")


if __name__ == "__main__":
    env()
    for n in sys.argv[1:] or list(CUES):
        generate(n)
