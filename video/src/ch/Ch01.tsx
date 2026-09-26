// Chapter 1 · The Book That Scared Georgia (cold open) + title card.
import React from 'react';
import {AbsoluteFill, Audio, Easing, Img, interpolate, random, Sequence, staticFile, useCurrentFrame} from 'remotion';
import words from '../../public/audio/ch01_cold_open.words.json';
import revival from '../../public/img/jh/masks/revival.json';
import {clamp} from '../lib/anim';
import {makeTimeline, type Narration} from '../lib/timing';
import {MapScene} from '../jh/MapTest';
import {ChannelIntro, INTRO_FRAMES} from './Intro';
import {WRITE} from './common';
import {boxOf, Finish, Highlight, INK, JF, MaskData, Note, PALETTES, PaletteCtx, Picture, Place, StepCtx, Tag, Tint, Traced, useGFrame, usePal} from '../jh/Kit';

const N = words as Narration;
const R = revival as unknown as MaskData;
export const TITLE_FRAMES = 150;
export const CH01_FRAMES = Math.ceil(N.duration * 30) + 20 + INTRO_FRAMES + TITLE_FRAMES;

const MAP = {w: 4986, h: 4608};
const BOSTON = [3489, 1660];
const SAVANNAH = [2644, 3045];
const ROUTE = [BOSTON, [3560, 1690], [3690, 1730], [3660, 1840], [3450, 1940], [3380, 2080], [3330, 2230], [3230, 2420], [3260, 2690], [3080, 2900], [2880, 3010], SAVANNAH];
// towns the reform "fever" lights up (map pixels)
const HOTSPOTS = [[3489, 1660], [3150, 1900], [2980, 2120], [2860, 1500], [2500, 1520], [2200, 1850], [1900, 2150], [2644, 3045], [2400, 2500], [3350, 1500], [1600, 2600], [2750, 2400]];

const Sfx: React.FC<{at: number; src: string; volume?: number}> = ({at, src, volume = 0.5}) => (
  <Sequence from={Math.max(0, at)} durationInFrames={90} layout="none"><Audio src={staticFile(src)} volume={volume} /></Sequence>
);

/** The whole 1836 map, rotated; camera given in map pixels. */
const MapView: React.FC<{cx: number; cy: number; s: number; rot: number; children?: React.ReactNode; dim?: number}> = ({cx, cy, s, rot, children, dim = 0}) => (
  <div style={{position: 'absolute', left: 960 - cx * s, top: 540 - cy * s, width: MAP.w * s, height: MAP.h * s, transform: `rotate(${rot}deg)`, transformOrigin: `${cx * s}px ${cy * s}px`}}>
    <Img src={staticFile('img/jh/mitchell_1836.jpg')} style={{width: '100%', height: '100%', filter: `grayscale(1) sepia(0.25) contrast(1.2) brightness(${0.8 - dim})`, boxShadow: '0 30px 80px rgba(0,0,0,0.8)'}} />
    <svg style={{position: 'absolute', left: 0, top: 0, overflow: 'visible'}} width={MAP.w * s} height={MAP.h * s} viewBox={`0 0 ${MAP.w} ${MAP.h}`}>{children}</svg>
  </div>
);

/** Questions over the hidden pamphlet, then the pull-out to the whole country and the fever. */
const ZoomOut: React.FC<{t: ReturnType<typeof makeTimeline>}> = ({t}) => {
  const frame = useCurrentFrame();
  const g = useGFrame();
  const pal = usePal();
  const at = t.at;
  const z0 = at('zoom out');
  const k = interpolate(frame, [z0 - 4, z0 + 40], [0, 1], {...clamp, easing: Easing.inOut(Easing.cubic)});
  const s = Math.exp(Math.log(1.5) + (Math.log(0.215) - Math.log(1.5)) * k);
  const cx = SAVANNAH[0] + (2600 - SAVANNAH[0]) * k;
  const cy = SAVANNAH[1] + (2320 - SAVANNAH[1]) * k;
  const rot = 36 * (1 - k);
  const f0 = at('caught a fever');
  const routeD = 'M' + ROUTE.map(([x, y]) => `${x},${y}`).join(' L');
  return (
    <AbsoluteFill style={{background: '#15130f'}}>
      <MapView cx={cx} cy={cy} s={s} rot={rot}>
        <path d={routeD} fill="none" stroke={pal.mark} strokeWidth={11 / Math.max(s, 0.5)} strokeLinejoin="round" opacity={interpolate(g, [f0 - 10, f0], [1, 0.35], clamp)} />
        <circle cx={SAVANNAH[0]} cy={SAVANNAH[1]} r={16 / Math.max(s, 0.4)} fill={pal.mark} stroke={INK} strokeWidth={5 / Math.max(s, 0.4)} />
        {HOTSPOTS.map(([x, y], i) => {
          const st = f0 + 4 + Math.round(random(`h${i}`) * 26);
          const p = interpolate(g, [st, st + 18], [0, 1], clamp);
          const pulse = 1 + 0.12 * Math.sin((g - st) / 5 + i);
          if (g < st) return null;
          return <circle key={i} cx={x} cy={y} r={(120 + 160 * p) * pulse} fill={`url(#fever)`} opacity={0.85 * p} />;
        })}
        <defs>
          <radialGradient id="fever"><stop offset="0%" stopColor={pal.subject} stopOpacity={0.9} /><stop offset="60%" stopColor={boxOf(pal)} stopOpacity={0.35} /><stop offset="100%" stopColor={boxOf(pal)} stopOpacity={0} /></radialGradient>
        </defs>
      </MapView>
      <AbsoluteFill style={{background: 'radial-gradient(ellipse at 50% 50%, transparent 45%, rgba(8,6,4,0.8) 100%)'}} />
      {g >= at('1830s') && g < f0 && <Highlight text="THE 1830s & 40s" x={120} y={120} size={80} at={at('1830s')} seed={31} />}
      <Note text="something really strange..." x={130} y={250} size={50} at={at('really strange')} out={f0} />
      {g >= f0 && <Highlight text="A FEVER" after="TO FIX THINGS" x={120} y={110} size={92} at={f0 + 2} seed={33} />}
      <Note text="(not a real one)" x={170} y={250} size={50} at={at('Not a real')} rot={-5} />
      <Tag text="Mitchell's Map of the United States, 1836 · Library of Congress" />
    </AbsoluteFill>
  );
};

/** Close on the hidden pamphlet with the three questions. */
const Questions: React.FC<{t: ReturnType<typeof makeTimeline>}> = ({t}) => {
  const frame = useCurrentFrame();
  const g = useGFrame();
  const pal = usePal();
  const at = t.at;
  const s0 = at('So what');
  const push = interpolate(frame, [s0, at('zoom out')], [1, 1.12], clamp);
  const qs: [string, string, number][] = [['what\'s in it?', 'thing', -5], ['who wrote it?', 'Who wrote', 3], ['why was Georgia so scared?', 'scare', -3]];
  return (
    <AbsoluteFill style={{background: '#15130f'}}>
      <MapView cx={SAVANNAH[0]} cy={SAVANNAH[1]} s={1.5} rot={36} dim={0.35} />
      <AbsoluteFill style={{background: 'rgba(8,6,4,0.45)'}} />
      <div style={{position: 'absolute', left: 150, top: 110, width: 540, transform: `scale(${push}) rotate(-3deg)`, transformOrigin: '50% 40%'}}>
        <Img src={staticFile('img/prep/walker_torn.png')} style={{width: 560, filter: 'drop-shadow(0 26px 34px rgba(0,0,0,0.7))'}} />
        <div style={{position: 'absolute', left: 110, top: 26, width: 340, height: 66, background: INK, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: JF.display, fontSize: 46, color: boxOf(pal)}}>? ? ?</div>
      </div>
      {qs.map(([q, cue, rot], i) => (
        <Note key={q} text={q} x={820} y={220 + i * 150} size={64} rot={rot} at={at(cue) - 2} dur={9} />
      ))}
      {g >= at('get there') && <Highlight text="WE'LL GET THERE." x={820} y={720} size={64} at={at('get there')} seed={35} rot={-2} />}
      <Note text="promise." x={1300} y={820} size={48} rot={-6} at={at('promise')} />
    </AbsoluteFill>
  );
};

const CAUSES: [string, string, string][] = [
  ['DRINKING', 'Drinking', 'img/prep/drunkards_art.jpg'],
  ['PRISONS', 'Prisons', 'img/ch01/prison_art.jpg'],
  ['SCHOOLS', 'Schools', 'img/ch01/school_art.jpg'],
  ['MARRIAGE', 'Marriage', 'img/ch01/marriage_art.jpg'],
  ['RELIGION', 'Religion', 'img/jh/cm_hero.jpg'],
  ["WOMEN'S RIGHTS", "Women's", 'img/ch01/mott_art.jpg'],
  ['SLAVERY', 'Slavery', 'img/ch01/slavery_art.jpg'],
];

/** Seven hard cuts, one per cause. */
const Montage: React.FC<{t: ReturnType<typeof makeTimeline>}> = ({t}) => {
  const frame = useCurrentFrame();
  const starts = CAUSES.map(([, cue]) => t.at(cue));
  let i = starts.reduce((acc, s, k) => (frame >= s ? k : acc), -1);
  if (i < 0) i = 0;
  const [label, , src] = CAUSES[i];
  const local = frame - starts[i];
  const zoom = 1.04 + local * 0.004;
  const portrait = src.includes('mott') || src.includes('marriage') || src.includes('slavery');
  return (
    <AbsoluteFill style={{background: '#111'}}>
      {portrait && <Img src={staticFile(src)} style={{position: 'absolute', inset: -40, width: 2000, height: 1160, objectFit: 'cover', filter: 'grayscale(1) blur(18px) brightness(0.45)'}} />}
      <Img src={staticFile(src)} style={{position: 'absolute', left: 0, top: 0, width: 1920, height: 1080, objectFit: portrait ? 'contain' : 'cover',
        filter: 'grayscale(1) contrast(1.3) brightness(0.95)', transform: `scale(${zoom})`}} />
      <AbsoluteFill style={{background: 'radial-gradient(ellipse at 50% 50%, transparent 50%, rgba(0,0,0,0.6) 100%)'}} />
      <Highlight key={label} text={label} x={110} y={820} size={110} at={starts[i]} seed={40 + i} rot={-2} />
      <div style={{position: 'absolute', right: 60, top: 50, fontFamily: JF.mono, fontSize: 34, color: '#fff', textShadow: '0 2px 8px #000'}}>{i + 1}/7</div>
    </AbsoluteFill>
  );
};

/** Everybody had a cause: all seven as cut-outs on the map. */
const Wall: React.FC<{t: ReturnType<typeof makeTimeline>}> = ({t}) => {
  const g = useGFrame();
  const at = t.at('Everybody');
  const pos = [[90, 90, -4], [700, 60, 3], [1320, 110, -2], [150, 560, 2], [640, 520, -3], [1080, 600, 4], [1500, 560, -3]];
  return (
    <AbsoluteFill style={{background: '#15130f'}}>
      <MapView cx={2600} cy={2320} s={0.215} rot={0} dim={0.3} />
      {CAUSES.map(([label, , src], i) => {
        const st = at + i * 3;
        if (g < st) return null;
        const k = interpolate(g, [st, st + 5], [0, 1], {...clamp, easing: Easing.out(Easing.back(1.6))});
        const [x, y, r] = pos[i];
        return (
          <div key={label} style={{position: 'absolute', left: x, top: y, width: 420, transform: `scale(${k}) rotate(${r}deg)`}}>
            <div style={{background: '#f4efe6', padding: 10, boxShadow: '0 16px 30px rgba(0,0,0,0.6)'}}>
              <Img src={staticFile(src)} style={{width: 400, height: 300, objectFit: 'cover', display: 'block', filter: 'grayscale(1) contrast(1.2)'}} />
            </div>
            <div style={{position: 'absolute', left: 14, bottom: -24, background: boxOf(PALETTES.locked), fontFamily: JF.display, fontSize: 34, padding: '2px 12px', color: INK}}>{label}</div>
          </div>
        );
      })}
      <Note text="...and everybody was sure theirs would save the nation" x={250} y={940} size={46} rot={-2} at={t.at('everybody was')} dur={16} />
    </AbsoluteFill>
  );
};

/** The question, isolated. */
const Question: React.FC<{t: ReturnType<typeof makeTimeline>}> = ({t}) => {
  const g = useGFrame();
  const pal = usePal();
  const at = t.at;
  return (
    <AbsoluteFill style={{background: '#15130f'}}>
      <MapView cx={2600} cy={2320} s={0.3} rot={0} dim={0.55} />
      <AbsoluteFill style={{background: 'rgba(8,6,4,0.35)'}} />
      <Note text="the question:" x={200} y={250} size={56} rot={-4} at={at('question')} />
      {g >= at('Why did', 2) && <Highlight text="WHY DID AN ENTIRE COUNTRY," x={200} y={360} size={96} at={at('Why did', 2)} seed={51} />}
      {g >= at('all at once') && <div style={{position: 'absolute', left: 230, top: 510, fontFamily: JF.display, fontSize: 96, color: pal.mark, textShadow: '0 3px 14px rgba(0,0,0,0.7)'}}>ALL AT ONCE,</div>}
      {g >= at('decide') && <Highlight text="DECIDE IT NEEDED TO BE FIXED?" x={200} y={660} size={96} at={at('decide')} seed={53} />}
    </AbsoluteFill>
  );
};

/** "And the answer starts with a tent." */
const Tent: React.FC<{t: ReturnType<typeof makeTimeline>}> = ({t}) => {
  const frame = useCurrentFrame();
  const at = t.at('And the answer');
  const k = interpolate(frame, [at, at + 90], [1.12, 1.24], clamp);
  const place: Place = {left: 0, top: 0, scale: 1920 / R.size[0]};
  return (
    <AbsoluteFill style={{background: INK, overflow: 'hidden'}}>
      <AbsoluteFill style={{transform: `scale(${k})`, transformOrigin: '34% 38%'}}>
        <Picture src="img/jh/cm_hero.jpg" place={place} size={R.size} bw="grayscale(1) contrast(1.45) brightness(1.02)" />
        <Tint mask="img/jh/masks/revival_magenta_a.png" place={place} size={R.size} />
        <Traced paths={R.shapes.magenta} place={place} at={t.at('tent') - 4} dur={10} width={5} />
      </AbsoluteFill>
      <Tag text="Camp-Meeting · lithograph, c. 1829 · Library of Congress" />
    </AbsoluteFill>
  );
};

const Title: React.FC = () => {
  const g = useGFrame();
  const pal = usePal();
  return (
    <AbsoluteFill style={{background: '#15130f'}}>
      <MapView cx={2600} cy={2320} s={0.26 + g * 0.0003} rot={0} dim={0.5} />
      <AbsoluteFill style={{background: 'radial-gradient(ellipse at 50% 50%, rgba(8,6,4,0.2) 30%, rgba(8,6,4,0.85) 100%)'}} />
      <Highlight text="FIX EVERYTHING" x={330} y={380} size={170} at={4} seed={61} rot={-2} />
      {g >= 14 && <div style={{position: 'absolute', left: 380, top: 640, fontFamily: JF.display, fontSize: 72, color: pal.mark, textShadow: '0 3px 16px rgba(0,0,0,0.8)', opacity: interpolate(g, [14, 20], [0, 1], clamp)}}>America's Reform Era</div>}
      <Note text="1820s – 1850s" x={1260} y={740} size={52} rot={-5} at={24} />
    </AbsoluteFill>
  );
};

const Body: React.FC = () => {
  const frame = useCurrentFrame();
  const t = makeTimeline(N, 30);
  const end = Math.ceil(N.duration * 30) + 20;
  const cut = {
    questions: t.at('So what') - 2,
    zoom: t.at('zoom out') - 6,
    montage: t.at('Drinking') - 1,
    wall: t.at('Everybody') - 1,
    question: t.at('So here\'s') - 1,
    tent: t.at('And the answer') - 1,
  };
  let scene: React.ReactNode;
  if (frame < cut.questions) scene = <MapScene n={N} withAudio={false} />;
  else if (frame < cut.zoom) scene = <Questions t={t} />;
  else if (frame < cut.montage) scene = <ZoomOut t={t} />;
  else if (frame < cut.wall) scene = <Montage t={t} />;
  else if (frame < cut.question) scene = <Wall t={t} />;
  else if (frame < cut.tent) scene = <Question t={t} />;
  else if (frame < end) scene = <Tent t={t} />;
  else if (frame < end + INTRO_FRAMES) scene = <Sequence from={end} layout="none"><ChannelIntro /></Sequence>;
  else scene = <Sequence from={end + INTRO_FRAMES} layout="none"><Title /></Sequence>;
  const at = t.at;
  return (
    <AbsoluteFill>
      {scene}
      <Finish vignette={0.3} />
      <Audio src={staticFile('audio/ch01_cold_open.wav')} />
      <Audio src={staticFile('music/cold_open.mp3')} volume={(f) => interpolate(f, [0, 15, end - 30, end], [0, 0.17, 0.17, 0.06], clamp)} />
      <Sfx at={cut.questions} src="sfx/whoosh.wav" volume={0.4} />
      {['thing', 'Who wrote', 'scare'].map((c) => <Sfx key={c} at={at(c) - 2} src={WRITE.src} volume={WRITE.volume} />)}
      <Sfx at={at('get there')} src="sfx/stamp.wav" volume={0.3} />
      <Sfx at={cut.zoom} src="sfx/whoosh.wav" volume={0.5} />
      <Sfx at={at('caught a fever')} src="sfx/stamp.wav" volume={0.35} />
      {CAUSES.map(([, cue]) => <Sfx key={cue} at={at(cue)} src="sfx/tick.wav" volume={0.45} />)}
      <Sfx at={at('Why did', 2)} src="sfx/stamp.wav" volume={0.3} />
      <Sfx at={at('decide')} src="sfx/stamp.wav" volume={0.35} />
      <Sfx at={end + INTRO_FRAMES + 4} src="sfx/stamp.wav" volume={0.4} />
    </AbsoluteFill>
  );
};

export const Ch01: React.FC = () => (
  <PaletteCtx.Provider value={PALETTES.locked}>
    <StepCtx.Provider value={2.5}>
      <Body />
    </StepCtx.Provider>
  </PaletteCtx.Provider>
);
