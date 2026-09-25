"""Painted scenery from Gemini image generation: public/img/gen/<name>.png

Only for scenes and objects no period image can supply. Real people,
ships and documents always come from archival images (tools/find_images.py).

  python3 tools/gemini_image.py savannah_wharf         # one entry from SCENERY
  python3 tools/gemini_image.py --list
"""
import base64, json, os, sys, urllib.error, urllib.request

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from voice import env  # noqa: E402

OUT = os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", "public", "img", "gen")
MODEL = os.environ.get("GEMINI_IMAGE_MODEL", "gemini-3-pro-image")

STYLE = ("Style: a 19th-century American oil painting in the manner of the period's marine and genre painters "
         "(1820s-1840s), tonal and atmospheric, muted earth colours with deep shadows, visible brushwork and slight "
         "craquelure. Historically accurate for the date. No text, no letters, no signature, no border, no frame.")

SCENERY = {
    "savannah_wharf": ("The Savannah River waterfront at Savannah, Georgia, at dusk in December 1829. A two-masted merchant "
                       "brig just arrived from Boston is tied up at a plain wooden wharf at the foot of a steep sandy bluff; "
                       "above it on the bluff, a row of three- and four-storey brick cotton warehouses (Factors Row) with "
                       "wooden walkways. A few lanterns glowing; cold mist on the river; a heavy grey-violet winter sky "
                       "with the last orange light low on the horizon. Small distant figures of dock workers only, no faces. "
                       "Wide cinematic composition, ship on the left third, lots of dark sky.", "16:9"),
    "coat_lining": ("A close-up still life seen from above: a worn dark-blue wool sailor's jacket of the 1820s lies open on "
                    "rough wooden planks by lantern light. The lining has been carefully unstitched along one seam, and a "
                    "thin stack of folded, printed pamphlet pages is half-hidden inside it; the printing on the pages is too "
                    "small and blurred to read. Needle and thread lie beside it. Deep shadows, warm lantern glow from the left.", "16:9"),
}


def generate(name):
    prompt, aspect = SCENERY[name]
    full = prompt + "\n\n" + STYLE
    body = {"contents": [{"parts": [{"text": full}]}],
            "generationConfig": {"responseModalities": ["IMAGE"], "imageConfig": {"aspectRatio": aspect, "imageSize": "2K"}}}
    req = urllib.request.Request(f"https://generativelanguage.googleapis.com/v1beta/models/{MODEL}:generateContent",
                                 data=json.dumps(body).encode(), method="POST",
                                 headers={"x-goog-api-key": os.environ["GEMINI_API_KEY"], "Content-Type": "application/json"})
    try:
        r = json.loads(urllib.request.urlopen(req, timeout=300).read())
    except urllib.error.HTTPError as e:
        sys.exit(f"Gemini {e.code}: {e.read().decode()[:500]}")
    for part in r["candidates"][0]["content"]["parts"]:
        if "inlineData" in part:
            os.makedirs(OUT, exist_ok=True)
            path = os.path.join(OUT, name + ".png")
            open(path, "wb").write(base64.b64decode(part["inlineData"]["data"]))
            print("wrote", path)
            return
    sys.exit(f"no image returned: {json.dumps(r)[:400]}")


if __name__ == "__main__":
    env()
    if "--list" in sys.argv:
        print("\n".join(SCENERY))
    else:
        for n in sys.argv[1:] or list(SCENERY):
            generate(n)
