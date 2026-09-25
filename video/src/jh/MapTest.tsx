// Motion test: the cold open on Mitchell's 1836 map. The camera glides smoothly; every graphic
// steps at ~12 fps. Cues are anchored to words in the narration.
import React from 'react';
import {AbsoluteFill, Audio, Easing, Img, interpolate, random, Sequence, staticFile, useCurrentFrame} from 'remotion';
import words from '../../public/audio/test_map.words.json';
import {clamp} from '../lib/anim';
import {makeTimeline, type Narration} from '../lib/timing';
import {Arrow, boxOf, Finish, Highlight, INK, JF, Loop, Note, PALETTES, PaletteCtx, StepCtx, Tag, useGFrame, usePal} from './Kit';

const N = words as Narration;
export const MAP_TEST_FRAMES = Math.ceil(N.duration * 30) + 36;

const MAP = {w: 4986, h: 4608};
const BOSTON = [3489, 1660];
const SAVANNAH = [2644, 3045];
const GEORGIA_LABEL = [2355, 3020];
const ROUTE = [BOSTON, [3560, 1690], [3690, 1730], [3660, 1840], [3450, 1940], [3380, 2080], [3330, 2230], [3230, 2420], [3260, 2690], [3080, 2900], [2880, 3010], SAVANNAH];
const ROT = 36;

type Cam = {f: number; x: number; y: number; s: number};

const camAt = (keys: Cam[], frame: number) => {
  if (frame <= keys[0].f) return keys[0];
  for (let i = 0; i < keys.length - 1; i++) {
    const a = keys[i];
    const b = keys[i + 1];
    if (frame < b.f) {
      const t = Easing.inOut(Easing.cubic)((frame - a.f) / (b.f - a.f));
      // interpolate scale in log space so zooms feel even
      return {f: frame, x: a.x + (b.x - a.x) * t, y: a.y + (b.y - a.y) * t, s: Math.exp(Math.log(a.s) + (Math.log(b.s) - Math.log(a.s)) * t)};
    }
  }
  return keys[keys.length - 1];
};

/** Point `t` (0-1) of the way along a polyline. */
const along = (pts: number[][], t: number) => {
  const seg = pts.slice(1).map((p, i) => Math.hypot(p[0] - pts[i][0], p[1] - pts[i][1]));
  let d = t * seg.reduce((a, b) => a + b, 0);
  for (let i = 0; i < seg.length; i++) {
    if (d <= seg[i]) {
      const k = d / seg[i];
      return [pts[i][0] + (pts[i + 1][0] - pts[i][0]) * k, pts[i][1] + (pts[i + 1][1] - pts[i][1]) * k];
    }
    d -= seg[i];
  }
  return pts[pts.length - 1];
};

const Pin: React.FC<{x: number; y: number; at: number}> = ({x, y, at}) => {
  const g = useGFrame();
  if (g < at) return null;
  const k = interpolate(g, [at, at + 3, at + 6], [0, 1.35, 1], clamp);
  return <div style={{position: 'absolute', left: x - 13, top: y - 13, width: 26, height: 26, borderRadius: '50%', background: usePal().mark,
    border: `4px solid ${INK}`, transform: `scale(${k})`, boxShadow: '0 0 0 4px rgba(47,224,196,0.35)'}} />;
};

const Sfx: React.FC<{at: number; src: string; volume?: number}> = ({at, src, volume = 0.5}) => (
  <Sequence from={Math.max(0, at)} durationInFrames={60} layout="none"><Audio src={staticFile(src)} volume={volume} /></Sequence>
);

const Scene: React.FC = () => {
  const frame = useCurrentFrame();
  const g = useGFrame();
  const pal = usePal();
  const t = makeTimeline(N, 30);
  const at = t.at;

  const mid = [(BOSTON[0] + SAVANNAH[0]) / 2, (BOSTON[1] + SAVANNAH[1]) / 2];
  const keys: Cam[] = [
    {f: 0, x: mid[0], y: mid[1], s: 0.6},
    {f: at('Savannah') - 4, x: mid[0] - 80, y: mid[1] + 80, s: 0.66},
    {f: at('Georgia') + 10, x: 2700, y: 2960, s: 1.12},
    {f: at('ship') + 2, x: 2700, y: 2960, s: 1.12},
    {f: at('Boston') + 8, x: mid[0], y: mid[1], s: 0.72},
    {f: at('Somewhere'), x: mid[0], y: mid[1], s: 0.72},
    {f: at('sixty') + 6, x: 2800, y: 2850, s: 0.95},
    {f: at('They end') - 2, x: 2780, y: 2880, s: 1.0},
    {f: at('preacher') + 4, x: SAVANNAH[0] + 40, y: SAVANNAH[1] - 30, s: 1.55},
    {f: at('police') + 10, x: SAVANNAH[0] + 40, y: SAVANNAH[1] - 30, s: 1.62},
    {f: at('mayor') + 8, x: mid[0] - 150, y: mid[1] + 40, s: 0.68},
    {f: at('Georgia starts') - 2, x: mid[0] - 150, y: mid[1] + 40, s: 0.68},
    {f: at('passing') + 6, x: 2420, y: 2930, s: 1.08},
    {f: at('rumor') - 2, x: 2420, y: 2930, s: 1.08},
    {f: at('South') + 10, x: 2500, y: 2700, s: 0.62},
    {f: at('Dead') - 1, x: 2520, y: 2700, s: 0.66},
  ];
  let cam = camAt(keys, frame);
  if (frame >= at('Dead')) cam = {...cam, s: cam.s * 1.14}; // hard punch-in

  const a = (ROT * Math.PI) / 180;
  const toScreen = ([x, y]: number[]) => {
    const dx = (x - cam.x) * cam.s;
    const dy = (y - cam.y) * cam.s;
    return [960 + dx * Math.cos(a) - dy * Math.sin(a), 540 + dx * Math.sin(a) + dy * Math.cos(a)];
  };
  const b = toScreen(BOSTON);
  const sv = toScreen(SAVANNAH);

  // voyage
  const v0 = at('ship');
  const v1 = at('Boston') + 20;
  const vp = interpolate(g, [v0, v1], [0, 1], {...clamp, easing: Easing.inOut(Easing.quad)});
  const ship = along(ROUTE, vp);
  const routeD = 'M' + ROUTE.map(([x, y]) => `${x},${y}`).join(' L');

  // letters back north: a dashed arc inland, Savannah -> Boston
  const l0 = at('writing');
  const l1 = at('Boston', 2) + 6;
  const lp = interpolate(g, [l0, l1], [0, 1], clamp);
  const ctrl = [2350, 2050];
  const q = (u: number) => [
    (1 - u) ** 2 * SAVANNAH[0] + 2 * (1 - u) * u * ctrl[0] + u * u * BOSTON[0],
    (1 - u) ** 2 * SAVANNAH[1] + 2 * (1 - u) * u * ctrl[1] + u * u * BOSTON[1],
  ];
  const dashes: string[] = [];
  const ND = 46;
  for (let i = 0; i < ND; i++) {
    const u0 = i / ND;
    if (u0 > lp) break;
    const [x0, y0] = q(u0);
    const [x1, y1] = q(Math.min(lp, u0 + 0.55 / ND));
    dashes.push(`M${x0},${y0} L${x1},${y1}`);
  }
  const env = q(lp);

  // rumor ripples out of Savannah
  const r0 = at('rumor');

  const dateOut = at('They end');
  const pageOut = at('They end') - 2;

  return (
    <AbsoluteFill style={{background: '#1a1814', overflow: 'hidden'}}>
      <Audio src={staticFile('audio/test_map.wav')} />
      <Audio src={staticFile('music/intrigue.mp3')} volume={(f) => interpolate(f, [0, 20, MAP_TEST_FRAMES - 30, MAP_TEST_FRAMES], [0, 0.16, 0.16, 0], clamp)} />
      <Audio src={staticFile('sfx/sea_ambience.wav')} volume={(f) => interpolate(f, [at('ship') - 10, at('ship') + 10, at('Somewhere') + 30, at('Somewhere') + 60], [0, 0.12, 0.12, 0], clamp)} />

      {/* the map, in map coordinates, rotated with the camera */}
      <div style={{position: 'absolute', left: 960 - cam.x * cam.s, top: 540 - cam.y * cam.s, width: MAP.w * cam.s, height: MAP.h * cam.s,
        transform: `rotate(${ROT}deg)`, transformOrigin: `${cam.x * cam.s}px ${cam.y * cam.s}px`}}>
        <Img src={staticFile('img/jh/mitchell_1836.jpg')} style={{width: '100%', height: '100%', filter: 'grayscale(1) sepia(0.25) contrast(1.2) brightness(0.8)'}} />
        <svg style={{position: 'absolute', left: 0, top: 0, overflow: 'visible'}} width={MAP.w * cam.s} height={MAP.h * cam.s} viewBox={`0 0 ${MAP.w} ${MAP.h}`}>
          {/* voyage */}
          <path d={routeD} fill="none" stroke="rgba(0,0,0,0.45)" strokeWidth={16 / cam.s * 0.72} strokeLinejoin="round" strokeLinecap="round"
            transform="translate(4 6)" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - vp} />
          <path d={routeD} fill="none" stroke={pal.mark} strokeWidth={11 / cam.s * 0.72} strokeLinejoin="round" strokeLinecap="round"
            pathLength={1} strokeDasharray={1} strokeDashoffset={1 - vp} />
          {g >= v0 && vp < 1 && <circle cx={ship[0]} cy={ship[1]} r={16 / cam.s} fill={pal.mark} stroke={INK} strokeWidth={5 / cam.s} />}
          {/* letters */}
          {g >= l0 && g < at('South') && <path d={dashes.join(' ')} fill="none" stroke={boxOf(pal)} strokeWidth={8 / cam.s} strokeLinecap="round" />}
          {/* rumor ripples */}
          {[0, 1, 2, 3].map((i) => {
            const st = r0 + i * 12;
            const k = interpolate(g, [st, st + 45], [0, 1], clamp);
            if (g < st || k >= 1) return null;
            return <circle key={i} cx={SAVANNAH[0]} cy={SAVANNAH[1]} r={80 + k * 1250} fill="none" stroke={pal.mark} strokeWidth={(10 - k * 6) / cam.s} opacity={1 - k} />;
          })}
        </svg>
        {/* Georgia circled on the map itself */}
        <svg style={{position: 'absolute', left: 0, top: 0, overflow: 'visible'}} width={MAP.w * cam.s} height={MAP.h * cam.s}>
          <g transform={`scale(${cam.s})`}>
            {g < at('South') && <MapLoop cx={GEORGIA_LABEL[0]} cy={GEORGIA_LABEL[1]} rx={290} ry={85} at={at('Georgia starts')} s={cam.s} />}
          </g>
        </svg>
      </div>

      <AbsoluteFill style={{background: 'radial-gradient(ellipse at 50% 50%, transparent 42%, rgba(10,8,5,0.8) 100%)'}} />

      {/* envelope riding the letter line */}
      {g >= l0 && lp < 1 && (() => {
        const [ex, ey] = toScreen(env);
        return (
          <svg style={{position: 'absolute', left: ex - 30, top: ey - 21}} width={60} height={42}>
            <rect x={2} y={2} width={56} height={38} rx={3} fill="#f3ead8" stroke={INK} strokeWidth={3} />
            <path d="M3,4 L30,24 L57,4" fill="none" stroke={INK} strokeWidth={3} />
          </svg>
        );
      })()}

      {/* pins and place labels follow the map */}
      <Pin x={sv[0]} y={sv[1]} at={at('Savannah')} />
      <Pin x={b[0]} y={b[1]} at={at('Boston')} />
      {g >= at('Savannah') && <Highlight text="SAVANNAH" x={sv[0] - 150} y={sv[1] + 30} size={60} at={at('Savannah')} seed={9} />}
      {g >= at('Boston') && <Highlight text="BOSTON" x={b[0] + 30} y={b[1] - 60} size={60} at={at('Boston')} seed={7} />}
      {g < dateOut && <Highlight text="DECEMBER 1829" x={70} y={60} size={70} at={at('December')} seed={11} />}

      {/* the pamphlet */}
      <Pamphlet at={at('sixty') - 2} out={pageOut} />
      <Note text="60 copies" x={450} y={250} rot={-6} size={56} at={at('copies')} out={pageOut} />
      <Note text="guns?" x={470} y={340} rot={-3} size={50} at={at('guns')} out={pageOut} />
      <Strike x={462} y={378} w={150} at={at('guns') + 6} out={pageOut} />
      <Note text="gunpowder?" x={470} y={420} rot={-3} size={50} at={at('gunpowder')} out={pageOut} />
      <Strike x={462} y={458} w={300} at={at('gunpowder') + 8} out={pageOut} />
      {g < pageOut && <Loop cx={255} cy={485} rx={215} ry={320} tilt={-4} at={at('pamphlet', 2) - 2} dur={10} width={6} seed={4} />}

      {/* Savannah close-up: who ended up with it */}
      <Note text="a local Black preacher" x={sv[0] + 60} y={sv[1] - 190} rot={-4} size={52} at={at('preacher') - 4} out={at('Within')} />
      <Arrow x1={sv[0] + 330} y1={sv[1] - 110} x2={sv[0] + 360} y2={sv[1] + 40} bow={-30} at={at('hands')} out={at('Within')} />
      <Note text="the police" x={sv[0] + 260} y={sv[1] + 60} rot={-2} size={56} at={at('police') - 2} out={at('Within')} />

      {/* letters */}
      <Note text="the mayor of Savannah" x={sv[0] - 40} y={sv[1] + 110} rot={-3} size={42} at={at('mayor')} out={at('Georgia starts')} />
      <Note text="the mayor of Boston" x={b[0] - 330} y={b[1] + 40} rot={-3} size={42} at={at('mayor', 2)} out={at('Georgia starts')} />

      {/* Georgia */}
      {g >= at('new laws') && g < at('rumor') + 20 && <Highlight text="NEW LAWS" x={toScreen(GEORGIA_LABEL)[0] - 60} y={toScreen(GEORGIA_LABEL)[1] + 110} size={70} at={at('new laws')} seed={21} rot={-3} />}

      {/* the bounty */}
      {g >= at('price') && <Highlight text="A PRICE ON HIS HEAD" x={140} y={130} size={74} at={at('price')} seed={23} rot={-2} />}
      {g >= at('Thousands') && <Note text="thousands of dollars" x={180} y={260} rot={-4} size={58} at={at('Thousands')} dur={12} />}
      {g >= at('Dead') && <Highlight text="DEAD OR ALIVE" x={700} y={800} size={110} at={at('Dead')} seed={25} rot={-2} />}

      <Tag text="Mitchell's Map of the United States, 1836 · Library of Congress" />
      <Finish vignette={0.3} />

      {/* sound */}
      <Sfx at={at('December')} src="sfx/stamp.wav" volume={0.35} />
      <Sfx at={at('Savannah')} src="sfx/tick.wav" volume={0.5} />
      <Sfx at={at('Boston')} src="sfx/tick.wav" volume={0.5} />
      <Sfx at={at('sixty') - 4} src="sfx/whoosh.wav" volume={0.5} />
      <Sfx at={at('copies')} src="sfx/quill.wav" volume={0.35} />
      <Sfx at={at('guns') + 4} src="sfx/quill.wav" volume={0.3} />
      <Sfx at={at('gunpowder') + 6} src="sfx/quill.wav" volume={0.3} />
      <Sfx at={at('preacher') - 6} src="sfx/quill.wav" volume={0.3} />
      <Sfx at={at('writing')} src="sfx/page_turn.wav" volume={0.45} />
      <Sfx at={at('new laws')} src="sfx/stamp.wav" volume={0.4} />
      <Sfx at={at('price')} src="sfx/stamp.wav" volume={0.4} />
      <Sfx at={at('Dead')} src="sfx/boom.wav" volume={0.45} />
    </AbsoluteFill>
  );
};

/** Loop drawn in map pixels (stroke width compensates for the camera scale). */
const MapLoop: React.FC<{cx: number; cy: number; rx: number; ry: number; at: number; s: number}> = ({cx, cy, rx, ry, at, s}) => {
  const g = useGFrame();
  const p = interpolate(g, [at, at + 10], [0, 1], clamp);
  if (g < at) return null;
  const pts: string[] = [];
  for (let i = 0; i <= 76; i++) {
    const t = (i / 70) * Math.PI * 2 + 0.5;
    const w = 1 + (random(`gl${i}`) - 0.5) * 0.03 + (i / 70) * 0.04;
    pts.push(`${(cx + Math.cos(t) * rx * w).toFixed(1)},${(cy + Math.sin(t) * ry * w).toFixed(1)}`);
  }
  return <polyline points={pts.join(' ')} fill="none" stroke={usePal().mark} strokeWidth={7 / s} strokeLinecap="round" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - p} />;
};

const Pamphlet: React.FC<{at: number; out: number}> = ({at, out}) => {
  const g = useGFrame();
  if (g < at || g >= out) return null;
  const k = interpolate(g, [at, at + 6], [0, 1], {...clamp, easing: Easing.out(Easing.back(1.4))});
  const wob = (random(`w${Math.floor(g / 2.5)}`) - 0.5) * 0.5;
  return (
    <div style={{position: 'absolute', left: 90, top: 215, width: 330, transform: `translateY(${(1 - k) * 700}px) rotate(${-4 + wob}deg)`}}>
      <Img src={staticFile('img/prep/walker_torn.png')} style={{width: 330, filter: 'drop-shadow(0 18px 24px rgba(0,0,0,0.6))'}} />
      <div style={{position: 'absolute', left: 64, top: 16, width: 200, height: 40, background: INK, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: JF.display, fontSize: 30, color: boxOf(usePal())}}>? ? ?</div>
    </div>
  );
};

const Strike: React.FC<{x: number; y: number; w: number; at: number; out: number}> = ({x, y, w, at, out}) => {
  const g = useGFrame();
  if (g < at || g >= out) return null;
  const p = interpolate(g, [at, at + 5], [0, 1], clamp);
  return (
    <svg style={{position: 'absolute', left: 0, top: 0, overflow: 'visible'}} width={1920} height={1080}>
      <path d={`M${x},${y + 6} Q${x + w / 2},${y - 8} ${x + w},${y}`} fill="none" stroke={boxOf(usePal())} strokeWidth={8} strokeLinecap="round" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - p} />
    </svg>
  );
};

export const MapTest: React.FC = () => (
  <PaletteCtx.Provider value={PALETTES.locked}>
    <StepCtx.Provider value={2.5}>
      <Scene />
    </StepCtx.Provider>
  </PaletteCtx.Provider>
);
