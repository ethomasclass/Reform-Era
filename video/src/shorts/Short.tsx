// Vertical YouTube Shorts (1080x1920) cut from the Fix Everything narration. The chapter's own voice, pictures,
// notes and music are reused; the only new asset is a 7-second outro line (watch the full video, subscribe),
// voiced with the same voice clone at the same pace.
//
// Shorts rules (from the King Andrew shorts):
//  - The hook headline is on screen, fully drawn, from frame 0 to the end, so whatever frame YouTube picks for
//    the cover reads as a thumbnail. Frame 0 also shows a strong picture.
//  - Safe zone: headline y 190-470, pictures and marks y 500-1230, captions y 1250-1440, source tag y 1462.
//    YouTube covers the top ~170 px, the bottom ~460 px and the right ~130 px below y 900.
import React from 'react';
import {AbsoluteFill, Audio, Img, interpolate, Sequence, staticFile, useCurrentFrame} from 'remotion';
import {clamp} from '../lib/anim';
import type {Narration, Word} from '../lib/timing';
import {Arrow, ColourReveal, Finish, Highlight, JF, Note, PALETTES, PaletteCtx, Picture, type Place, StepCtx, Tint, Traced, usePal, useGFrame} from '../jh/Kit';
import {Card, DarkPaper, MAP, Sfx} from '../ch/common';
import {Wordmark} from '../ch/Intro';

export const SW = 1080;
export const SH = 1920;

/** Full-bleed placement for the vertical frame, centred on source pixel (fx, fy) at zoom z. */
export const fillV = (size: [number, number], fx: number, fy: number, z: number): Place => {
  const sc = Math.max(SW / size[0], SH / size[1]) * z;
  return {left: Math.min(0, Math.max(SW - size[0] * sc, SW / 2 - fx * sc)), top: Math.min(0, Math.max(SH - size[1] * sc, SH / 2 - fy * sc)), scale: sc};
};

/** Mitchell's 1836 map for the vertical frame: camera centre (cx, cy) in map pixels lands at (540, cyScreen). */
export const MapViewV: React.FC<{cx: number; cy: number; s: number; cyScreen?: number; dim?: number; children?: React.ReactNode}> = ({cx, cy, s, cyScreen = 860, dim = 0, children}) => (
  <div style={{position: 'absolute', left: 540 - cx * s, top: cyScreen - cy * s, width: MAP.w * s, height: MAP.h * s}}>
    <Img src={staticFile('img/jh/mitchell_1836.jpg')} style={{width: '100%', height: '100%', filter: `grayscale(1) sepia(0.25) contrast(1.2) brightness(${0.8 - dim})`}} />
    <svg style={{position: 'absolute', left: 0, top: 0, overflow: 'visible'}} width={MAP.w * s} height={MAP.h * s} viewBox={`0 0 ${MAP.w} ${MAP.h}`}>{children}</svg>
  </div>
);
export const mapToScreenV = (cx: number, cy: number, s: number, cyScreen = 860) => ([x, y]: number[]) => [540 + (x - cx) * s, cyScreen + (y - cy) * s];

/**
 * A picture on a cream card, cropped to a window: the source around (fx, fy) at `scale` inside a w x h window at (x, y).
 * Optional coral tint + teal trace (mask), or the colour creeping in from the right (`reveal`). `children(S)` get a
 * source -> screen mapper for loops and arrows.
 */
export const CropV: React.FC<{src: string; size: [number, number]; x: number; y: number; w: number; h: number; fx: number; fy: number; scale: number; rot?: number; at?: number;
  bw?: string; mask?: {alpha: string; paths: string[]}; traceAt?: number; reveal?: boolean; children?: (S: (sx: number, sy: number) => number[]) => React.ReactNode}> = ({
  src, size, x, y, w, h, fx, fy, scale, rot = 0, at = -999, bw = 'grayscale(1) contrast(1.2)', mask, traceAt, reveal, children,
}) => {
  const g = useGFrame();
  if (g < at) return null;
  const k = interpolate(g, [at, at + 5], [0, 1], {...clamp, easing: (q) => 1 - Math.pow(1 - q, 3) * (1 - 2.2 * q * (1 - q))});
  const left = Math.min(0, Math.max(w - size[0] * scale, w / 2 - fx * scale));
  const top = Math.min(0, Math.max(h - size[1] * scale, h / 2 - fy * scale));
  const place = {left, top, scale};
  const S = (sx: number, sy: number) => [x + left + sx * scale, y + top + sy * scale];
  return (
    <>
      <div style={{position: 'absolute', left: x - 14, top: y - 14, width: w + 28, height: h + 28, background: '#f4efe6', boxShadow: '0 18px 34px rgba(0,0,0,0.6)',
        transform: `scale(${0.6 + 0.4 * k}) rotate(${rot}deg)`, opacity: Math.min(1, k * 2)}}>
        <div style={{position: 'absolute', left: 14, top: 14, width: w, height: h, overflow: 'hidden'}}>
          <Picture src={src} place={place} size={size} bw={bw} />
          {reveal && <ColourReveal src={src} place={place} size={size} from={0.55} to={0.9} />}
          {mask && <Tint mask={mask.alpha} place={place} size={size} />}
          {mask && <Traced paths={mask.paths} place={place} at={traceAt ?? at + 5} dur={10} width={5} />}
        </div>
      </div>
      {k >= 1 && children?.(S)}
    </>
  );
};

/** Teal map pin with a handwritten label (screen coordinates). */
export const PinV: React.FC<{x: number; y: number; at: number; label?: string; dx?: number; dy?: number}> = ({x, y, at, label, dx = 22, dy = -64}) => {
  const g = useGFrame();
  const pal = usePal();
  if (g < at) return null;
  const k = interpolate(g, [at, at + 3, at + 6], [0, 1.35, 1], clamp);
  return (
    <>
      <div style={{position: 'absolute', left: x - 14, top: y - 14, width: 28, height: 28, borderRadius: '50%', background: pal.mark, border: '4px solid #111', transform: `scale(${k})`}} />
      {label && <Note text={label} x={x + dx} y={y + dy} size={44} rot={-3} at={at} />}
    </>
  );
};

/** A slice of a chapter's narration: source file stem and the seconds to keep (cut in a pause between words). */
export type Clip = {stem: string; words: Narration; from: number; to: number};

const GAP = 6;
export const layout = (clips: Clip[]) => {
  let at = 0;
  return clips.map((c) => {
    const len = Math.round((c.to - c.from) * 30);
    const r = {...c, at, len};
    at += len + GAP;
    return r;
  });
};

/** One narration (words re-timed onto the short's clock) so t.at('phrase') works across clips. */
export const joinWords = (clips: Clip[]): Narration => {
  const placed = layout(clips);
  const words: Word[] = [];
  for (const c of placed) {
    for (const w of c.words.words) {
      if (w.s >= c.from && w.e <= c.to) words.push({...w, s: w.s - c.from + c.at / 30, e: w.e - c.from + c.at / 30});
    }
  }
  const last = placed[placed.length - 1];
  return {voice: 'short', duration: (last.at + last.len) / 30, words};
};

/** Word-synced captions: chunks of up to 3 words (breaking at punctuation), the spoken word in teal. */
const Captions: React.FC<{n: Narration; y?: number}> = ({n, y = 1250}) => {
  const frame = useCurrentFrame();
  const pal = usePal();
  const t = frame / 30;
  const chunks: Word[][] = [];
  let cur: Word[] = [];
  for (const w of n.words) {
    cur.push(w);
    if (cur.length === 3 || /[.,?!:;"”—]$/.test(w.w) || w.para_end) {
      chunks.push(cur);
      cur = [];
    }
  }
  if (cur.length) chunks.push(cur);
  const i = chunks.findIndex((c, k) => t >= c[0].s - 0.05 && (k + 1 < chunks.length ? t < chunks[k + 1][0].s - 0.05 : t < c[c.length - 1].e + 0.4));
  if (i < 0) return null;
  return (
    <div style={{position: 'absolute', left: 50, top: y, width: 900, textAlign: 'center', fontFamily: JF.sans, fontWeight: 800, fontSize: 70, lineHeight: 1.15,
      color: '#fff', textShadow: '0 0 3px #000, 0 0 6px #000, 3px 3px 0 #000, -3px 3px 0 #000, 3px -3px 0 #000, -3px -3px 0 #000, 0 6px 18px rgba(0,0,0,0.8)'}}>
      {chunks[i].map((w, k) => (
        <span key={k} style={{color: t >= w.s && (k + 1 < chunks[i].length ? t < chunks[i][k + 1].s : true) ? pal.mark : '#fff'}}>{w.w.replace(/[“”"]/g, '')}{k + 1 < chunks[i].length ? ' ' : ''}</span>
      ))}
    </div>
  );
};

/** The hook: two lines of orange tape, fully drawn from frame 0, on a dark band so it reads over any picture. */
const Headline: React.FC<{lines: [string, string]; size?: number}> = ({lines, size = 92}) => (
  <>
    <AbsoluteFill style={{background: 'linear-gradient(180deg, rgba(8,7,5,0.85) 0%, rgba(8,7,5,0.7) 22%, rgba(8,7,5,0) 34%)'}} />
    <Highlight text={lines[0]} x={56} y={200} size={size} at={-100} seed={901} rot={-2} />
    <Highlight text={lines[1]} x={86} y={200 + size * 1.42} size={size} at={-100} seed={903} rot={-2} />
  </>
);

/** Small source credit just above YouTube's bottom overlay. */
export const TagV: React.FC<{text: string}> = ({text}) => (
  <div style={{position: 'absolute', left: 56, top: 1462, width: 860, fontFamily: JF.mono, fontSize: 20, letterSpacing: 1, color: 'rgba(255,255,255,0.8)', textTransform: 'uppercase',
    textShadow: '0 1px 6px rgba(0,0,0,0.95)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis'}}>{text}</div>
);

type TL = {at: (p: string, nth?: number) => number};

/** Outro 1: "Want the rest of the story? Watch the full video, Fix Everything…" over the long video's thumbnail. */
export const OutroWatch: React.FC<{t: TL}> = ({t}) => (
  <AbsoluteFill>
    <DarkPaper />
    <Note text="want the rest of the story?" x={80} y={520} size={56} rot={-3} at={t.at('Want')} />
    <Card src="img/shorts/fix_everything_thumb.png" x={90} y={640} w={880} rot={-2} at={t.at('Watch') - 1} filter="none" />
    <Note text="the full video is linked below" x={140} y={1150} size={46} rot={-3} at={t.at('right here')} color="#ffffff" />
  </AbsoluteFill>
);

/** Outro 2: "And subscribe for more 15 Minute History." The wordmark, SUBSCRIBE on orange tape, an arrow down. */
export const OutroSubscribe: React.FC<{t: TL}> = ({t}) => {
  const g = useGFrame();
  const s = 0.56;
  return (
    <AbsoluteFill>
      <DarkPaper />
      <div style={{position: 'absolute', left: 85 - 190 * s, top: 560 - 290 * s, width: 1920, height: 1080, transform: `scale(${s})`, transformOrigin: '0 0'}}>
        <Wordmark clockAt={-100} numAt={-100} minAt={-100} hisAt={-100} />
      </div>
      {g >= t.at('subscribe') && <Highlight text="SUBSCRIBE" x={110} y={930} size={130} at={t.at('subscribe')} seed={925} rot={-3} />}
      <Arrow x1={760} y1={1090} x2={600} y2={1215} bow={-30} at={t.at('subscribe') + 6} />
    </AbsoluteFill>
  );
};

export const TAIL = 45;
export const shortFrames = (clips: Clip[]) => {
  const p = layout(clips);
  return p[p.length - 1].at + p[p.length - 1].len + TAIL;
};

/** Narration clips, a music bed (with optional dips), captions, the persistent headline, grain. `children` = pictures. */
export const ShortShell: React.FC<{clips: Clip[]; headline: [string, string]; headlineSize?: number; music: {src: string; volume: number; startFrom?: number; duck?: [number, number][]; duckTo?: number};
  cuts: number[]; children: React.ReactNode}> = ({clips, headline, headlineSize, music, cuts, children}) => {
  const placed = layout(clips);
  const n = joinWords(clips);
  const total = shortFrames(clips);
  return (
    <PaletteCtx.Provider value={PALETTES.locked}>
      <StepCtx.Provider value={2.5}>
        <AbsoluteFill style={{background: '#0d0c09', overflow: 'hidden'}}>
          {children}
          <AbsoluteFill style={{background: 'linear-gradient(0deg, rgba(8,7,5,0.8) 0%, rgba(8,7,5,0.55) 28%, rgba(8,7,5,0) 42%)'}} />
          <Headline lines={headline} size={headlineSize} />
          <Captions n={n} />
          <Finish vignette={0.25} />
          {placed.map((c, i) => (
            <Sequence key={i} from={c.at} durationInFrames={c.len} layout="none">
              <Audio src={staticFile(`audio/${c.stem}.wav`)} startFrom={Math.round(c.from * 30)} endAt={Math.round(c.from * 30) + c.len} />
            </Sequence>
          ))}
          <Audio src={staticFile(music.src)} startFrom={music.startFrom ?? 0} volume={(f) => {
            const base = interpolate(f, [0, 10, total - 40, total], [0, music.volume, music.volume, 0], clamp);
            const k = (music.duck ?? []).reduce((m, [a, b]) => Math.min(m, interpolate(f, [a - 15, a, b, b + 20], [1, music.duckTo ?? 0.45, music.duckTo ?? 0.45, 1], clamp)), 1);
            return base * k;
          }} />
          {cuts.map((f) => <Sfx key={f} at={f} src="sfx/whoosh.wav" volume={0.26} />)}
        </AbsoluteFill>
      </StepCtx.Provider>
    </PaletteCtx.Provider>
  );
};
