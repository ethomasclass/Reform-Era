"""Collage-ready versions of archival images: torn-paper cut-outs, high-contrast black-and-white and halftone.

  python3 tools/collage_prep.py            # builds everything in JOBS into public/img/prep/
"""
import os, random
import numpy as np
from PIL import Image, ImageDraw, ImageFilter, ImageOps

HERE = os.path.dirname(os.path.abspath(__file__))
PUB = os.path.join(HERE, "..", "public", "img")
OUT = os.path.join(PUB, "prep")
PAPER = (244, 239, 230)


def torn(im, border=22, rough=10, seed=1):
    """Put the image on a sheet of paper with a torn edge; returns RGBA."""
    rnd = random.Random(seed)
    w, h = im.width + 2 * border, im.height + 2 * border
    def edge(n):
        v, out = 0.0, []
        for _ in range(n):
            v = max(0, min(rough, v + rnd.uniform(-2.2, 2.2)))
            out.append(v)
        return out
    step = 5
    pts = []
    top = edge(w // step + 1); right = edge(h // step + 1); bot = edge(w // step + 1); left = edge(h // step + 1)
    pts += [(i * step, top[i]) for i in range(len(top))]
    pts += [(w - right[i], i * step) for i in range(len(right))]
    pts += [(w - i * step, h - bot[i]) for i in range(len(bot))]
    pts += [(left[i], h - i * step) for i in range(len(left))]
    mask = Image.new("L", (w, h), 0)
    ImageDraw.Draw(mask).polygon(pts, fill=255)
    mask = mask.filter(ImageFilter.GaussianBlur(0.7))
    sheet = Image.new("RGBA", (w, h), PAPER + (255,))
    sheet.paste(im.convert("RGB"), (border, border))
    sheet.putalpha(mask)
    return sheet


def bw(im, contrast=1.0):
    g = ImageOps.autocontrast(ImageOps.grayscale(im), cutoff=1)
    if contrast != 1.0:
        a = np.asarray(g).astype(float) / 255
        a = np.clip((a - 0.5) * contrast + 0.5, 0, 1)
        g = Image.fromarray((a * 255).astype(np.uint8))
    return g.convert("RGB")


def halftone(im, cell=9, ink=(20, 20, 24)):
    """Ink dots on transparent: dot area follows darkness."""
    g = np.asarray(ImageOps.autocontrast(ImageOps.grayscale(im), cutoff=1)).astype(float) / 255
    h, w = g.shape
    scale = 3
    out = Image.new("L", (w * scale, h * scale), 0)
    d = ImageDraw.Draw(out)
    for y in range(0, h, cell):
        for x in range(0, w, cell):
            dark = 1 - g[y:y + cell, x:x + cell].mean()
            r = cell / 2 * 1.35 * dark ** 0.6 * scale
            if r > 0.4 * scale:
                cx, cy = (x + cell / 2) * scale, (y + cell / 2) * scale
                d.ellipse((cx - r, cy - r, cx + r, cy + r), fill=255)
    out = out.resize((w, h), Image.LANCZOS)
    rgba = Image.new("RGBA", (w, h), ink + (0,))
    rgba.putalpha(out)
    return rgba


def crop(im, box):
    x0, y0, x1, y1 = box
    return im.crop((int(x0 * im.width), int(y0 * im.height), int(x1 * im.width), int(y1 * im.height)))


def load(p):
    return Image.open(os.path.join(PUB, p)).convert("RGB")


def main():
    os.makedirs(OUT, exist_ok=True)
    save = lambda im, n: im.save(os.path.join(OUT, n), optimize=True)
    wharf = load("gen/savannah_wharf.jpg")
    save(torn(bw(wharf, 1.25).resize((1400, 781)), seed=3), "wharf_bw_torn.png")
    save(halftone(wharf.resize((1600, 893)), cell=8), "wharf_halftone.png")
    walker = load("test/walker_p1.jpg")
    save(torn(walker.resize((744, 1200)), border=16, seed=5), "walker_torn.png")
    coat = load("gen/coat_lining.jpg")
    save(torn(bw(coat, 1.15).resize((1100, 614)), seed=9), "coat_bw_torn.png")
    dix = load("test/dix.jpg")
    portrait = crop(dix, (0.17, 0.13, 0.85, 0.88))
    save(torn(bw(portrait, 1.2).resize((620, int(620 * portrait.height / portrait.width))), seed=11), "dix_bw_torn.png")
    portrait.save(os.path.join(OUT, "dix_portrait.jpg"), quality=90)
    page = load("test/dix_p2.jpg")
    save(torn(page.resize((1026, 1500)), border=14, seed=13), "dix_page_torn.png")
    dp = load("test/drunkards_progress.jpg")
    art = dp.crop((384, 255, 2016, 1440))
    save(torn(art.resize((1400, int(1400 * art.height / art.width))), seed=17), "drunkards_torn.png")
    save(torn(bw(art, 1.1).resize((1400, int(1400 * art.height / art.width))), seed=17), "drunkards_bw_torn.png")
    art.save(os.path.join(OUT, "drunkards_art.jpg"), quality=90)
    print("done")


if __name__ == "__main__":
    main()
