// Chapter 11 · So Why Fix Everything? The spark, the fuel, and the one reform that split the country.
import React from 'react';
import {AbsoluteFill, Audio, Easing, Img, interpolate, random, staticFile, useCurrentFrame} from 'remotion';
import words from '../../public/audio/ch11_why.words.json';
import {clamp} from '../lib/anim';
import {makeTimeline, type Narration} from '../lib/timing';
import {ColourReveal, Finish, Highlight, INK, JF, Note, PALETTES, PaletteCtx, Picture, Place, StepCtx, Tag, useGFrame, usePal} from '../jh/Kit';
import {Card, DarkPaper, Ember, MapView, Sfx, WRITE} from './common';

const N = words as Narration;
export const CH11_FRAMES = Math.ceil(N.duration * 30) + 75;
type TL = ReturnType<typeof makeTimeline>;
const CREAM = '#EDE7DC';
const CORAL = '#FF6F61';

const fill = (size: [number, number], fx: number, fy: number, z: number): Place => {
  const sc = Math.max(1920 / size[0], 1080 / size[1]) * z;
  return {left: Math.min(0, Math.max(1920 - size[0] * sc, 960 - fx * sc)), top: Math.min(0, Math.max(1080 - size[1] * sc, 540 - fy * sc)), scale: sc};
};

// Free/slave line, 1850s: Delaware, along the Mason–Dixon line and the Ohio River, then up around Missouri.
const SPLIT = [[3120, 2060], [2960, 2072], [2800, 2060], [2640, 2052], [2560, 2092], [2400, 2132], [2250, 2230], [2050, 2310], [1880, 2390], [1820, 2250], [1760, 2050], [1650, 1920], [1400, 1905], [1100, 1900]];

const Question: React.FC<{t: TL}> = ({t}) => {
  const frame = useCurrentFrame();
  const g = useGFrame();
  const s = interpolate(frame, [0, t.at('It started')], [0.44, 0.5], clamp);
  return (
    <AbsoluteFill style={{background: '#15130f'}}>
      <MapView cx={2500} cy={2250} s={s} dim={0.3} />
      <AbsoluteFill style={{background: 'radial-gradient(ellipse at 50% 50%, rgba(8,6,4,0.35) 30%, rgba(8,6,4,0.85) 100%)'}} />
      <Note text="back to the question:" x={140} y={220} size={60} rot={-3} at={t.at('back')} />
      <Note text="why did an entire country decide, all at once," x={160} y={330} size={58} rot={-2} at={t.at('Why')} color={CREAM} />
      {g >= t.at('fixed') - 4 && <Highlight text="THAT IT NEEDED TO BE FIXED?" x={150} y={450} size={96} at={t.at('fixed') - 4} seed={1101} rot={-2} />}
    </AbsoluteFill>
  );
};

const Spark: React.FC<{t: TL}> = ({t}) => {
  const frame = useCurrentFrame();
  const g = useGFrame();
  const s0 = t.at('It started');
  const size: [number, number] = [2173, 1222];
  const place = fill(size, 1100, 560, interpolate(frame, [s0, t.at('Temperance')], [1.02, 1.15], clamp));
  const w = t.at('world');
  return (
    <AbsoluteFill style={{background: INK, overflow: 'hidden'}}>
      <Picture src="img/jh/cm_hero.jpg" place={place} size={size} bw="grayscale(1) contrast(1.2) brightness(0.7)" />
      <ColourReveal src="img/jh/cm_hero.jpg" place={place} size={size} from={0.55} to={0.95} filter="brightness(0.75)" />
      <Ember x={1500} y={300} at={s0} size={1.1} flare={interpolate(g, [w - 4, w + 8], [0, 1], clamp)} />
      <Note text="an idea from those revival tents:" x={110} y={110} size={54} rot={-3} at={s0 + 4} />
      {g >= t.at('stuck') - 4 && <Highlight text="YOU'RE NOT STUCK." x={100} y={200} size={96} at={t.at('stuck') - 4} seed={1103} rot={-2} />}
      <Note text="you can change." x={120} y={360} size={70} rot={-3} at={t.at('You can')} color={CREAM} />
      <Note text="change yourself →" x={120} y={760} size={62} rot={-3} at={t.at('yourself')} />
      {g >= w - 2 && <Highlight text="CHANGE THE WORLD." x={560} y={860} size={90} at={w - 2} seed={1105} rot={-3} />}
      <Tag text="Camp meeting, engraving, 1829 · Library of Congress" y={40} />
    </AbsoluteFill>
  );
};

const CAUSES: [string, string, string, number, number, number][] = [
  ['TEMPERANCE', 'Temperance', 'img/prep/drunkards_art.jpg', 170, 170, -4],
  ['PRISONS', 'prisons', 'img/ch01/prison_art.jpg', 760, 110, 3],
  ['SCHOOLS', 'schools', 'img/ch01/school_art.jpg', 1350, 170, -3],
  ["WOMEN'S RIGHTS", "women's", 'img/ch01/mott_art.jpg', 330, 620, 3],
  ['UTOPIAS', 'utopias', 'img/ch09/shakers.jpg', 1200, 640, -3],
];

const Fuel: React.FC<{t: TL}> = ({t}) => {
  const g = useGFrame();
  const pal = usePal();
  const f0 = t.at('same fuel');
  const ex = [960, 540];
  return (
    <AbsoluteFill>
      <DarkPaper />
      <svg style={{position: 'absolute', left: 0, top: 0, overflow: 'visible'}} width={1920} height={1080}>
        {CAUSES.map(([, , , x, y], i) => {
          const p = interpolate(g, [f0 + i * 2, f0 + i * 2 + 8], [0, 1], clamp);
          const cx = x + 190, cy = y + 140;
          return p > 0 ? <path key={i} d={`M${ex[0]},${ex[1]} L${ex[0] + (cx - ex[0]) * p},${ex[1] + (cy - ex[1]) * p}`} stroke={pal.mark} strokeWidth={6} strokeDasharray="14 10" strokeLinecap="round" /> : null;
        })}
      </svg>
      {CAUSES.map(([label, cue, src, x, y, rot]) => {
        const a = t.at(cue);
        if (g < a - 1) return null;
        const pop = interpolate(g, [a - 1, a + 3], [1.15, 1], {...clamp, easing: Easing.out(Easing.back(2))});
        return (
          <div key={label} style={{position: 'absolute', left: x, top: y, width: 380, transform: `rotate(${rot}deg) scale(${pop})`}}>
            <Img src={staticFile(src)} style={{width: 380, height: 270, objectFit: 'cover', filter: 'grayscale(1) contrast(1.15)', border: '8px solid #efe9dd', boxShadow: '0 20px 40px rgba(0,0,0,0.7)'}} />
            <div style={{position: 'absolute', left: 14, bottom: -24, background: INK, color: CREAM, fontFamily: JF.heavy, fontSize: 34, padding: '4px 14px'}}>{label}</div>
          </div>
        );
      })}
      {g >= f0 && <Ember x={ex[0]} y={ex[1]} at={f0} size={1.3} flare={interpolate(g, [f0, f0 + 10], [0, 1], clamp)} />}
      {g >= f0 && <Note text="the same fuel" x={820} y={610} size={56} rot={-3} at={f0 + 3} />}
    </AbsoluteFill>
  );
};

const Difference: React.FC<{t: TL}> = ({t}) => {
  const g = useGFrame();
  const pal = usePal();
  const a = t.at('Abolition asked');
  return (
    <AbsoluteFill>
      <DarkPaper />
      <Note text="but notice the difference..." x={120} y={100} size={56} rot={-3} at={t.at('notice')} />
      <div style={{position: 'absolute', left: 959, top: 250, width: 3, height: 640, background: 'rgba(237,231,220,0.35)', opacity: g >= t.at('Most reforms') ? 1 : 0}} />
      {g >= t.at('Most reforms') && <Highlight text="MOST REFORMS" x={150} y={260} size={76} at={t.at('Most reforms')} seed={1107} />}
      <Note text="asked Americans to" x={170} y={420} size={56} rot={-3} at={t.at('asked')} color={CREAM} />
      <Note text="change their habits." x={190} y={510} size={70} rot={-3} at={t.at('habits')} />
      {g >= a && <Highlight text="ABOLITION" x={1060} y={260} size={76} at={a} seed={1109} />}
      <Note text="asked them to give up" x={1080} y={420} size={56} rot={-3} at={t.at('give up')} color={CREAM} />
      <Note text="an entire" x={1090} y={510} size={70} rot={-3} at={t.at('entire')} color={CORAL} />
      <Note text="economic system." x={1100} y={600} size={70} rot={-3} at={t.at('economic')} color={CORAL} />
    </AbsoluteFill>
  );
};

/** Hand-drawn bar comparison, 1860. */
const Value: React.FC<{t: TL}> = ({t}) => {
  const g = useGFrame();
  const pal = usePal();
  const b0 = t.at('worth');
  const pA = interpolate(g, [b0 - 2, b0 + 16], [0, 1], {...clamp, easing: Easing.out(Easing.cubic)});
  const pB = interpolate(g, [t.at('railroads') - 2, t.at('combined')], [0, 1], {...clamp, easing: Easing.out(Easing.cubic)});
  const base = 800;
  const bar = (x: number, h: number, p: number, color: string) => (
    <div style={{position: 'absolute', left: x, top: base - h * p, width: 330, height: h * p, background: color, boxShadow: '0 12px 30px rgba(0,0,0,0.6)', transform: 'rotate(-0.6deg)'}} />
  );
  return (
    <AbsoluteFill>
      <DarkPaper />
      {g >= t.at('1860') && <Highlight text="BY 1860" x={110} y={90} size={80} at={t.at('1860')} seed={1111} />}
      <div style={{position: 'absolute', left: 300, top: base, width: 1320, height: 4, background: CREAM, opacity: 0.6}} />
      {bar(420, 560, pA, CORAL)}
      {bar(1080, 330, pB, pal.mark)}
      <Note text="enslaved people," x={400} y={base + 20} size={44} rot={-2} at={t.at('counted')} color={CREAM} />
      <Note text="counted as “property”" x={400} y={base + 80} size={44} rot={-2} at={t.at('counted')} color={CREAM} />
      <Note text="≈ $3.5 billion" x={440} y={base - 560 * pA - 90} size={64} rot={-3} at={b0 + 10} color={CORAL} />
      <Note text="all railroads +" x={1070} y={base + 20} size={44} rot={-2} at={t.at('railroads')} color={CREAM} />
      <Note text="factories combined" x={1070} y={base + 80} size={44} rot={-2} at={t.at('railroads')} color={CREAM} />
      <Tag text="Estimates in 1860 dollars; historians put the market value of enslaved people above U.S. railroads and manufacturing combined" />
    </AbsoluteFill>
  );
};

const Whiskey: React.FC<{t: TL}> = ({t}) => {
  const frame = useCurrentFrame();
  const g = useGFrame();
  const h = t.at('harder');
  const size: [number, number] = [1632, 1185];
  const place = fill(size, 816, 600, interpolate(frame, [t.at('You can talk'), h], [1.0, 1.08], clamp));
  return (
    <AbsoluteFill style={{background: INK, overflow: 'hidden'}}>
      <Picture src="img/prep/drunkards_art.jpg" place={place} size={size} bw={`grayscale(1) contrast(1.15) brightness(${g >= h ? 0.3 : 0.75})`} />
      <Note text="you can talk a man out of drinking whiskey." x={110} y={130} size={62} rot={-3} at={t.at('You can talk')} color={CREAM} />
      <Note text="it's a lot harder to talk a country out of" x={120} y={520} size={58} rot={-2} at={h - 4} />
      {g >= t.at('valuable') - 2 && <Highlight text="ITS MOST VALUABLE “PROPERTY.”" x={110} y={640} size={90} at={t.at('valuable') - 2} seed={1113} rot={-2} />}
      <Tag text="The Drunkard's Progress, Nathaniel Currier, 1846 · Library of Congress" y={1030} />
    </AbsoluteFill>
  );
};

const Split: React.FC<{t: TL}> = ({t}) => {
  const frame = useCurrentFrame();
  const g = useGFrame();
  const sp = t.at('split');
  const nx = t.at('next time');
  const s = 0.5;
  const CX = 2350, CY = 2200;
  const k = interpolate(g, [sp - 4, sp + 14], [0, 1], {...clamp, easing: Easing.inOut(Easing.quad)});
  const gap = interpolate(frame, [sp + 10, sp + 60], [0, 18], clamp);
  const pts = SPLIT.map(([x, y], i) => [x + (random(`sx${i}`) - 0.5) * 30, y + (random(`sy${i}`) - 0.5) * 30]);
  const d = 'M' + pts.map(([x, y]) => `${x},${y}`).join(' L');
  const scr = pts.map(([x, y]) => [960 + (x - CX) * s, 540 + (y - CY) * s]);
  const line = scr.map(([x, y]) => `${x.toFixed(1)}px ${y.toFixed(1)}px`).join(', ');
  const lineRev = [...scr].reverse().map(([x, y]) => `${x.toFixed(1)}px ${y.toFixed(1)}px`).join(', ');
  const y0 = scr[0][1], yl = scr[scr.length - 1][1];
  const top = `polygon(0px 0px, 1920px 0px, 1920px ${y0}px, ${line}, 0px ${yl}px)`;
  const bot = `polygon(0px ${yl}px, ${lineRev}, 1920px ${y0}px, 1920px 1080px, 0px 1080px)`;
  const fade = interpolate(frame, [nx + 20, nx + 60], [0, 1], clamp);
  return (
    <AbsoluteFill style={{background: '#0b0a08', overflow: 'hidden'}}>
      <div style={{position: 'absolute', inset: 0, clipPath: top, transform: `translateY(${-gap}px)`}}>
        <MapView cx={CX} cy={CY} s={s} dim={0.25} />
      </div>
      <div style={{position: 'absolute', inset: 0, clipPath: bot, transform: `translateY(${gap}px)`}}>
        <MapView cx={CX} cy={CY} s={s} dim={0.25}>
          <path d={d} fill="none" stroke={CORAL} strokeWidth={16 / s} strokeLinejoin="round" strokeLinecap="round" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - k} opacity={gap > 2 ? 0 : 1} />
        </MapView>
      </div>
      <div style={{position: 'absolute', inset: 0, transform: `translateY(${-gap}px)`, opacity: gap > 2 ? 1 : 0}}>
        <svg width={1920} height={1080} style={{position: 'absolute'}}><path d={'M' + scr.map(([x, y]) => `${x},${y}`).join(' L')} fill="none" stroke={CORAL} strokeWidth={8} strokeLinejoin="round" /></svg>
      </div>
      <div style={{position: 'absolute', inset: 0, transform: `translateY(${gap}px)`, opacity: gap > 2 ? 1 : 0}}>
        <svg width={1920} height={1080} style={{position: 'absolute'}}><path d={'M' + scr.map(([x, y]) => `${x},${y}`).join(' L')} fill="none" stroke={CORAL} strokeWidth={8} strokeLinejoin="round" /></svg>
      </div>
      <AbsoluteFill style={{background: 'radial-gradient(ellipse at 50% 50%, transparent 40%, rgba(8,6,4,0.85) 100%)'}} />
      <Note text="that's why the fever didn't break." x={110} y={90} size={60} rot={-3} at={t.at('fever')} />
      {g >= sp && <Highlight text="IT SPLIT THE COUNTRY IN TWO." x={100} y={880} size={90} at={sp} seed={1115} rot={-2} />}
      <AbsoluteFill style={{background: `rgba(0,0,0,${fade})`}} />
      <Note text="...but that's a story for next time." x={560} y={480} size={66} rot={-3} at={nx + 22} color={CREAM} />
      <Tag text="Mitchell's Map of the United States, 1836 · the line between free and slave states, 1850s (approximate)" y={40} />
    </AbsoluteFill>
  );
};

const Body: React.FC = () => {
  const frame = useCurrentFrame();
  const t = makeTimeline(N, 30);
  const at = t.at;
  const cuts: [number, React.ReactNode][] = [
    [0, <Question t={t} />],
    [at('It started') - 1, <Spark t={t} />],
    [at('Temperance') - 1, <Fuel t={t} />],
    [at('But notice') - 1, <Difference t={t} />],
    [at('By 1860') - 1, <Value t={t} />],
    [at('You can talk') - 1, <Whiskey t={t} />],
    [at("And that's why") - 1, <Split t={t} />],
  ];
  const scene = cuts.reduce((acc, [f, node]) => (frame >= f ? node : acc), cuts[0][1]);
  const end = Math.ceil(N.duration * 30);
  return (
    <AbsoluteFill>
      {scene}
      <Finish vignette={0.35} />
      <Audio src={staticFile('audio/ch11_why.wav')} />
      <Audio src={staticFile('music/ending.mp3')} volume={(f) => interpolate(f, [0, 20, end - 30, end + 70], [0, 0.15, 0.2, 0], clamp)} />
      {cuts.slice(1).map(([f], i) => <Sfx key={i} at={f} src="sfx/whoosh.wav" volume={0.24} />)}
      {['fixed', 'stuck', 'world', 'Most reforms', 'Abolition asked', '1860', 'valuable', 'split'].map((c) => <Sfx key={c} at={at(c) - 2} src="sfx/stamp.wav" volume={0.24} />)}
      {['back', 'Why', 'You can', 'yourself', 'notice', 'asked', 'give up', 'counted', 'You can talk', 'harder', 'fever', 'story'].map((c) => <Sfx key={c} at={at(c) - 2} src={WRITE.src} volume={WRITE.volume} />)}
    </AbsoluteFill>
  );
};

export const Ch11: React.FC = () => (
  <PaletteCtx.Provider value={PALETTES.quiet}>
    <StepCtx.Provider value={2.5}>
      <Body />
    </StepCtx.Provider>
  </PaletteCtx.Provider>
);
