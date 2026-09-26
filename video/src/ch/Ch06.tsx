// Chapter 6 · Cages, Closets, Cellars. A heavy chapter: quiet palette, fewer marks, slower moves.
import React from 'react';
import {AbsoluteFill, Audio, Easing, Img, interpolate, staticFile, useCurrentFrame} from 'remotion';
import words from '../../public/audio/ch06_cages.words.json';
import dix from '../../public/img/jh/masks/dix.json';
import {clamp} from '../lib/anim';
import {makeTimeline, type Narration} from '../lib/timing';
import {Finish, Highlight, INK, JF, MaskData, Note, PALETTES, PaletteCtx, Picture, Place, StepCtx, Tag, Traced, useGFrame, usePal} from '../jh/Kit';
import {Card, DarkPaper, MapView, mapToScreen, Sfx, WRITE} from './common';

const N = words as Narration;
const D = dix as unknown as MaskData;
export const CH06_FRAMES = Math.ceil(N.duration * 30) + 36;
type TL = ReturnType<typeof makeTimeline>;
const GEN: [number, number] = [1376, 768];

const fill = (size: [number, number], fx: number, fy: number, z: number): Place => {
  const sc = Math.max(1920 / size[0], 1080 / size[1]) * z;
  return {left: Math.min(0, Math.max(1920 - size[0] * sc, 960 - fx * sc)), top: Math.min(0, Math.max(1080 - size[1] * sc, 540 - fy * sc)), scale: sc};
};

const Strike: React.FC<{x: number; y: number; w: number; at: number}> = ({x, y, w, at}) => {
  const g = useGFrame();
  if (g < at) return null;
  const p = interpolate(g, [at, at + 6], [0, 1], clamp);
  return (
    <svg style={{position: 'absolute', left: 0, top: 0, overflow: 'visible'}} width={1920} height={1080}>
      <path d={`M${x},${y + 6} Q${x + w / 2},${y - 8} ${x + w},${y}`} fill="none" stroke="#EDE7DC" strokeWidth={7} strokeLinecap="round" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - p} />
    </svg>
  );
};

/** Dix, cut out and outlined, on the desk. */
const DixFigure: React.FC<{x: number; y: number; h: number; at: number; dur?: number}> = ({x, y, h, at, dur = 16}) => {
  const place: Place = {left: x, top: y, scale: h / D.size[1]};
  return (
    <>
      <Picture src="img/jh/dix_cut.png" place={place} size={D.size} bw="grayscale(1) contrast(1.1)" style={{filter: 'grayscale(1) contrast(1.1) drop-shadow(0 20px 30px rgba(0,0,0,0.7))'}} />
      <Traced paths={D.shapes.magenta} place={place} at={at} dur={dur} width={5} part={0.92} />
    </>
  );
};

const Intro: React.FC<{t: TL}> = ({t}) => {
  const g = useGFrame();
  return (
    <AbsoluteFill>
      <DarkPaper />
      <DixFigure x={1060} y={150} h={930} at={t.at('Dorothea') - 2} />
      {g >= t.at('1841') && <Highlight text="1841" x={110} y={120} size={100} at={t.at('1841')} seed={501} />}
      <Note text="a schoolteacher named..." x={120} y={290} size={56} rot={-3} at={t.at('schoolteacher')} />
      {g >= t.at('Dorothea') && <Highlight text="DOROTHEA DIX" x={110} y={380} size={96} at={t.at('Dorothea')} seed={503} />}
      <Note text="volunteers to teach Sunday school" x={130} y={560} size={52} rot={-2} at={t.at('volunteered')} />
      <Note text="at a jail outside Boston" x={150} y={640} size={52} rot={-2} at={t.at('jail')} />
      <Tag text="Dorothea Dix, daguerreotype, c. 1849 · National Portrait Gallery" y={1030} />
    </AbsoluteFill>
  );
};

/** What she found: the cell. One slow push, few words. */
const Cell: React.FC<{t: TL}> = ({t}) => {
  const frame = useCurrentFrame();
  const g = useGFrame();
  const a = t.at('What she');
  const place = fill(GEN, 640, 400, interpolate(frame, [a, t.at('So Dix')], [1.02, 1.2], {...clamp, easing: Easing.inOut(Easing.sin)}));
  const o = interpolate(frame, [a - 1, a + 12], [0, 1], clamp);
  return (
    <AbsoluteFill style={{background: '#050505', overflow: 'hidden'}}>
      <div style={{opacity: o}}><Picture src="img/gen/ch06_cell.jpg" place={place} size={GEN} bw="grayscale(1) contrast(1.15) brightness(0.9)" /></div>
      <AbsoluteFill style={{background: 'radial-gradient(ellipse at 50% 45%, transparent 35%, rgba(0,0,0,0.75) 100%)'}} />
      <Note text="locked in with the prisoners:" x={110} y={110} size={54} rot={-2} at={t.at('Locked')} out={t.at('Some were')} color="#EDE7DC" />
      <Note text="people with mental illness" x={140} y={190} size={60} rot={-2} at={t.at('mental')} out={t.at('Some were')} />
      <Note text="no crime." x={140} y={820} size={66} rot={-3} at={t.at('crime')} out={t.at('Some were')} />
      <Note text="just sick." x={400} y={880} size={66} rot={-3} at={t.at('sick')} out={t.at('Some were')} />
      <Note text="no heat" x={120} y={130} size={62} rot={-3} at={t.at('no heat')} />
      <Note text="a Massachusetts winter" x={140} y={220} size={56} rot={-2} at={t.at('winter') - 4} color="#EDE7DC" />
      <Tag text="Illustration · a county jail cell, Massachusetts, 1841" />
    </AbsoluteFill>
  );
};

const Road: React.FC<{t: TL}> = ({t}) => {
  const frame = useCurrentFrame();
  const g = useGFrame();
  const place = fill(GEN, 820, 420, interpolate(frame, [t.at('So Dix'), t.at('Then she')], [1.04, 1.16], clamp));
  const beats: [string, string][] = [['town to town', 'Town'], ['jail to jail', 'jail to'], ['poorhouse to poorhouse', 'poorhouse']];
  return (
    <AbsoluteFill style={{background: INK, overflow: 'hidden'}}>
      <Picture src="img/gen/ch06_road.jpg" place={place} size={GEN} bw="grayscale(1) contrast(1.15) brightness(1.02)" />
      <AbsoluteFill style={{background: 'linear-gradient(90deg, rgba(0,0,0,0.55) 0%, transparent 55%)'}} />
      <Note text="so Dix did something nobody expected." x={100} y={100} size={52} rot={-2} at={t.at('something')} color="#EDE7DC" />
      {g >= t.at('traveling') && <Highlight text="SHE STARTED TRAVELING" x={100} y={190} size={76} at={t.at('traveling')} seed={505} />}
      {beats.map(([txt, cue], i) => <Note key={txt} text={txt} x={130 + i * 20} y={360 + i * 80} size={56} rot={-3} at={t.at(cue)} />)}
      <Note text="writing down everything she saw" x={130} y={650} size={54} rot={-2} at={t.at('writing')} color="#EDE7DC" />
      <Note text="calmly." x={160} y={760} size={62} rot={-3} at={t.at('Calmly')} />
      <Note text="in detail." x={420} y={800} size={62} rot={-3} at={t.at('detail')} />
      <Tag text="Illustration · a winter road in Massachusetts, 1842" />
    </AbsoluteFill>
  );
};

const Legislature: React.FC<{t: TL}> = ({t}) => {
  const g = useGFrame();
  return (
    <AbsoluteFill>
      <DarkPaper />
      <Card src="img/test/dix_title.jpg" x={150} y={90} w={600} rot={-2} at={t.at('Then she') - 1} filter="sepia(0.35) contrast(1.1)" />
      <Note text="to the state legislature" x={860} y={150} size={56} rot={-3} at={t.at('legislature') - 4} />
      <Note text="she couldn't vote" x={880} y={330} size={66} rot={-2} at={t.at('vote')} color="#EDE7DC" />
      <Strike x={870} y={380} w={460} at={t.at('vote') + 8} />
      <Note text="she couldn't hold office" x={880} y={460} size={66} rot={-2} at={t.at('office') - 2} color="#EDE7DC" />
      <Strike x={870} y={510} w={620} at={t.at('office') + 6} />
      {g >= t.at('But she') && <Highlight text="BUT SHE COULD WRITE." x={860} y={620} size={88} at={t.at('write')} seed={507} rot={-2} />}
      <Tag text="D. L. Dix, Memorial to the Legislature of Massachusetts, 1843 (1904 reprint)" y={1030} />
    </AbsoluteFill>
  );
};

// Memorial page (1642 x 2400): the quoted words and where they sit on the scan.
const QUOTE: [string, number, number, number][] = [
  ['in', 138, 180, 0], ['cages,', 200, 305, 0], ['closets,', 328, 470, 0], ['cellars,', 485, 610, 0], ['stalls,', 638, 752, 0], ['pens!', 768, 875, 0],
  ['Chained,', 918, 1112, 0], ['naked,', 1118, 1250, 0], ['beaten', 1262, 1398, 0], ['with', 1402, 1492, 0],
  ['rods,', 138, 220, 1], ['and', 248, 332, 1], ['lashed', 342, 474, 1], ['into', 488, 582, 1], ['obedience.', 588, 802, 1],
];

/** Her own words: the page goes dark except the quoted lines, which light up as they are read. */
const Quote: React.FC<{t: TL}> = ({t}) => {
  const frame = useCurrentFrame();
  const g = useGFrame();
  const pal = usePal();
  const q0 = t.idx('in cages');
  const start = t.at('And she told');
  const ps = interpolate(frame, [start, start + 40], [0.72, 1.12], {...clamp, easing: Easing.inOut(Easing.cubic)});
  const cx = 815;
  const cy = interpolate(frame, [start, start + 40], [1500, 1655], {...clamp, easing: Easing.inOut(Easing.cubic)});
  const L = (x: number) => 960 + (x - cx) * ps;
  const T = (y: number) => 540 + (y - cy) * ps;
  const dim = interpolate(frame, [t.at('in cages') - 16, t.at('in cages')], [0, 0.86], clamp);
  return (
    <AbsoluteFill style={{background: '#0a0908', overflow: 'hidden'}}>
      <Img src={staticFile('img/test/dix_p2.jpg')} style={{position: 'absolute', left: L(0), top: T(0), width: 1642 * ps, filter: 'sepia(0.3) saturate(0.6) contrast(1.1)'}} />
      {QUOTE.map(([w, x0, x1, line], i) => {
        const wd = N.words[q0 + i];
        const k = interpolate(frame, [wd.s * 30 - 2, wd.e * 30], [0, 1], clamp);
        if (k <= 0) return null;
        return <div key={i} style={{position: 'absolute', left: L(x0 - 4), top: T(1606 + line * 50), width: (x1 - x0 + 8) * ps * k, height: 46 * ps, background: pal.mark, mixBlendMode: 'multiply', opacity: 0.75}} />;
      })}
      {(() => {
        const x0 = L(120);
        const y0 = T(1596);
        const x1 = L(1500);
        const y1 = T(1708);
        const c = `rgba(6,5,4,${dim})`;
        return (
          <>
            <div style={{position: 'absolute', left: 0, top: 0, width: 1920, height: Math.max(0, y0), background: c}} />
            <div style={{position: 'absolute', left: 0, top: y1, width: 1920, height: Math.max(0, 1080 - y1), background: c}} />
            <div style={{position: 'absolute', left: 0, top: y0, width: Math.max(0, x0), height: y1 - y0, background: c}} />
            <div style={{position: 'absolute', left: x1, top: y0, width: Math.max(0, 1920 - x1), height: y1 - y0, background: c}} />
          </>
        );
      })()}
      <Note text="her report to the lawmakers:" x={110} y={90} size={54} rot={-2} at={t.at('lawmakers')} out={t.at('in cages') - 4} color="#EDE7DC" />
      {g >= t.at('in cages') && <div style={{position: 'absolute', left: 110, top: 150, fontFamily: JF.mono, fontSize: 24, letterSpacing: 3, color: 'rgba(237,231,220,0.7)'}}>MEMORIAL TO THE LEGISLATURE OF MASSACHUSETTS · 1843</div>}
      <Tag text="D. L. Dix, Memorial to the Legislature of Massachusetts, 1843 (1904 reprint)" />
    </AbsoluteFill>
  );
};

const Imagine: React.FC<{t: TL}> = ({t}) => {
  const frame = useCurrentFrame();
  const z = interpolate(frame, [t.at('Imagine'), t.at('It worked')], [1.0, 1.06], clamp);
  return (
    <AbsoluteFill style={{background: '#0a0908', overflow: 'hidden'}}>
      <div style={{position: 'absolute', inset: 0, transform: `scale(${z})`}}>
        <Img src={staticFile('img/test/dix_p2.jpg')} style={{position: 'absolute', left: 560, top: -200, width: 800, filter: 'sepia(0.3) saturate(0.6) brightness(0.35)'}} />
      </div>
      <Note text="imagine being a politician..." x={180} y={380} size={70} rot={-3} at={t.at('Imagine')} color="#EDE7DC" />
      <Note text="...and hearing that about your own state." x={240} y={520} size={70} rot={-3} at={t.at('hearing')} />
    </AbsoluteFill>
  );
};

// Map pins for states where Dix campaigned (Mitchell 1836 map pixels).
const STATES: [string, number[]][] = [
  ['Mass.', [3440, 1690]], ['R.I.', [3480, 1745]], ['N.J.', [3230, 1960]], ['Penn.', [3000, 1890]], ['Md.', [3120, 2040]], ['N.C.', [2980, 2440]],
  ['Tenn.', [2320, 2500]], ['Ky.', [2260, 2270]], ['Ind.', [2020, 2080]], ['Ill.', [1720, 2020]], ['Miss.', [1860, 2800]], ['Ala.', [2140, 2790]],
];

const Worked: React.FC<{t: TL}> = ({t}) => {
  const frame = useCurrentFrame();
  const g = useGFrame();
  const pal = usePal();
  const s = interpolate(frame, [t.at('It worked'), t.at('One woman')], [0.3, 0.33], clamp);
  const S = mapToScreen(2600, 2250, s);
  const st0 = t.at('state after');
  const c0 = t.at('30');
  const n = Math.round(interpolate(g, [c0 - 10, c0 + 6], [0, 30], clamp));
  return (
    <AbsoluteFill style={{background: '#15130f'}}>
      <MapView cx={2600} cy={2250} s={s} dim={0.15} />
      <AbsoluteFill style={{background: 'radial-gradient(ellipse at 50% 50%, transparent 45%, rgba(8,6,4,0.8) 100%)'}} />
      {g >= t.at('It worked') && <Highlight text="IT WORKED." x={100} y={90} size={96} at={t.at('worked')} seed={509} />}
      <Note text="state after state" x={120} y={240} size={58} rot={-3} at={st0} />
      {STATES.map(([name, p], i) => {
        const at = st0 - 8 + i * 2;
        if (g < at) return null;
        const [x, y] = S(p);
        const k = interpolate(g, [at, at + 3, at + 6], [0, 1.3, 1], clamp);
        return <div key={name} style={{position: 'absolute', left: x - 11, top: y - 11, width: 22, height: 22, borderRadius: '50%', background: pal.mark, border: `4px solid ${INK}`, transform: `scale(${k})`}} />;
      })}
      {g >= c0 - 10 && (
        <div style={{position: 'absolute', left: 1320, top: 640, textAlign: 'left'}}>
          <div style={{fontFamily: JF.display, fontSize: 170, lineHeight: 1, color: '#f4efe6', textShadow: '0 6px 22px rgba(0,0,0,0.8)'}}>{n}+</div>
          <div style={{fontFamily: JF.mono, fontSize: 28, letterSpacing: 3, color: '#EDE7DC', marginTop: 8}}>HOSPITALS FOUNDED OR EXPANDED</div>
        </div>
      )}
      <Card src="img/ch06/trenton.jpg" x={1260} y={150} w={560} rot={3} at={t.at('helped')} filter="grayscale(1) contrast(1.15)" />
      <Tag text="Mitchell's Map, 1836 (selected states) · New Jersey State Lunatic Asylum, Trenton, opened 1848, the first hospital Dix founded" />
    </AbsoluteFill>
  );
};

const Closing: React.FC<{t: TL}> = ({t}) => {
  const g = useGFrame();
  return (
    <AbsoluteFill>
      <DarkPaper />
      <DixFigure x={1060} y={150} h={930} at={t.at('One woman') - 4} dur={20} />
      <Note text="one woman" x={140} y={300} size={80} rot={-3} at={t.at('One woman')} color="#EDE7DC" />
      <Note text="with a notebook" x={180} y={420} size={80} rot={-3} at={t.at('notebook') - 2} />
      <Note text="changed how an entire country" x={140} y={640} size={54} rot={-2} at={t.at('changed')} color="#EDE7DC" />
      <Note text="treated people with mental illness." x={160} y={720} size={54} rot={-2} at={t.at('treated')} color="#EDE7DC" />
    </AbsoluteFill>
  );
};

const Body: React.FC = () => {
  const frame = useCurrentFrame();
  const t = makeTimeline(N, 30);
  const at = t.at;
  const cuts: [number, React.ReactNode][] = [
    [0, <Intro t={t} />],
    [at('What she') - 1, <Cell t={t} />],
    [at('So Dix') - 1, <Road t={t} />],
    [at('Then she') - 1, <Legislature t={t} />],
    [at('And she told') - 1, <Quote t={t} />],
    [at('Imagine') - 1, <Imagine t={t} />],
    [at('It worked') - 1, <Worked t={t} />],
    [at('One woman') - 1, <Closing t={t} />],
  ];
  const scene = cuts.reduce((acc, [f, node]) => (frame >= f ? node : acc), cuts[0][1]);
  const end = Math.ceil(N.duration * 30);
  return (
    <AbsoluteFill>
      {scene}
      <Finish vignette={0.35} />
      <Audio src={staticFile('audio/ch06_cages.wav')} />
      <Audio src={staticFile('music/dix.mp3')} volume={(f) => interpolate(f, [0, 30, end - 20, end + 36], [0, 0.14, 0.14, 0], clamp)} />
      {[at('So Dix'), at('Then she'), at('It worked'), at('One woman')].map((f, i) => <Sfx key={i} at={f - 1} src="sfx/page_turn.wav" volume={0.3} />)}
      {['1841', 'Dorothea', 'traveling', 'write', 'worked'].map((c) => <Sfx key={c} at={at(c)} src="sfx/stamp.wav" volume={0.2} />)}
      {['schoolteacher', 'volunteered', 'Locked', 'crime', 'no heat', 'Town', 'writing', 'legislature', 'vote', 'office', 'Imagine', 'state after', 'notebook'].map((c) => (
        <Sfx key={c} at={at(c) - 2} src={WRITE.src} volume={WRITE.volume * 0.8} />
      ))}
    </AbsoluteFill>
  );
};

export const Ch06: React.FC = () => (
  <PaletteCtx.Provider value={PALETTES.quiet}>
    <StepCtx.Provider value={2.5}>
      <Body />
    </StepCtx.Provider>
  </PaletteCtx.Provider>
);
