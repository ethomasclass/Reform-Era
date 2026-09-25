// Chapter 2 · Burned Over
import React from 'react';
import {AbsoluteFill, Audio, Easing, Img, interpolate, random, staticFile, useCurrentFrame} from 'remotion';
import words from '../../public/audio/ch02_burned_over.words.json';
import revival from '../../public/img/jh/masks/revival.json';
import finney from '../../public/img/jh/masks/finney.json';
import {clamp} from '../lib/anim';
import {makeTimeline, type Narration} from '../lib/timing';
import {useHand, Arrow, boxOf, ColourReveal, Finish, Highlight, INK, JF, Loop, MaskData, Note, PALETTES, PaletteCtx, Picture, Place, StepCtx, Tag, Tint, Traced, useGFrame, usePal} from '../jh/Kit';
import {DarkPaper, Ember, MapView, mapToScreen, Sfx, WRITE} from './common';

const N = words as Narration;
const R = revival as unknown as MaskData;
const FIN = finney as unknown as MaskData;
export const CH02_FRAMES = Math.ceil(N.duration * 30) + 30;
type TL = ReturnType<typeof makeTimeline>;

const HOTSPOTS = [[3489, 1660], [3150, 1900], [2980, 2120], [2860, 1500], [2500, 1520], [2200, 1850], [1900, 2150], [2644, 3045], [2400, 2500], [3350, 1500], [1600, 2600], [2750, 2400], [2950, 1620], [2100, 2900]];
const TOWNS: [string, number[]][] = [['Buffalo', [2775, 1635]], ['Rochester', [2808, 1590]], ['Auburn', [2985, 1622]], ['Rome', [3085, 1578]], ['Utica', [3117, 1587]]];
const DISTRICT = [[2760, 1640], [2790, 1575], [2880, 1560], [2990, 1550], [3060, 1555], [3140, 1585], [3150, 1640], [3120, 1700], [3000, 1725], [2860, 1730], [2770, 1705]];

const glow = (id: string, pal: ReturnType<typeof usePal>) => (
  <defs>
    <radialGradient id={id}><stop offset="0%" stopColor={pal.subject} stopOpacity={0.95} /><stop offset="55%" stopColor={boxOf(pal)} stopOpacity={0.4} /><stop offset="100%" stopColor={boxOf(pal)} stopOpacity={0} /></radialGradient>
  </defs>
);

/** Zoom from the whole country into upstate New York. */
const Upstate: React.FC<{t: TL}> = ({t}) => {
  const frame = useCurrentFrame();
  const g = useGFrame();
  const k = interpolate(frame, [0, t.at('York') + 10], [0, 1], {...clamp, easing: Easing.inOut(Easing.cubic)});
  const s = Math.exp(Math.log(0.26) + (Math.log(1.9) - Math.log(0.26)) * k);
  const cx = 2600 + (2950 - 2600) * k;
  const cy = 2320 + (1620 - 2320) * k;
  return (
    <AbsoluteFill style={{background: '#15130f'}}>
      <MapView cx={cx} cy={cy} s={s} />
      <AbsoluteFill style={{background: 'radial-gradient(ellipse at 50% 50%, transparent 45%, rgba(8,6,4,0.8) 100%)'}} />
      {g >= t.at('upstate') && <Highlight text="UPSTATE NEW YORK" x={120} y={110} size={84} at={t.at('upstate')} seed={71} />}
    </AbsoluteFill>
  );
};

/** The 1819 camp meeting, black and white with its colour creeping in. */
const Camp1819: React.FC<{t: TL; from: number; days?: boolean}> = ({t, from, days}) => {
  const frame = useCurrentFrame();
  const size: [number, number] = [2173, 1375];
  const sc = 1920 / 2173 * interpolate(frame, [from, from + 150], [1.02, 1.1], clamp);
  const place: Place = {left: 960 - 1086 * sc, top: 540 - 640 * sc, scale: sc};
  const g = useGFrame();
  return (
    <AbsoluteFill style={{background: INK}}>
      <Picture src="img/ch02/camp1819_art.jpg" place={place} size={size} bw="grayscale(1) contrast(1.25) brightness(1.02)" />
      <ColourReveal src="img/ch02/camp1819_art.jpg" place={place} size={size} from={0.55} to={0.9} filter="saturate(1.3)" />
      {!days && <Note text="thousands of people" x={120} y={130} size={60} rot={-4} at={t.at('Thousands')} />}
      {!days && <Note text="packed under tents" x={180} y={230} size={56} rot={-3} at={t.at('tents') - 2} />}
      {days && ['DAY 1', 'DAY 2', 'DAY 3', 'DAY 4 ...'].map((d, i) => {
        const st = t.at('Some') + i * 9;
        return g >= st ? <Highlight key={d} text={d} x={140 + i * 300} y={140 + (i % 2) * 30} size={70} at={st} seed={80 + i} rot={i % 2 ? 3 : -3} /> : null;
      })}
      <Tag text="Camp Meeting of the Methodists in N. America, c. 1819 · Library of Congress" />
    </AbsoluteFill>
  );
};

/** Punch-ins on the 1829 camp meeting: crying, shouting, falling. */
const PunchIns: React.FC<{t: TL}> = ({t}) => {
  const frame = useCurrentFrame();
  const beats = [
    {cue: 'People crying', cx: 745, cy: 780, z: 2.0, label: 'CRYING'},
    {cue: 'People shouting', cx: 752, cy: 470, z: 2.3, label: 'SHOUTING'},
    {cue: 'People falling', cx: 1170, cy: 890, z: 1.65, label: 'FALLING TO THE GROUND'},
  ];
  const i = beats.reduce((acc, b, k) => (frame >= t.at(b.cue) - 1 ? k : acc), 0);
  const b = beats[i];
  const local = frame - t.at(b.cue);
  const sc = (1920 / R.size[0]) * b.z * (1 + local * 0.002);
  const place: Place = {left: 960 - b.cx * sc, top: 540 - b.cy * sc, scale: sc};
  return (
    <AbsoluteFill style={{background: INK, overflow: 'hidden'}}>
      <Picture src="img/jh/cm_hero.jpg" place={place} size={R.size} bw="grayscale(1) contrast(1.4) brightness(1.02)" />
      {i === 0 && <Loop cx={960} cy={560} rx={420} ry={300} tilt={-6} at={t.at(b.cue) + 2} dur={8} width={6} seed={91} />}
      {i === 1 && <><Tint mask="img/jh/masks/revival_magenta_a.png" place={place} size={R.size} /><Traced paths={R.shapes.magenta} place={place} at={t.at(b.cue) + 1} dur={8} width={6} /></>}
      {i === 2 && <Traced paths={R.shapes.green} place={place} at={t.at(b.cue) + 1} dur={10} width={6} />}
      <Highlight key={b.label} text={b.label} x={110} y={860} size={96} at={t.at(b.cue)} seed={92 + i} rot={-2} />
      <Tag text="Camp-Meeting · lithograph, c. 1829 · Library of Congress" y={40} />
    </AbsoluteFill>
  );
};

/** A wave of revival across the country. */
const Awakening: React.FC<{t: TL}> = ({t}) => {
  const frame = useCurrentFrame();
  const g = useGFrame();
  const pal = usePal();
  const f0 = t.at('massive');
  const s = 0.26 + (frame - t.at('This is')) * 0.00012;
  return (
    <AbsoluteFill style={{background: '#15130f'}}>
      <MapView cx={2600} cy={2320} s={s}>
        {glow('wave', pal)}
        {HOTSPOTS.map(([x, y], i) => {
          const st = f0 + Math.round(((x - 1500) / 2200) * 45) + Math.round(random(`a${i}`) * 8);
          const p = interpolate(g, [st, st + 16], [0, 1], clamp);
          if (g < st) return null;
          return <circle key={i} cx={x} cy={y} r={(140 + 170 * p) * (1 + 0.1 * Math.sin((g - st) / 5 + i))} fill="url(#wave)" opacity={0.85 * p} />;
        })}
      </MapView>
      <AbsoluteFill style={{background: 'radial-gradient(ellipse at 50% 50%, transparent 45%, rgba(8,6,4,0.8) 100%)'}} />
      {g >= t.at('Second') && <Highlight text="THE SECOND GREAT AWAKENING" x={110} y={100} size={86} at={t.at('Second')} seed={101} />}
      <Note text="a wave of religious revival" x={150} y={230} size={50} rot={-3} at={t.at('massive')} />
      <Note text="early 1800s" x={1380} y={860} size={56} rot={-5} at={t.at('early')} />
    </AbsoluteFill>
  );
};

/** Finney on dark paper. */
const FinneyIntro: React.FC<{t: TL}> = ({t}) => {
  const g = useGFrame();
  const h = 960;
  const sc = h / FIN.size[1];
  const place: Place = {left: 120, top: 150, scale: sc};
  const sigAt = t.at('Finney');
  const sig = interpolate(g, [sigAt, sigAt + 14], [0, 100], clamp);
  return (
    <AbsoluteFill>
      <DarkPaper />
      <Picture src="img/ch02/finney_cut.png" place={place} size={FIN.size} bw="grayscale(1) contrast(1.15)" style={{filter: 'grayscale(1) contrast(1.15) drop-shadow(0 20px 30px rgba(0,0,0,0.7))'}} />
      <Tint mask="img/jh/masks/finney_subject_a.png" place={place} size={FIN.size} strength={0.5} />
      <Traced paths={FIN.shapes.subject} place={place} at={t.at('And its') + 4} dur={12} width={5} part={0.93} />
      <Note text="a former lawyer" x={960} y={300} size={56} rot={-4} at={t.at('former')} />
      {g >= t.at('Charles') && <Highlight text="CHARLES GRANDISON FINNEY" x={780} y={400} size={64} at={t.at('Charles')} seed={111} />}
      {g >= sigAt && <Img src={staticFile('img/ch02/finney_sig.png')} style={{position: 'absolute', left: 940, top: 540, width: 560, filter: 'invert(1) brightness(1.4)', clipPath: `inset(0 ${100 - sig}% 0 0)`}} />}
      <Note text="why was he such a big deal?" x={960} y={740} size={50} rot={-3} at={t.at('Now')} />
      <Note text="what he was up against →" x={1080} y={840} size={50} rot={-2} at={t.at('up against') - 2} />
      <Tag text="Charles Grandison Finney, engraving, c. 1850" />
    </AbsoluteFill>
  );
};

/** The Puritans and predestination. */
const Puritans: React.FC<{t: TL}> = ({t}) => {
  const frame = useCurrentFrame();
  const g = useGFrame();
  const z = interpolate(frame, [t.at('The older'), t.at('Basically')], [1.02, 1.1], clamp);
  const pd = t.at('predestination');
  return (
    <AbsoluteFill style={{background: INK, overflow: 'hidden'}}>
      <Img src={staticFile('img/ch02/puritans_art.jpg')} style={{position: 'absolute', inset: -60, width: 2040, height: 1200, objectFit: 'cover', filter: 'grayscale(1) blur(20px) brightness(0.4)'}} />
      <Img src={staticFile('img/ch02/puritans_art.jpg')} style={{position: 'absolute', left: 1080, top: 0, height: 1080, filter: 'grayscale(1) contrast(1.25)', transform: `scale(${z})`, transformOrigin: '50% 40%', boxShadow: '0 0 60px rgba(0,0,0,0.8)'}} />
      {g >= t.at('Puritan') && <Highlight text="THE PURITANS" x={110} y={150} size={92} at={t.at('Puritan')} seed={121} />}
      {g >= pd && <Highlight text="PREDESTINATION" x={110} y={560} size={110} at={pd} seed={123} rot={-2} />}
      {g >= pd + 8 && (
        <div style={{position: 'absolute', left: 130, top: 720, width: 820, fontFamily: JF.sans, fontWeight: 600, fontSize: 34, lineHeight: 1.35, color: '#fff',
          background: 'rgba(10,10,10,0.75)', padding: '16px 24px', opacity: interpolate(g, [pd + 8, pd + 14], [0, 1], clamp)}}>
          <span style={{color: usePal().mark}}>pre·des·ti·na·tion</span> · the belief that God decided, before you were born, whether you would be saved
        </div>
      )}
      <Tag text="Puritans Going to Church, engraving after G. H. Boughton, 1885 (later depiction)" />
    </AbsoluteFill>
  );
};

const Lock: React.FC<{x: number; y: number; open?: boolean; color: string; at: number}> = ({x, y, open, color, at}) => {
  const g = useGFrame();
  if (g < at) return null;
  const k = interpolate(g, [at, at + 5], [0, 1], {...clamp, easing: Easing.out(Easing.back(1.8))});
  return (
    <svg style={{position: 'absolute', left: x, top: y, overflow: 'visible', transform: `scale(${k})`}} width={120} height={150}>
      <path d={open ? 'M28,62 L28,38 C28,10 88,6 92,34' : 'M28,62 L28,38 C28,6 92,6 92,38 L92,62'} fill="none" stroke={color} strokeWidth={10} strokeLinecap="round" />
      <rect x={10} y={60} width={100} height={80} rx={10} fill={color} />
      <circle cx={60} cy={96} r={10} fill={INK} /><rect x={56} y={100} width={8} height={22} fill={INK} />
    </svg>
  );
};

const Box: React.FC<{x: number; y: number; w: number; h: number; at: number; label: string; color: string; seed: number}> = ({x, y, w, h, at, label, color, seed}) => {
  const g = useGFrame();
  if (g < at) return null;
  const p = interpolate(g, [at, at + 8], [0, 1], clamp);
  const j = (k: string) => (random(`${seed}${k}`) - 0.5) * 10;
  const d = `M${x + j('a')},${y + j('b')} L${x + w + j('c')},${y + j('d')} L${x + w + j('e')},${y + h + j('f')} L${x + j('g')},${y + h + j('h')} Z`;
  return (
    <>
      <svg style={{position: 'absolute', left: 0, top: 0, overflow: 'visible'}} width={1920} height={1080}>
        <path d={d} fill="rgba(0,0,0,0.25)" stroke={color} strokeWidth={6} strokeLinejoin="round" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - p} />
      </svg>
      <div style={{position: 'absolute', left: x, top: y, width: w, height: h, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: JF.display, fontSize: 64, color: '#fff', opacity: p}}>{label}</div>
    </>
  );
};

/** Predestination as a diagram, then Finney flips it. */
const Diagram: React.FC<{t: TL}> = ({t}) => {
  const frame = useCurrentFrame();
  const g = useGFrame();
  const pal = usePal();
  const flip = t.at('Finney flipped');
  const flipK = interpolate(g, [flip, flip + 8], [0, 1], clamp);
  const flipped = flipK >= 0.5;
  const rotY = flipK < 0.5 ? flipK * 180 : (flipK - 1) * 180;
  const fsc = 520 / FIN.size[1];
  const fplace: Place = {left: 1440, top: 600, scale: fsc};
  return (
    <AbsoluteFill>
      <DarkPaper />
      <AbsoluteFill style={{transform: `perspective(2000px) rotateY(${rotY}deg)`}}>
        {!flipped ? (
          <>
            <Note text="before you were born..." x={110} y={420} size={56} rot={-4} at={t.at('before')} />
            <Arrow x1={640} y1={470} x2={880} y2={290} bow={-30} at={t.at('before') + 8} />
            <Arrow x1={640} y1={500} x2={880} y2={660} bow={30} at={t.at('before') + 10} />
            <Box x={900} y={200} w={420} h={170} at={t.at('saved')} label="SAVED" color={pal.mark} seed={1} />
            <Box x={900} y={570} w={420} h={170} at={t.at('not') - 2} label="NOT SAVED" color={pal.mark} seed={2} />
            <Lock x={230} y={560} color={pal.mark} at={t.at('decided')} />
            <Note text="already decided" x={170} y={730} size={50} rot={-3} at={t.at('decided') + 4} />
            <Note text="pray harder?" x={1400} y={250} size={50} rot={-4} at={t.at('Nothing')} />
            <Note text="be good?" x={1420} y={380} size={50} rot={-2} at={t.at('changes')} />
            <StrikeLine x={1395} y={290} w={300} at={t.at('changes') - 4} />
            <StrikeLine x={1415} y={420} w={220} at={t.at('it.') - 2} />
            <Note text="(kind of a bummer)" x={1250} y={880} size={54} rot={-5} at={t.at('Kind')} />
          </>
        ) : (
          <>
            <Lock x={220} y={250} open color={pal.subject} at={flip + 4} />
            {g >= t.at('salvation') && <Highlight text="SALVATION" after="IS A CHOICE" x={420} y={260} size={100} at={t.at('salvation')} seed={131} />}
            <Note text="you can choose..." x={260} y={500} size={60} rot={-4} at={t.at('choose')} />
            {g >= t.at('today') && <Highlight text="TODAY." x={300} y={640} size={110} at={t.at('today')} seed={133} rot={-2} />}
            {g >= t.at('right now') && <Highlight text="RIGHT NOW." x={420} y={800} size={110} at={t.at('right now')} seed={135} rot={2} />}
            <Picture src="img/ch02/finney_cut.png" place={fplace} size={FIN.size} bw="grayscale(1) contrast(1.15)" />
            <Tint mask="img/jh/masks/finney_subject_a.png" place={fplace} size={FIN.size} strength={0.5} />
            <Traced paths={FIN.shapes.subject} place={fplace} at={flip + 6} dur={10} width={4} part={0.9} />
          </>
        )}
      </AbsoluteFill>
      {frame < flip && <Note text="Puritan belief" x={110} y={110} size={48} rot={-3} at={t.at('Basically')} color="#ffffff" />}
    </AbsoluteFill>
  );
};

const StrikeLine: React.FC<{x: number; y: number; w: number; at: number}> = ({x, y, w, at}) => {
  const g = useGFrame();
  const pal = usePal();
  if (g < at) return null;
  const p = interpolate(g, [at, at + 5], [0, 1], clamp);
  return (
    <svg style={{position: 'absolute', left: 0, top: 0, overflow: 'visible'}} width={1920} height={1080}>
      <path d={`M${x},${y + 6} Q${x + w / 2},${y - 8} ${x + w},${y}`} fill="none" stroke={boxOf(pal)} strokeWidth={8} strokeLinecap="round" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - p} />
    </svg>
  );
};

/** The anxious bench, drawn as a floor plan. */
const Bench: React.FC<{t: TL}> = ({t}) => {
  const frame = useCurrentFrame();
  const g = useGFrame();
  const pal = usePal();
  const z = interpolate(frame, [t.at('And he sold'), t.at('The region')], [1, 1.08], clamp);
  const crowd: number[][] = [];
  for (let r = 0; r < 4; r++) {
    const n = 11 + r * 3;
    for (let i = 0; i < n; i++) {
      const a = Math.PI * (0.08 + (0.84 * i) / (n - 1));
      crowd.push([760 + Math.cos(a) * (230 + r * 70) * 1.05, 300 + Math.sin(a) * (230 + r * 70)]);
    }
  }
  const cAt = t.at('whole crowd');
  const pAt = t.at('prayed');
  return (
    <AbsoluteFill>
      <DarkPaper />
      <AbsoluteFill style={{transform: `scale(${z})`, transformOrigin: '30% 40%'}}>
        <Box x={620} y={60} w={280} h={110} at={t.at('And he sold')} label="PULPIT" color="#ffffff" seed={11} />
        <svg style={{position: 'absolute', left: 0, top: 0, overflow: 'visible'}} width={1920} height={1080}>
          {g >= t.at('anxious') && <rect x={530} y={250} width={460} height={60} rx={8} fill={boxOf(pal)} opacity={interpolate(g, [t.at('anxious'), t.at('anxious') + 5], [0, 1], clamp)} />}
          {[0, 1, 2, 3, 4].map((i) => {
            const st = t.at('wrestling') + i * 2;
            if (g < st) return null;
            return <circle key={i} cx={580 + i * 90} cy={280} r={24} fill={pal.subject} stroke={INK} strokeWidth={4} />;
          })}
          {crowd.map(([x, y], i) => {
            const st = cAt + Math.floor(i / 6);
            if (g < st) return null;
            return <circle key={i} cx={x} cy={y} r={15} fill="none" stroke={pal.mark} strokeWidth={4} />;
          })}
          {g >= pAt && crowd.filter((_, i) => i % 5 === 0).map(([x, y], i) => {
            const p = interpolate(g, [pAt + i, pAt + i + 6], [0, 1], clamp);
            const tx = 760 + (x - 760) * (1 - 0.55 * p);
            const ty = 290 + (y - 290) * (1 - 0.55 * p);
            return <line key={i} x1={x} y1={y} x2={tx} y2={ty} stroke={pal.mark} strokeWidth={3} strokeDasharray="8 8" opacity={0.8} />;
          })}
        </svg>
        {g >= t.at('anxious') && <Highlight text="THE ANXIOUS BENCH" x={1030} y={235} size={70} at={t.at('anxious')} seed={141} />}
        <Note text="sinners sit up front..." x={1290} y={345} size={42} rot={-3} at={t.at('wrestling')} />
        <Note text="...while everyone" x={1300} y={415} size={42} rot={-3} at={t.at('everyone') - 2} />
        <Note text="prays over them" x={1330} y={475} size={42} rot={-3} at={t.at('prayed') - 2} />
      </AbsoluteFill>
      <Note text="he sold it like a pro" x={110} y={950} size={48} rot={-3} at={t.at('pro') - 3} out={t.at('part church')} />
      {[['CHURCH SERVICE', 'part church'], ['CONCERT', 'concert'], ['REALITY SHOW', 'reality']].map(([txt, cue], i) =>
        g >= t.at(cue) ? <Highlight key={txt} text={txt} x={1200 + (i === 2 ? 50 : 0)} y={620 + i * 120} size={78} at={t.at(cue)} seed={150 + i} rot={i === 1 ? 2 : -2} /> : null,
      )}
    </AbsoluteFill>
  );
};

/** The Burned-Over District on the 1836 map. */
const District: React.FC<{t: TL}> = ({t}) => {
  const frame = useCurrentFrame();
  const g = useGFrame();
  const pal = usePal();
  const s0 = t.at('The region');
  const k = interpolate(frame, [s0 - 2, s0 + 30], [0, 1], {...clamp, easing: Easing.inOut(Easing.cubic)});
  const s = 1.4 + (2.15 - 1.4) * k;
  const cx = 2955;
  const cy = 1650;
  const toS = mapToScreen(cx, cy, s);
  const dAt = t.at('Burned-Over');
  const d = 'M' + DISTRICT.map(([x, y]) => `${x},${y}`).join(' L') + ' Z';
  const waves = [t.at('revivals'), t.at('fire'), t.at('swept', 2)];
  const hand = useHand();
  return (
    <AbsoluteFill style={{background: '#15130f'}}>
      <MapView cx={cx} cy={cy} s={s}>
        {glow('fire', pal)}
        {waves.flatMap((w0, wi) => Array.from({length: 9}).map((_, i) => {
          const x = 2780 + random(`fx${wi}${i}`) * 350;
          const y = 1570 + random(`fy${wi}${i}`) * 150;
          const st = w0 + Math.round(random(`ft${wi}${i}`) * 14);
          const p = interpolate(g, [st, st + 10, st + 40], [0, 1, 0.25], clamp);
          if (g < st) return null;
          return <circle key={`${wi}-${i}`} cx={x} cy={y} r={30 + 40 * p} fill="url(#fire)" opacity={p} />;
        }))}
        {g >= dAt && <path d={d} fill={`${pal.mark}22`} stroke={pal.mark} strokeWidth={7 / s * 2} strokeLinejoin="round" strokeDasharray="1" pathLength={1} strokeDashoffset={1 - interpolate(g, [dAt, dAt + 14], [0, 1], clamp)} />}
      </MapView>
      <AbsoluteFill style={{background: 'radial-gradient(ellipse at 50% 50%, transparent 45%, rgba(8,6,4,0.8) 100%)'}} />
      {TOWNS.map(([name, p], i) => {
        const [x, y] = toS(p);
        const st = t.at('western') + i * 4;
        if (g < st) return null;
        return (
          <React.Fragment key={name}>
            <div style={{position: 'absolute', left: x - 10, top: y - 10, width: 20, height: 20, borderRadius: '50%', background: pal.mark, border: `3px solid ${INK}`}} />
            <div style={{position: 'absolute', left: x + 14, top: y - (i % 2 ? 44 : -8), fontFamily: hand.family, fontWeight: hand.weight, fontSize: 34 * hand.scale, color: pal.mark,
              textShadow: '0 0 2px #111, 0 0 4px #111, 2px 2px 0 #111, -2px -2px 0 #111'}}>{name}</div>
          </React.Fragment>
        );
      })}
      <Note text="western New York" x={120} y={120} size={56} rot={-3} at={t.at('western')} out={dAt} />
      {g >= dAt && <Highlight text="THE BURNED-OVER DISTRICT" x={100} y={90} size={90} at={dAt} seed={161} />}
      <Note text="nobody left to convert!" x={1180} y={880} size={56} rot={-5} at={t.at('nobody')} />
      <Tag text="Mitchell's Map of the United States, 1836 · Library of Congress" />
    </AbsoluteFill>
  );
};

/** Finney's logic, as a chain of notes. */
const Chain: React.FC<{t: TL}> = ({t}) => {
  const g = useGFrame();
  const sc = 900 / FIN.size[1];
  const place: Place = {left: 60, top: 230, scale: sc};
  return (
    <AbsoluteFill>
      <DarkPaper />
      <Picture src="img/ch02/finney_cut.png" place={place} size={FIN.size} bw="grayscale(1) contrast(1.15)" style={{filter: 'grayscale(1) contrast(1.15) drop-shadow(0 20px 30px rgba(0,0,0,0.7))'}} />
      <Tint mask="img/jh/masks/finney_subject_a.png" place={place} size={FIN.size} strength={0.5} />
      <Traced paths={FIN.shapes.subject} place={place} at={t.at("But here's") + 2} dur={10} width={5} part={0.93} />
      <Note text="“you can fix your soul”" x={820} y={130} size={60} rot={-3} at={t.at('you can fix')} />
      <Note text="one step further..." x={1350} y={235} size={42} rot={-4} at={t.at('one step')} />
      <Arrow x1={1000} y1={230} x2={1010} y2={330} bow={18} at={t.at('perfect yourself') - 4} />
      <Note text="perfect yourself" x={860} y={340} size={64} rot={-2} at={t.at('perfect yourself')} />
      <Arrow x1={1030} y1={440} x2={1040} y2={540} bow={-18} at={t.at('perfect society') - 4} />
      <Note text="perfect society" x={880} y={550} size={64} rot={-3} at={t.at('perfect society')} />
      <Arrow x1={1060} y1={650} x2={1070} y2={750} bow={18} at={t.at('God expects') - 6} />
      {g >= t.at('God expects') && <Highlight text="GOD EXPECTS YOU TO." x={820} y={770} size={96} at={t.at('God expects')} seed={171} rot={-2} />}
    </AbsoluteFill>
  );
};

/** The spark. */
const Spark: React.FC<{t: TL}> = ({t}) => {
  const g = useGFrame();
  const sAt = t.at('spark');
  const fire = t.at('catching fire');
  const flare = interpolate(g, [fire, fire + 20], [0, 1.4], clamp);
  return (
    <AbsoluteFill style={{background: '#0b0a08'}}>
      <Ember x={960} y={470} at={sAt - 3} size={1.2} flare={flare} />
      {g >= sAt && <Highlight text="THE SPARK" x={700} y={700} size={110} at={sAt} seed={181} rot={-2} />}
      <Note text="remember it." x={1200} y={880} size={56} rot={-5} at={t.at('Remember')} />
    </AbsoluteFill>
  );
};

const Body: React.FC = () => {
  const frame = useCurrentFrame();
  const t = makeTimeline(N, 30);
  const at = t.at;
  const cuts: [number, React.ReactNode][] = [
    [0, <Upstate t={t} />],
    [at('Thousands') - 1, <Camp1819 t={t} from={at('Thousands')} />],
    [at('People crying') - 1, <PunchIns t={t} />],
    [at('Some') - 1, <Camp1819 t={t} from={at('Some')} days />],
    [at('This is') - 1, <Awakening t={t} />],
    [at('And its') - 1, <FinneyIntro t={t} />],
    [at('The older') - 1, <Puritans t={t} />],
    [at('Basically') - 1, <Diagram t={t} />],
    [at('And he sold') - 1, <Bench t={t} />],
    [at('The region') - 1, <District t={t} />],
    [at("But here's") - 1, <Chain t={t} />],
    [at("That's the") - 1, <Spark t={t} />],
  ];
  const scene = cuts.reduce((acc, [f, node]) => (frame >= f ? node : acc), cuts[0][1]);
  const end = Math.ceil(N.duration * 30);
  return (
    <AbsoluteFill>
      {scene}
      <Finish vignette={0.3} />
      <Audio src={staticFile('audio/ch02_burned_over.wav')} />
      <Audio src={staticFile('music/revival.mp3')} volume={(f) => interpolate(f, [0, 20, end - 20, end + 30], [0, 0.15, 0.15, 0], clamp)} />
      {cuts.slice(1).map(([f], i) => <Sfx key={i} at={f} src="sfx/whoosh.wav" volume={0.3} />)}
      {['upstate', 'People crying', 'People shouting', 'People falling', 'Second', 'Charles', 'Puritan', 'predestination', 'salvation', 'today', 'right now', 'anxious', 'part church', 'concert', 'reality', 'Burned-Over', 'God expects', 'spark'].map((c) => (
        <Sfx key={c} at={at(c)} src="sfx/stamp.wav" volume={0.28} />
      ))}
      {['Thousands', 'former', 'before', 'Nothing', 'Kind', 'choose', 'wrestling', 'nobody', 'you can fix', 'perfect yourself', 'perfect society', 'Remember'].map((c) => (
        <Sfx key={c} at={at(c) - 2} src={WRITE.src} volume={WRITE.volume} />
      ))}
      <Sfx at={at('Finney flipped')} src="sfx/page_turn.wav" volume={0.5} />
    </AbsoluteFill>
  );
};

export const Ch02: React.FC = () => (
  <PaletteCtx.Provider value={PALETTES.locked}>
    <StepCtx.Provider value={2.5}>
      <Body />
    </StepCtx.Provider>
  </PaletteCtx.Provider>
);
