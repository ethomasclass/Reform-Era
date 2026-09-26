// Chapter 10 · Not Someday. Now. Walker's Appeal, colonization, and Garrison. A heavy chapter, told in the quiet palette.
import React from 'react';
import {AbsoluteFill, Audio, Easing, Img, interpolate, Sequence, staticFile, useCurrentFrame} from 'remotion';
import words from '../../public/audio/ch10_now.words.json';
import shop from '../../public/img/jh/masks/ch10_clothing_shop.json';
import {clamp} from '../lib/anim';
import {makeTimeline, type Narration} from '../lib/timing';
import {boxOf, ColourReveal, Finish, Highlight, INK, JF, Loop, MaskData, Note, PALETTES, PaletteCtx, Picture, Place, StepCtx, Tag, Tint, Traced, useGFrame, usePal} from '../jh/Kit';
import {Card, DarkPaper, MapView, mapToScreen, Sfx, WRITE} from './common';

const N = words as Narration;
export const CH10_FRAMES = Math.ceil(N.duration * 30) + 40;
type TL = ReturnType<typeof makeTimeline>;
const SHOP = shop as unknown as MaskData;
const GEN: [number, number] = [1376, 768];
const GEN2: [number, number] = [2752, 1536];
const CREAM = '#EDE7DC';

const BOSTON = [3489, 1660];
const SAVANNAH = [2644, 3045];
const ROUTE = [BOSTON, [3560, 1690], [3690, 1730], [3660, 1840], [3450, 1940], [3380, 2080], [3330, 2230], [3230, 2420], [3260, 2690], [3080, 2900], [2880, 3010], SAVANNAH];
const PHILA = [3185, 1985];
const SOUTHAMPTON = [2945, 2440];

const fill = (size: [number, number], fx: number, fy: number, z: number): Place => {
  const sc = Math.max(1920 / size[0], 1080 / size[1]) * z;
  return {left: Math.min(0, Math.max(1920 - size[0] * sc, 960 - fx * sc)), top: Math.min(0, Math.max(1080 - size[1] * sc, 540 - fy * sc)), scale: sc};
};

const Strike: React.FC<{x: number; y: number; w: number; at: number; color?: string}> = ({x, y, w, at, color}) => {
  const g = useGFrame();
  if (g < at) return null;
  const p = interpolate(g, [at, at + 5], [0, 1], clamp);
  return (
    <svg style={{position: 'absolute', left: 0, top: 0, overflow: 'visible'}} width={1920} height={1080}>
      <path d={`M${x},${y + 6} Q${x + w / 2},${y - 8} ${x + w},${y}`} fill="none" stroke={color ?? '#FF6F61'} strokeWidth={8} strokeLinecap="round" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - p} />
    </svg>
  );
};

const Definition: React.FC<{term: string; def: string; at: number; x?: number; y?: number}> = ({term, def, at, x = 120, y = 600}) => {
  const g = useGFrame();
  if (g < at) return null;
  return (
    <div style={{position: 'absolute', left: x, top: y, maxWidth: 1300, fontFamily: JF.sans, fontWeight: 600, fontSize: 38, color: '#fff', background: 'rgba(10,10,10,0.82)', padding: '14px 24px',
      opacity: interpolate(g, [at, at + 6], [0, 1], clamp)}}>
      <span style={{color: usePal().mark}}>{term}</span> · {def}
    </div>
  );
};

/** A line of printed quotation that sets itself word by word with the voice. */
const Quote: React.FC<{t: TL; text: string; from: string; x: number; y: number; w: number; size?: number; hot?: string[]; nth?: number}> = ({t, text, from, x, y, w, size = 64, hot = [], nth = 1}) => {
  const g = useGFrame();
  const pal = usePal();
  const i0 = t.idx(from, nth);
  const toks = text.split(' ');
  return (
    <div style={{position: 'absolute', left: x, top: y, width: w, fontFamily: JF.heavy, fontSize: size, lineHeight: 1.18, color: '#f4efe6', textShadow: '0 4px 18px rgba(0,0,0,0.8)'}}>
      {toks.map((tk, j) => {
        const on = g >= t.wordAt(Math.min(i0 + j, t.words.length - 1)) - 1;
        const isHot = hot.some((h) => tk.toLowerCase().replace(/[^a-z]/g, '').startsWith(h));
        return <span key={j} style={{opacity: on ? 1 : 0.13, color: isHot && on ? pal.mark : undefined}}>{tk} </span>;
      })}
    </div>
  );
};

// ─── 1 · Back to Savannah: the pamphlet's cover comes off.
const Callback: React.FC<{t: TL}> = ({t}) => {
  const frame = useCurrentFrame();
  const g = useGFrame();
  const pal = usePal();
  const rev = t.at('slavery');
  const push = interpolate(frame, [0, t.at('First')], [1, 1.1], clamp);
  const lift = interpolate(g, [rev - 8, rev + 2], [0, 1], {...clamp, easing: Easing.in(Easing.cubic)});
  return (
    <AbsoluteFill style={{background: '#15130f'}}>
      <MapView cx={SAVANNAH[0]} cy={SAVANNAH[1]} s={1.5} rot={36} dim={0.35} />
      <AbsoluteFill style={{background: 'rgba(8,6,4,0.45)'}} />
      <div style={{position: 'absolute', left: 150, top: 110, width: 540, transform: `scale(${push}) rotate(-3deg)`, transformOrigin: '50% 40%'}}>
        <Img src={staticFile('img/prep/walker_torn.png')} style={{width: 560, filter: 'drop-shadow(0 26px 34px rgba(0,0,0,0.7))'}} />
        {lift < 0.6 && <div style={{position: 'absolute', left: 110, top: 26, width: 340, height: 66, background: INK, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: JF.display, fontSize: 46, color: boxOf(pal),
          transform: `translate(${lift * 200}px, ${-lift * 150}px) rotate(${lift * 20}deg)`, opacity: 1 - lift / 0.6}}>? ? ?</div>}
      </div>
      <Note text="that pamphlet in Savannah..." x={820} y={220} size={60} rot={-3} at={t.at('pamphlet')} />
      <Note text="the biggest reform fight of all:" x={840} y={340} size={54} rot={-3} at={t.at('biggest')} color={CREAM} />
      {g >= rev && <Highlight text="SLAVERY." x={830} y={450} size={130} at={rev} seed={1001} rot={-2} />}
    </AbsoluteFill>
  );
};

// ─── 2 · Gradual emancipation, Pennsylvania 1780.
const Gradual: React.FC<{t: TL}> = ({t}) => {
  const frame = useCurrentFrame();
  const g = useGFrame();
  const pal = usePal();
  const p0 = t.at("Pennsylvania's");
  const k = interpolate(frame, [p0 - 10, p0 + 30], [0, 1], {...clamp, easing: Easing.inOut(Easing.cubic)});
  const s = 0.42 + 0.9 * k;
  const cx = 3150 + (PHILA[0] - 250 - 3150) * k;
  const cy = 2150 + (PHILA[1] - 60 - 2150) * k;
  const toS = mapToScreen(cx, cy, s, 0);
  const [px, py] = toS(PHILA);
  const gr = t.at('gradual');
  return (
    <AbsoluteFill style={{background: '#15130f'}}>
      <MapView cx={cx} cy={cy} s={s} dim={0.3}>
        {g >= p0 && <circle cx={PHILA[0]} cy={PHILA[1]} r={14 / s} fill={pal.mark} stroke={INK} strokeWidth={4 / s} />}
      </MapView>
      <AbsoluteFill style={{background: 'radial-gradient(ellipse at 50% 50%, rgba(8,6,4,0.2) 30%, rgba(8,6,4,0.85) 100%)'}} />
      <Note text="lots of white Americans:" x={110} y={100} size={52} rot={-3} at={t.at('lots')} out={p0} />
      <Note text="“we're against slavery!”" x={130} y={180} size={66} rot={-3} at={t.at('against')} color={CREAM} out={p0} />
      <Note text="...but slowly." x={160} y={290} size={66} rot={-3} at={t.at('slowly')} out={p0} />
      {g >= gr && g < p0 && <Highlight text="GRADUAL EMANCIPATION" x={110} y={760} size={86} at={gr} seed={1003} />}
      {g >= gr && g < p0 && <Definition term="e·man·ci·pa·tion" def="setting free from slavery" at={gr + 8} x={120} y={900} />}
      {g >= p0 && <Highlight text="PENNSYLVANIA · 1780" x={100} y={90} size={76} at={p0} seed={1005} />}
      {g >= p0 && <Loop cx={px} cy={py} rx={120} ry={90} at={p0 + 6} dur={8} width={6} seed={1007} />}
      <Note text="freed that day:" x={120} y={260} size={56} rot={-3} at={t.at('single')} />
      {g >= t.at('single') + 6 && <div style={{position: 'absolute', left: 160, top: 330, fontFamily: JF.display, fontSize: 220, lineHeight: 1, color: '#FF6F61', textShadow: '0 8px 30px rgba(0,0,0,0.9)'}}>0</div>}
      <Tag text="Mitchell's Map of the United States, 1836 · Library of Congress" />
    </AbsoluteFill>
  );
};

/** Hand-ruled timeline: born 1781, free at 28 in 1809. */
const TwentyEight: React.FC<{t: TL}> = ({t}) => {
  const g = useGFrame();
  const pal = usePal();
  const a = t.at('It only');
  const b = t.at('28');
  const x0 = 260, x1 = 1660, y = 560;
  const p = interpolate(g, [t.at('turned') - 6, b + 4], [0, 1], {...clamp, easing: Easing.inOut(Easing.quad)});
  return (
    <AbsoluteFill>
      <DarkPaper />
      <Note text="it only freed children born after the law..." x={140} y={150} size={56} rot={-3} at={a} />
      <svg style={{position: 'absolute', left: 0, top: 0, overflow: 'visible'}} width={1920} height={1080}>
        <path d={`M${x0},${y} L${x1},${y + 4}`} stroke="#8d877c" strokeWidth={4} strokeDasharray="4 12" strokeLinecap="round" />
        <path d={`M${x0},${y} L${x0 + (x1 - x0) * p},${y + 4 * p}`} stroke={pal.mark} strokeWidth={9} strokeLinecap="round" />
        {g >= t.at('children') && <circle cx={x0} cy={y} r={16} fill={pal.mark} stroke={INK} strokeWidth={4} />}
        {p >= 1 && <circle cx={x1} cy={y + 4} r={16} fill="#FF6F61" stroke={INK} strokeWidth={4} />}
      </svg>
      <Note text="born 1781" x={x0 - 90} y={610} size={60} rot={-3} at={t.at('children')} />
      <Note text="free in 1809" x={x1 - 260} y={610} size={60} rot={-3} at={b} color="#FF6F61" />
      {g >= b && <Highlight text="AGE 28" x={780} y={740} size={96} at={b} seed={1009} rot={-3} />}
      <Note text="...and only once they turned" x={560} y={320} size={50} rot={-2} at={t.at('only once')} color={CREAM} />
      <Tag text="Pennsylvania's Act for the Gradual Abolition of Slavery, 1780: children born to enslaved mothers were bound to serve until age 28" />
    </AbsoluteFill>
  );
};

// ─── 3 · Colonization and Liberia.
const LMAP: [number, number] = [3000, 2168];
const Colonization: React.FC<{t: TL}> = ({t}) => {
  const frame = useCurrentFrame();
  const g = useGFrame();
  const pal = usePal();
  const c0 = t.at('Others');
  const lib = t.at('Liberia');
  const hate = t.at('hated');
  const place = fill(LMAP, 1500, 1000, interpolate(frame, [c0, lib, lib + 30], [1.0, 1.05, 1.35], {...clamp, easing: Easing.inOut(Easing.cubic)}));
  const dim = interpolate(g, [hate - 4, hate + 6], [0, 0.72], clamp);
  return (
    <AbsoluteFill style={{background: INK, overflow: 'hidden'}}>
      <Picture src="img/ch10/liberia_map.jpg" place={place} size={LMAP} bw="grayscale(1) sepia(0.3) contrast(1.15) brightness(0.9)" />
      <AbsoluteFill style={{background: `rgba(8,6,4,${0.25 + dim})`}} />
      {g >= t.at('colonization') && <Highlight text="COLONIZATION" x={100} y={90} size={90} at={t.at('colonization')} seed={1011} />}
      <Note text="free enslaved people..." x={110} y={230} size={56} rot={-3} at={t.at('free enslaved')} out={hate} />
      <Note text="...then ship them to Africa." x={150} y={310} size={56} rot={-3} at={t.at('ship')} out={hate} />
      <Note text="American Colonization Society (1816)" x={110} y={420} size={50} rot={-2} at={t.at('American')} color={CREAM} out={hate} />
      {g >= lib && g < hate && <Loop cx={place.left + 1700 * place.scale} cy={place.top + 1250 * place.scale} rx={380} ry={150} tilt={32} at={lib + 12} dur={10} width={6} seed={1013} />}
      <Note text="presidents supported it" x={110} y={880} size={56} rot={-3} at={t.at('Presidents')} out={hate} />
      <Note text="(Liberia's capital, Monrovia, is named for President Monroe)" x={120} y={960} size={40} rot={-1} at={t.at('Presidents') + 12} color={CREAM} out={hate} />
      <Note text="most free Black Americans hated it." x={140} y={330} size={66} rot={-3} at={hate} />
      <Note text="their families had lived here for generations." x={160} y={450} size={54} rot={-2} at={t.at('families')} color={CREAM} />
      {g >= t.at('This was') && <Highlight text="THIS WAS THEIR COUNTRY." x={140} y={590} size={100} at={t.at('This was')} seed={1015} rot={-2} />}
      <Tag text="Map of Liberia, compiled for the American Colonization Society, 1850 · Library of Congress" />
    </AbsoluteFill>
  );
};

// ─── 4 · David Walker's shop, and the Appeal.
const Walker: React.FC<{t: TL}> = ({t}) => {
  const frame = useCurrentFrame();
  const g = useGFrame();
  const w0 = t.at("And that's where");
  const ap = t.at('In 1829');
  const place = fill(GEN, 900, 520, interpolate(frame, [w0, ap], [1.02, 1.16], clamp));
  if (frame < ap - 1) {
    return (
      <AbsoluteFill style={{background: INK, overflow: 'hidden'}}>
        <Picture src="img/gen/ch10_clothing_shop.jpg" place={place} size={GEN} bw="grayscale(1) contrast(1.15) brightness(0.85)" />
        <ColourReveal src="img/gen/ch10_clothing_shop.jpg" place={place} size={GEN} from={0.62} to={0.95} filter="brightness(0.85)" />
        <Tint mask="img/jh/masks/ch10_clothing_shop_magenta_a.png" place={place} size={GEN} color="#2FE0C4" strength={0.55} />
        <Traced paths={SHOP.shapes.magenta} place={place} at={t.at('used-clothing')} dur={9} width={5} />
        {g >= t.at('David') && <Highlight text="DAVID WALKER" x={100} y={90} size={96} at={t.at('David')} seed={1017} />}
        <Note text="a free Black man" x={110} y={240} size={60} rot={-3} at={t.at('free Black man')} />
        <Note text="ran a used-clothing shop near the Boston docks" x={110} y={900} size={52} rot={-2} at={t.at('used-clothing')} />
        <Tag text="Illustration · a secondhand clothing shop near the Boston waterfront, late 1820s · no portrait of Walker survives" />
      </AbsoluteFill>
    );
  }
  const now = t.at('but now');
  return (
    <AbsoluteFill>
      <DarkPaper />
      <Card src="img/test/walker_p1.jpg" x={1240} y={90} w={560} rot={3} at={ap - 1} filter="sepia(0.2) contrast(1.1)" />
      {g >= t.at('Appeal') && <Highlight text="WALKER'S APPEAL · 1829" x={100} y={90} size={76} at={t.at('Appeal')} seed={1019} />}
      <Note text="slavery had to end:" x={110} y={240} size={56} rot={-3} at={t.at('It said')} />
      <Note text="not someday..." x={140} y={330} size={66} rot={-3} at={t.at('someday')} color={CREAM} />
      {g >= now && <Highlight text="BUT NOW." x={660} y={310} size={96} at={now} seed={1021} rot={-3} />}
      <Note text="called out white Christians" x={110} y={520} size={54} rot={-2} at={t.at('Christians') - 3} />
      <Note text="+ Thomas Jefferson himself" x={140} y={600} size={54} rot={-2} at={t.at('Jefferson')} />
      <Note text="for their hypocrisy" x={170} y={680} size={54} rot={-2} at={t.at('hypocrisy')} color={CREAM} />
      <Note text="enslaved people had every right to resist." x={110} y={830} size={58} rot={-3} at={t.at('every right')} color="#FF6F61" />
      <Tag text="Walker's Appeal, in Four Articles, Boston, 1829 · Internet Archive" />
    </AbsoluteFill>
  );
};

const WalkerQuote: React.FC<{t: TL}> = ({t}) => (
  <AbsoluteFill>
    <DarkPaper />
    <Img src={staticFile('img/test/walker_p1.jpg')} style={{position: 'absolute', left: 1320, top: 120, width: 520, opacity: 0.18, transform: 'rotate(4deg)', filter: 'grayscale(1)'}} />
    <div style={{position: 'absolute', left: 150, top: 130, fontFamily: JF.display, fontSize: 200, color: usePal().mark, lineHeight: 1}}>“</div>
    <Quote t={t} from="America" text="America is more our country, than it is the whites, we have enriched it with our blood and tears." x={240} y={240} w={1350} size={84} hot={['more', 'our', 'country', 'blood', 'tears']} />
    <Note text="— David Walker, 1829" x={1100} y={800} size={54} rot={-3} at={t.at('blood')} />
  </AbsoluteFill>
);

// ─── 5 · Sewn into coats, carried south.
const Coats: React.FC<{t: TL}> = ({t}) => {
  const frame = useCurrentFrame();
  const g = useGFrame();
  const pal = usePal();
  const r0 = t.at('sailors');
  if (frame < r0 - 1) {
    const place = fill(GEN2, 1200, 850, interpolate(frame, [t.at('Then he got'), r0], [1.05, 1.2], clamp));
    return (
      <AbsoluteFill style={{background: INK, overflow: 'hidden'}}>
        <Picture src="img/gen/coat_lining.jpg" place={place} size={GEN2} bw="grayscale(1) contrast(1.15) brightness(0.9)" />
        <ColourReveal src="img/gen/coat_lining.jpg" place={place} size={GEN2} from={0.25} to={0.7} />
        <Note text="then he got creative." x={110} y={110} size={62} rot={-3} at={t.at('creative')} />
        <Note text="copies sewn into coat linings" x={110} y={210} size={56} rot={-3} at={t.at('sewed')} color={CREAM} />
        <Loop cx={place.left + 1120 * place.scale} cy={place.top + 930 * place.scale} rx={250} ry={150} tilt={-8} at={t.at('linings')} dur={9} width={6} seed={1023} />
        <Tag text="Illustration · a pamphlet hidden in the lining of a sailor's coat" />
      </AbsoluteFill>
    );
  }
  const k = interpolate(frame, [r0, r0 + 50], [0, 1], {...clamp, easing: Easing.inOut(Easing.cubic)});
  const routeD = 'M' + ROUTE.map(([x, y]) => `${x},${y}`).join(' L');
  const s = 0.42;
  const six = t.at('sixty');
  return (
    <AbsoluteFill style={{background: '#15130f'}}>
      <MapView cx={2660} cy={2350} s={s} dim={0.2}>
        <path d={routeD} fill="none" stroke={pal.mark} strokeWidth={12 / s} strokeLinejoin="round" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - k} />
        <circle cx={BOSTON[0]} cy={BOSTON[1]} r={14 / s} fill={pal.mark} stroke={INK} strokeWidth={4 / s} />
        {k >= 1 && <circle cx={SAVANNAH[0]} cy={SAVANNAH[1]} r={18 / s} fill="#FF6F61" stroke={INK} strokeWidth={5 / s} />}
      </MapView>
      <AbsoluteFill style={{background: 'radial-gradient(ellipse at 50% 50%, transparent 40%, rgba(8,6,4,0.8) 100%)'}} />
      <Note text="sold to sailors heading south" x={110} y={110} size={56} rot={-3} at={r0} />
      <Note text="Boston" x={1350} y={170} size={50} rot={-3} at={r0 + 4} />
      {g >= six && <Highlight text="60 COPIES → SAVANNAH" x={60} y={800} size={70} at={six} seed={1025} rot={-2} />}
      {g >= t.at('panicked') && <Highlight text="THE SOUTH PANICKED." x={60} y={910} size={64} at={t.at('panicked')} seed={1027} rot={-2} />}
      <Tag text="Mitchell's Map of the United States, 1836 · Library of Congress" y={40} />
    </AbsoluteFill>
  );
};

// ─── 6 · Laws, a bounty, and a death in Boston.
const Bounty: React.FC<{t: TL}> = ({t}) => {
  const g = useGFrame();
  const d0 = t.at('In 1830');
  const Big: React.FC<{amt: string; word: string; cue: string; x: number; y: number; color: string}> = ({amt, word, cue, x, y, color}) =>
    g >= t.at(cue) ? (
      <div style={{position: 'absolute', left: x, top: y, fontFamily: JF.display, lineHeight: 1, color, textShadow: '0 8px 30px rgba(0,0,0,0.9)', transform: `scale(${interpolate(g, [t.at(cue), t.at(cue) + 4], [1.25, 1], clamp)})`, transformOrigin: 'left center'}}>
        <span style={{fontSize: 170}}>{amt}</span> <span style={{fontFamily: JF.heavy, fontSize: 80, letterSpacing: 4}}>{word}</span>
      </div>
    ) : null;
  return (
    <AbsoluteFill>
      <DarkPaper />
      <Img src={staticFile('img/prep/walker_torn.png')} style={{position: 'absolute', left: 1330, top: 140, width: 470, transform: 'rotate(4deg)', filter: `grayscale(1) brightness(${g >= d0 ? 0.35 : 0.8}) drop-shadow(0 20px 30px rgba(0,0,0,0.7))`}} />
      <Note text="Georgia: new laws against spreading anti-slavery writing" x={100} y={100} size={50} rot={-2} at={t.at('Georgia passed')} out={d0} />
      <Note text="rumors of a bounty on Walker:" x={110} y={200} size={56} rot={-3} at={t.at('bounty')} out={d0} />
      {g < d0 && <Big amt="$10,000" word="ALIVE" cue="$10,000" x={120} y={330} color={CREAM} />}
      {g < d0 && <Big amt="$1,000" word="DEAD" cue="$1,000" x={120} y={560} color="#FF6F61" />}
      {g >= d0 && <Highlight text="1830" x={110} y={120} size={100} at={d0} seed={1029} />}
      <Note text="Walker was found dead in Boston." x={120} y={300} size={62} rot={-3} at={t.at('found dead')} />
      <Note text="most likely tuberculosis..." x={140} y={420} size={58} rot={-3} at={t.at('tuberculosis') - 3} color={CREAM} />
      <Note text="...but plenty of people never believed that." x={160} y={520} size={58} rot={-3} at={t.at('plenty')} />
      <Tag text="Reward figures as reported by rumor at the time; no official bounty has been found" />
    </AbsoluteFill>
  );
};

// ─── 7 · Garrison changes his mind.
const Garrison: React.FC<{t: TL}> = ({t}) => {
  const g = useGFrame();
  const change = t.at('completely');
  return (
    <AbsoluteFill>
      <DarkPaper />
      <Card src="img/ch10/garrison_1835.jpg" x={1260} y={100} w={520} rot={3} at={t.at('influenced') - 2} filter="grayscale(1) contrast(1.1)" />
      <Note text="one of the people Walker influenced:" x={110} y={100} size={50} rot={-3} at={t.at('influenced')} />
      {g >= t.at('William') && <Highlight text="WILLIAM LLOYD GARRISON" x={100} y={180} size={80} at={t.at('William')} seed={1031} />}
      <Note text="a young white printer" x={120} y={320} size={56} rot={-3} at={t.at('printer')} color={CREAM} />
      <Note text="started out supporting..." x={120} y={450} size={52} rot={-3} at={t.at('started')} />
      <Note text="gradual emancipation" x={160} y={530} size={58} rot={-3} at={t.at('gradual', 2)} />
      <Note text="colonization" x={200} y={600} size={58} rot={-3} at={t.at('colonization', 3)} />
      <Strike x={150} y={580} w={580} at={change} />
      <Strike x={190} y={650} w={330} at={change + 3} />
      <Note text="7 weeks in a Baltimore jail" x={120} y={710} size={56} rot={-2} at={t.at('seven weeks')} />
      <Note text="(for calling out a slave-trading shipowner)" x={140} y={790} size={42} rot={-1} at={t.at('shipowner')} color={CREAM} />
      <Note text="listened to Black abolitionists · read Walker" x={120} y={860} size={52} rot={-2} at={t.at('listened')} />
      {g >= change && <Highlight text="CHANGED HIS MIND." x={1080} y={925} size={64} at={change} seed={1033} rot={-3} />}
      <Tag text="William Lloyd Garrison, engraving, 1835 · Library of Congress" y={1030} />
    </AbsoluteFill>
  );
};

// ─── 8 · The Liberator.
const LIB: [number, number] = [1920, 2773];
const Liberator: React.FC<{t: TL}> = ({t}) => {
  const frame = useCurrentFrame();
  const g = useGFrame();
  const j0 = t.at('January');
  const pg = t.at('page one');
  const earn = t.at('I am');
  const k1 = interpolate(frame, [j0, j0 + 20], [0, 1], {...clamp, easing: Easing.inOut(Easing.cubic)});
  const k2 = interpolate(frame, [pg - 4, pg + 24], [0, 1], {...clamp, easing: Easing.inOut(Easing.cubic)});
  // Camera: whole page → masthead → the "To the Public" column.
  const sc = 0.38 + 0.62 * k1 + 0.35 * k2;
  const fx = 960 + (960 - 960) * k1 + (330 - 960) * k2;
  const fy = 1400 + (140 - 1400) * k1 + (1640 - 140) * k2;
  const left = 960 - fx * sc;
  const top = 540 - fy * sc;
  const dim = interpolate(frame, [t.at('asking') - 6, t.at('asking') + 4], [0, 0.72], clamp);
  if (frame >= earn - 1) return null;
  return (
    <AbsoluteFill style={{background: '#15130f', overflow: 'hidden'}}>
      <Img src={staticFile('img/ch10/liberator_p1.jpg')} style={{position: 'absolute', left, top, width: LIB[0] * sc, filter: 'grayscale(1) sepia(0.2) contrast(1.15)', boxShadow: '0 30px 80px rgba(0,0,0,0.8)'}} />
      <AbsoluteFill style={{background: `rgba(8,6,4,${dim})`}} />
      {g >= j0 && g < pg && <Highlight text="JANUARY 1, 1831" x={100} y={780} size={90} at={j0} seed={1035} rot={-2} />}
      <Note text="a newspaper in Boston" x={110} y={920} size={56} rot={-3} at={t.at('newspaper')} out={pg} />
      {g >= pg && g < t.at('asking') && <Highlight text="PAGE ONE: AT THE GRADUALISTS" x={100} y={90} size={70} at={pg} seed={1049} />}
      {frame >= t.at('asking') - 2 && (
        <Quote t={t} from="a man whose" text="“a man whose house is on fire, to give a moderate alarm.”" x={170} y={380} w={1500} size={96} hot={['fire', 'moderate', 'alarm']} />
      )}
      <Note text="asking him to be moderate about slavery was like telling..." x={170} y={250} size={48} rot={-2} at={t.at('asking')} />
      <Tag text="The Liberator, vol. 1, no. 1, Boston, January 1, 1831" />
    </AbsoluteFill>
  );
};

const Heard: React.FC<{t: TL}> = ({t}) => {
  const g = useGFrame();
  const pal = usePal();
  const h = t.at('heard');
  const lines: [string, string][] = [['I am in earnest.', 'I am'], ['I will not equivocate.', 'equivocate'], ['I will not excuse.', 'excuse'], ['I will not retreat a single inch.', 'retreat']];
  return (
    <AbsoluteFill>
      <DarkPaper />
      <Img src={staticFile('img/ch10/liberator_p1.jpg')} style={{position: 'absolute', left: 1360, top: 90, width: 480, opacity: 0.2, transform: 'rotate(3deg)', filter: 'grayscale(1)'}} />
      {lines.map(([l, cue], i) => (
        <div key={l} style={{position: 'absolute', left: 160, top: 120 + i * 130, fontFamily: JF.heavy, fontSize: 88, color: '#f4efe6', opacity: interpolate(g, [t.at(cue) - 3, t.at(cue) + 2], [0, 1], clamp) * (g >= h ? 0.45 : 1), textShadow: '0 4px 18px rgba(0,0,0,0.8)'}}>{l}</div>
      ))}
      {g >= h - 3 && <Highlight text="AND I WILL BE HEARD." x={150} y={680} size={120} at={h - 3} seed={1037} rot={-2} />}
      <Note text="— Garrison, The Liberator, 1831" x={1050} y={880} size={50} rot={-3} at={h + 6} color={pal.mark} />
    </AbsoluteFill>
  );
};

const Immediate: React.FC<{t: TL}> = ({t}) => {
  const g = useGFrame();
  const im = t.at('immediate');
  const items: [string, string, number][] = [['no waiting', 'No waiting', 380], ['no paying slaveholders', 'No paying', 500], ['no shipping anyone to Africa', 'No shipping', 620]];
  return (
    <AbsoluteFill>
      <DarkPaper />
      <Card src="img/ch10/garrison_1835.jpg" x={1360} y={130} w={420} rot={3} at={-99} filter="grayscale(1) contrast(1.1)" />
      {g >= im && <Highlight text="IMMEDIATE EMANCIPATION" x={100} y={130} size={90} at={im} seed={1039} />}
      {items.map(([l, cue, y]) => <Note key={l} text={l} x={150} y={y} size={64} rot={-3} at={t.at(cue)} />)}
      <Note text="early on, most paying subscribers: free Black Americans" x={110} y={840} size={50} rot={-2} at={t.at('subscribers') - 4} color={CREAM} />
      <Tag text="William Lloyd Garrison, engraving, 1835 · Library of Congress" y={1030} />
    </AbsoluteFill>
  );
};

// ─── 9 · Nat Turner, and Georgia's reward.
const Turner: React.FC<{t: TL}> = ({t}) => {
  const frame = useCurrentFrame();
  const g = useGFrame();
  const pal = usePal();
  const n0 = t.at('Seven months');
  const ga = t.at('That November');
  const k = interpolate(frame, [n0, n0 + 36], [0, 1], {...clamp, easing: Easing.inOut(Easing.cubic)});
  const s = 0.32 + 0.9 * k;
  const cx = 3100 + (SOUTHAMPTON[0] + 150 - 3100) * k;
  const cy = 2200 + (SOUTHAMPTON[1] - 60 - 2200) * k;
  const toS = mapToScreen(cx, cy, s, 0);
  const [sx, sy] = toS(SOUTHAMPTON);
  if (frame >= ga - 1) {
    return (
      <AbsoluteFill>
        <DarkPaper />
        <Card src="img/ch10/garrison_1835.jpg" x={1360} y={130} w={420} rot={3} at={-99} filter="grayscale(1) contrast(1.1) brightness(0.8)" />
        <Note text="that November, the Georgia legislature offered" x={110} y={150} size={52} rot={-2} at={ga} />
        <div style={{position: 'absolute', left: 130, top: 260, fontFamily: JF.display, fontSize: 240, lineHeight: 1, color: '#FF6F61', opacity: g >= t.at('$5,000') ? 1 : 0, textShadow: '0 8px 30px rgba(0,0,0,0.9)'}}>$5,000</div>
        <Note text="to anyone who would arrest Garrison" x={130} y={560} size={56} rot={-3} at={t.at('arrest')} />
        <Note text="and bring him to Georgia for trial." x={150} y={650} size={56} rot={-3} at={t.at('bring')} color={CREAM} />
        <Tag text="Georgia General Assembly resolution, December 1831" y={1030} />
      </AbsoluteFill>
    );
  }
  return (
    <AbsoluteFill style={{background: '#15130f'}}>
      <MapView cx={cx} cy={cy} s={s} dim={0.3}>
        {k > 0.6 && <circle cx={SOUTHAMPTON[0]} cy={SOUTHAMPTON[1]} r={14 / s} fill="#FF6F61" stroke={INK} strokeWidth={4 / s} />}
      </MapView>
      <AbsoluteFill style={{background: 'radial-gradient(ellipse at 50% 50%, rgba(8,6,4,0.15) 30%, rgba(8,6,4,0.85) 100%)'}} />
      <Card src="img/ch10/turner_confessions.jpg" x={1390} y={120} w={390} rot={3} at={t.at('Nat') + 4} filter="grayscale(1) contrast(1.2)" />
      <Note text="seven months later..." x={110} y={100} size={56} rot={-3} at={n0} />
      {g >= t.at('Nat') && <Highlight text="NAT TURNER · 1831" x={100} y={180} size={80} at={t.at('Nat')} seed={1041} />}
      <Note text="led a rebellion of enslaved people" x={110} y={320} size={54} rot={-3} at={t.at('bloody')} color={CREAM} />
      {k > 0.6 && <Note text="Southampton County, Virginia" x={sx - 380} y={sy + 40} size={46} rot={-3} at={t.at('Virginia')} />}
      {g >= t.at('blamed') && <Highlight text="WHITE SOUTHERNERS BLAMED GARRISON." x={100} y={880} size={68} at={t.at('blamed')} seed={1043} rot={-2} />}
      <Tag text="Mitchell's Map, 1836 · The Confessions of Nat Turner, Thomas R. Gray, 1832 · Library of Congress" y={40} />
    </AbsoluteFill>
  );
};

// ─── 10 · The North didn't love him either.
const Mob: React.FC<{t: TL}> = ({t}) => {
  const frame = useCurrentFrame();
  const g = useGFrame();
  const m0 = t.at('In 1835');
  const push = interpolate(frame, [t.at('And the North'), t.at('Years later')], [1, 1.08], clamp);
  return (
    <AbsoluteFill>
      <DarkPaper />
      <div style={{position: 'absolute', left: 1180, top: 80, transform: `scale(${push}) rotate(2deg)`, transformOrigin: '50% 40%'}}>
        <Img src={staticFile('img/ch10/garrison_1835.jpg')} style={{width: 600, filter: 'grayscale(1) contrast(1.15) brightness(0.8)', boxShadow: '0 30px 60px rgba(0,0,0,0.8)', border: '10px solid #efe9dd'}} />
      </div>
      <Note text="and the North didn't love him either." x={110} y={110} size={56} rot={-3} at={t.at('And the North')} />
      {g >= m0 && <Highlight text="BOSTON · 1835" x={100} y={230} size={84} at={m0} seed={1045} />}
      <Note text="a mob dragged him through the streets" x={110} y={380} size={56} rot={-3} at={t.at('mob')} />
      <Note text="with a rope." x={140} y={470} size={70} rot={-3} at={t.at('rope')} color="#FF6F61" />
      <Note text="the mayor locked him in jail..." x={110} y={620} size={56} rot={-3} at={t.at('mayor')} />
      <Note text="...just to keep him alive." x={150} y={710} size={62} rot={-3} at={t.at('keep him')} color={CREAM} />
      <Tag text="William Lloyd Garrison, engraving, 1835 · Library of Congress" y={1030} />
    </AbsoluteFill>
  );
};

const Burning: React.FC<{t: TL}> = ({t}) => {
  const frame = useCurrentFrame();
  const g = useGFrame();
  const b0 = t.at('Years later');
  const ex = t.at('Most Americans');
  const place = fill(GEN, 760, 300, interpolate(frame, [b0, ex], [1.02, 1.22], clamp));
  const dim = interpolate(g, [ex - 4, ex + 6], [0, 0.7], clamp);
  return (
    <AbsoluteFill style={{background: INK, overflow: 'hidden'}}>
      <Picture src="img/gen/ch10_burning.jpg" place={place} size={GEN} bw="grayscale(1) contrast(1.15) brightness(0.85)" />
      <ColourReveal src="img/gen/ch10_burning.jpg" place={place} size={GEN} from={0.35} to={0.62} />
      <AbsoluteFill style={{background: `rgba(8,6,4,${0.2 + dim})`}} />
      <Note text="years later, he publicly burned a copy of the Constitution" x={100} y={90} size={50} rot={-2} at={t.at('burned') - 3} out={ex} />
      {g < ex && <Quote t={t} from="a covenant" text="“a covenant with death, and an agreement with hell”" x={110} y={640} w={1500} size={84} hot={['death', 'hell']} />}
      <Note text="...because it protected slavery." x={120} y={900} size={54} rot={-3} at={t.at('protected')} out={ex} color={CREAM} />
      <Note text="most Americans, North and South:" x={110} y={260} size={58} rot={-3} at={ex} />
      {g >= t.at('extremist') && <Highlight text="“A DANGEROUS EXTREMIST.”" x={100} y={370} size={96} at={t.at('extremist') - 2} seed={1047} rot={-2} />}
      <Note text="but he never backed down." x={140} y={600} size={72} rot={-3} at={t.at('never backed')} />
      <Tag text="Illustration · Garrison burns the Constitution at Framingham, Massachusetts, July 4, 1854" />
    </AbsoluteFill>
  );
};

const Body: React.FC = () => {
  const frame = useCurrentFrame();
  const t = makeTimeline(N, 30);
  const at = t.at;
  const cuts: [number, React.ReactNode][] = [
    [0, <Callback t={t} />],
    [at('First') - 1, <Gradual t={t} />],
    [at('It only') - 1, <TwentyEight t={t} />],
    [at('Others') - 1, <Colonization t={t} />],
    [at("And that's where") - 1, <Walker t={t} />],
    [at('He wrote') - 1, <WalkerQuote t={t} />],
    [at('Then he got') - 1, <Coats t={t} />],
    [at('Georgia passed') - 1, <Bounty t={t} />],
    [at('And one') - 1, <Garrison t={t} />],
    [at('On January') - 1, <Liberator t={t} />],
    [at('I am') - 1, <Heard t={t} />],
    [at('Garrison demanded') - 1, <Immediate t={t} />],
    [at('Seven months') - 1, <Turner t={t} />],
    [at('And the North') - 1, <Mob t={t} />],
    [at('Years later') - 1, <Burning t={t} />],
  ];
  const scene = cuts.reduce((acc, [f, node]) => (frame >= f ? node : acc), cuts[0][1]);
  const end = Math.ceil(N.duration * 30);
  const mid = at('And one') - 1;
  return (
    <AbsoluteFill>
      {scene}
      <Finish vignette={0.35} />
      <Audio src={staticFile('audio/ch10_now.wav')} />
      <Audio src={staticFile('music/abolition_a.mp3')} volume={(f) => interpolate(f, [0, 20, mid - 30, mid + 10], [0, 0.14, 0.14, 0], clamp)} />
      <Sequence from={mid - 30}>
        <Audio src={staticFile('music/abolition_b.mp3')} volume={(f) => interpolate(f, [0, 40, end - mid - 10, end - mid + 40], [0, 0.14, 0.14, 0], clamp)} />
      </Sequence>
      {cuts.slice(1).map(([f], i) => <Sfx key={i} at={f} src="sfx/whoosh.wav" volume={0.24} />)}
      {['slavery', 'gradual', "Pennsylvania's", 'colonization', 'This was', 'David', 'Appeal', 'but now', 'sixty', 'In 1830', 'William', 'completely', 'January', 'immediate', 'Nat', 'In 1835', 'extremist'].map((c) => (
        <Sfx key={c} at={at(c)} src="sfx/stamp.wav" volume={0.22} />
      ))}
      <Sfx at={at('heard') - 3} src="sfx/stamp.wav" volume={0.34} />
      {['pamphlet', 'lots', 'slowly', 'single', 'children', 'free enslaved', 'Presidents', 'hated', 'free Black man', 'It said', 'Christians', 'every right', 'creative', 'sailors', 'bounty', 'found dead', 'plenty', 'printer', 'started', 'seven weeks', 'listened', 'newspaper', 'No waiting', 'No paying', 'No shipping', 'subscribers', 'bloody', 'arrest', 'mob', 'mayor', 'burned', 'never backed'].map((c) => (
        <Sfx key={c} at={at(c) - 2} src={WRITE.src} volume={WRITE.volume} />
      ))}
    </AbsoluteFill>
  );
};

export const Ch10: React.FC = () => (
  <PaletteCtx.Provider value={PALETTES.quiet}>
    <StepCtx.Provider value={2.5}>
      <Body />
    </StepCtx.Provider>
  </PaletteCtx.Provider>
);
