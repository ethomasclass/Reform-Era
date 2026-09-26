// Chapter 4 · I Know Nothing
import React from 'react';
import {AbsoluteFill, Audio, Easing, Img, interpolate, staticFile, useCurrentFrame} from 'remotion';
import words from '../../public/audio/ch04_know_nothing.words.json';
import {clamp} from '../lib/anim';
import {makeTimeline, type Narration} from '../lib/timing';
import {Arrow, boxOf, Finish, Highlight, INK, JF, Loop, Note, PALETTES, PaletteCtx, StepCtx, Tag, useGFrame, useHand, usePal} from '../jh/Kit';
import {Card, DarkPaper, Sfx, WRITE} from './common';

const N = words as Narration;
export const CH04_FRAMES = Math.ceil(N.duration * 30) + 30;
type TL = ReturnType<typeof makeTimeline>;

// Zimmermann's 1853 emigrant map (1364 x 1024 px).
const EMAP = {w: 1364, h: 1024};
const IRELAND = [966, 172];
const GERMANY = [1250, 190];
const NEW_YORK = [557, 545];
const BOSTON = [640, 498];
const PENN = [470, 565];
const OHIO = [350, 560];

const toS = (cx: number, cy: number, s: number) => ([x, y]: number[]) => [960 + (x - cx) * s, 540 + (y - cy) * s];

const EmapView: React.FC<{cx: number; cy: number; s: number; dim?: number; children?: React.ReactNode}> = ({cx, cy, s, dim = 0, children}) => (
  <div style={{position: 'absolute', left: 960 - cx * s, top: 540 - cy * s, width: EMAP.w * s, height: EMAP.h * s}}>
    <Img src={staticFile('img/ch04/emigrant_map.jpg')} style={{width: '100%', height: '100%', filter: `grayscale(1) sepia(0.25) contrast(1.15) brightness(${0.85 - dim})`, boxShadow: '0 30px 80px rgba(0,0,0,0.8)'}} />
    <svg style={{position: 'absolute', left: 0, top: 0, overflow: 'visible'}} width={EMAP.w * s} height={EMAP.h * s} viewBox={`0 0 ${EMAP.w} ${EMAP.h}`}>{children}</svg>
  </div>
);

/** A curved route drawn on in map pixels. */
const Route: React.FC<{a: number[]; b: number[]; at: number; dur?: number; bow?: number; color?: string; width?: number; dashed?: boolean}> = ({a, b, at, dur = 18, bow = 0.25, color, width = 6, dashed}) => {
  const g = useGFrame();
  const pal = usePal();
  if (g < at) return null;
  const p = interpolate(g, [at, at + dur], [0, 1], {...clamp, easing: Easing.inOut(Easing.quad)});
  const mx = (a[0] + b[0]) / 2 - (b[1] - a[1]) * bow;
  const my = (a[1] + b[1]) / 2 + (b[0] - a[0]) * bow;
  return (
    <path d={`M${a[0]},${a[1]} Q${mx},${my} ${b[0]},${b[1]}`} fill="none" stroke={color ?? pal.mark} strokeWidth={width} strokeLinecap="round"
      pathLength={1} strokeDasharray={dashed ? undefined : 1} strokeDashoffset={dashed ? undefined : 1 - p} opacity={dashed ? p : 1} />
  );
};

const Pin: React.FC<{p: number[]; at: number; label?: string; dx?: number; dy?: number; size?: number}> = ({p, at, label, dx = 18, dy = -50, size = 46}) => {
  const g = useGFrame();
  const pal = usePal();
  const hand = useHand();
  if (g < at) return null;
  const k = interpolate(g, [at, at + 3, at + 6], [0, 1.35, 1], clamp);
  return (
    <>
      <div style={{position: 'absolute', left: p[0] - 13, top: p[1] - 13, width: 26, height: 26, borderRadius: '50%', background: pal.mark, border: `4px solid ${INK}`, transform: `scale(${k})`}} />
      {label && <div style={{position: 'absolute', left: p[0] + dx, top: p[1] + dy, fontFamily: hand.family, fontSize: size * hand.scale, color: pal.mark, whiteSpace: 'nowrap',
        textShadow: '0 0 2px #111, 0 0 4px #111, 2px 2px 0 #111, -2px -2px 0 #111'}}>{label}</div>}
    </>
  );
};

const Strike: React.FC<{x: number; y: number; w: number; at: number; width?: number}> = ({x, y, w, at, width = 12}) => {
  const g = useGFrame();
  const pal = usePal();
  if (g < at) return null;
  const p = interpolate(g, [at, at + 5], [0, 1], clamp);
  return (
    <svg style={{position: 'absolute', left: 0, top: 0, overflow: 'visible'}} width={1920} height={1080}>
      <path d={`M${x},${y + 8} Q${x + w / 2},${y - 10} ${x + w},${y}`} fill="none" stroke={boxOf(pal)} strokeWidth={width} strokeLinecap="round" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - p} />
    </svg>
  );
};

const Stamp: React.FC<{text: string; x: number; y: number; at: number; rot?: number; size?: number}> = ({text, x, y, at, rot = -12, size = 150}) => {
  const g = useGFrame();
  const pal = usePal();
  if (g < at) return null;
  const k = interpolate(g, [at, at + 3, at + 6], [1.6, 0.94, 1], clamp);
  return (
    <div style={{position: 'absolute', left: x, top: y, transform: `rotate(${rot}deg) scale(${k})`, border: `10px solid ${pal.subject}`, padding: '4px 28px', borderRadius: 12,
      fontFamily: JF.display, fontSize: size, lineHeight: 1, color: pal.subject, letterSpacing: 6, background: 'rgba(12,10,8,0.82)', boxShadow: '0 10px 30px rgba(0,0,0,0.6)'}}>{text}</div>
  );
};

const Definition: React.FC<{term: string; def: string; at: number; x?: number; y?: number}> = ({term, def, at, x = 330, y = 600}) => {
  const g = useGFrame();
  if (g < at) return null;
  return (
    <div style={{position: 'absolute', left: x, top: y, maxWidth: 1260, fontFamily: JF.sans, fontWeight: 600, fontSize: 40, color: '#fff', background: 'rgba(10,10,10,0.8)', padding: '16px 26px',
      opacity: interpolate(g, [at, at + 6], [0, 1], clamp)}}>
      <span style={{color: usePal().mark}}>{term}</span> · {def}
    </div>
  );
};

/** 1815–1860: five million, from two places. */
const Arrivals: React.FC<{t: TL}> = ({t}) => {
  const frame = useCurrentFrame();
  const g = useGFrame();
  const pal = usePal();
  const s = interpolate(frame, [0, t.at('The Germans')], [1.3, 1.42], clamp);
  const cx = 800;
  const cy = 390;
  const S = toS(cx, cy, s);
  const c0 = t.at('five');
  const count = Math.round(interpolate(g, [c0, c0 + 20], [0, 5], clamp) * 1000000);
  return (
    <AbsoluteFill style={{background: '#15130f'}}>
      <EmapView cx={cx} cy={cy} s={s}>
        {g >= t.at('poured') && [0, 1, 2, 3, 4].map((i) => (
          <Route key={i} a={[900 + i * 60, 160 + i * 12]} b={[560 + i * 18, 520 - i * 10]} at={t.at('poured') + i * 3} bow={0.18} width={4} />
        ))}
      </EmapView>
      <AbsoluteFill style={{background: 'radial-gradient(ellipse at 50% 50%, transparent 45%, rgba(8,6,4,0.8) 100%)'}} />
      {g >= t.at('1815') && <Highlight text="1815 – 1860" x={100} y={90} size={84} at={t.at('1815')} seed={301} />}
      {g >= c0 && (
        <div style={{position: 'absolute', left: 110, top: 220, fontFamily: JF.display, fontSize: 120, lineHeight: 1, color: '#f4efe6', textShadow: '0 6px 22px rgba(0,0,0,0.85)'}}>
          {count.toLocaleString('en-US')}
        </div>
      )}
      <Note text="immigrants" x={130} y={360} size={62} rot={-3} at={t.at('immigrants')} />
      <Pin p={S(IRELAND)} at={t.at('Ireland')} label="Ireland" dx={-150} dy={-60} size={50} />
      <Pin p={S(GERMANY)} at={t.at('Germany')} label="Germany" dx={-40} dy={30} size={50} />
      <Tag text="Auswanderer-Karte nach Nordamerika (Emigrant's map and guide), Stuttgart, 1853 · Library of Congress" />
    </AbsoluteFill>
  );
};

/** Germans to the farms; Irish with nothing. */
const Paths: React.FC<{t: TL}> = ({t}) => {
  const frame = useCurrentFrame();
  const g = useGFrame();
  const pal = usePal();
  const i0 = t.at('The Irish');
  const k = interpolate(frame, [t.at('The Germans') - 2, t.at('The Germans') + 26], [0, 1], {...clamp, easing: Easing.inOut(Easing.cubic)});
  const s = 1.42 + 0.3 * k;
  const cx = 800 - 250 * k;
  const cy = 390 + 60 * k;
  const S = toS(cx, cy, s);
  return (
    <AbsoluteFill style={{background: '#15130f'}}>
      <EmapView cx={cx} cy={cy} s={s}>
        <Route a={GERMANY} b={PENN} at={t.at('Germans') + 4} bow={0.2} color={boxOf(pal)} width={7} />
        <Route a={NEW_YORK} b={OHIO} at={t.at('Ohio') - 6} bow={-0.1} color={boxOf(pal)} width={5} />
        <Route a={IRELAND} b={NEW_YORK} at={i0 + 2} bow={0.15} width={7} />
      </EmapView>
      <AbsoluteFill style={{background: 'radial-gradient(ellipse at 50% 50%, transparent 45%, rgba(8,6,4,0.8) 100%)'}} />
      <Pin p={S(PENN)} at={t.at('Pennsylvania')} label="Pennsylvania" dx={10} dy={-64} />
      <Pin p={S(OHIO)} at={t.at('Ohio')} label="Ohio" dx={-40} dy={24} />
      {g >= t.at('Germans') && g < i0 && <Highlight text="GERMANS" x={100} y={90} size={84} at={t.at('Germans')} seed={303} />}
      <Note text="a little money → farmland" x={110} y={210} size={58} rot={-3} at={t.at('money')} out={i0} />
      {g >= i0 && <Highlight text="THE IRISH" x={100} y={90} size={84} at={i0} seed={305} />}
      <Note text="arrived with nothing" x={110} y={210} size={62} rot={-3} at={t.at('nothing')} color={pal.subject} />
      <Tag text="Auswanderer-Karte nach Nordamerika, 1853 · Library of Congress" />
    </AbsoluteFill>
  );
};

/** The famine. Grave: fewer marks. */
const Famine: React.FC<{t: TL}> = ({t}) => {
  const frame = useCurrentFrame();
  const g = useGFrame();
  const z = interpolate(frame, [t.at('In 1845'), t.at('More than')], [1, 1.08], clamp);
  return (
    <AbsoluteFill style={{background: '#0b0a08', overflow: 'hidden'}}>
      <div style={{position: 'absolute', left: 1180, top: 40, height: 1000, transform: `scale(${z})`, transformOrigin: '50% 30%'}}>
        <Img src={staticFile('img/ch04/bridget.jpg')} style={{height: 1000, filter: 'grayscale(1) contrast(1.15) brightness(0.95)', boxShadow: '0 0 60px rgba(0,0,0,0.8)'}} />
      </div>
      {g >= t.at('1845') && <Highlight text="1845" x={120} y={120} size={110} at={t.at('1845')} seed={307} />}
      <Note text="a disease wipes out the potato crop" x={130} y={300} size={54} rot={-2} at={t.at('disease')} />
      <Note text="the food most poor Irish families lived on" x={150} y={390} size={44} rot={-2} at={t.at('food') - 2} color="#ffffff" />
      {g >= t.at('Around') && (
        <div style={{position: 'absolute', left: 130, top: 540, fontFamily: JF.display, fontSize: 140, lineHeight: 1, color: '#f4efe6', textShadow: '0 6px 22px rgba(0,0,0,0.8)',
          opacity: interpolate(g, [t.at('Around'), t.at('Around') + 8], [0, 1], clamp)}}>~1,000,000</div>
      )}
      <Note text="starved or died of disease" x={150} y={700} size={60} rot={-2} at={t.at('starved')} />
      <Tag text="Bridget O'Donnel and her children, Illustrated London News, 22 December 1849" />
    </AbsoluteFill>
  );
};

/** More than a million fled: the crossing and the city. */
const Fled: React.FC<{t: TL}> = ({t}) => {
  const g = useGFrame();
  return (
    <AbsoluteFill>
      <DarkPaper />
      {g >= t.at('More than') && <Highlight text="MORE THAN A MILLION FLED" x={100} y={70} size={80} at={t.at('More than')} seed={309} />}
      <Card src="img/ch04/irish_leaving.jpg" x={110} y={230} w={600} rot={-3} at={t.at('fled') - 2} />
      <Card src="img/ch04/emigrant_ship.jpg" x={700} y={200} w={560} rot={2} at={t.at('landed') - 4} />
      <Card src="img/ch04/five_points.jpg" x={1260} y={260} w={560} rot={-2} at={t.at('Boston') - 2} filter="grayscale(1) contrast(1.2) brightness(1.05)" />
      <Note text="Boston & New York" x={1300} y={700} size={56} rot={-3} at={t.at('Boston')} />
      <Note text="the lowest-paying, most dangerous jobs" x={260} y={880} size={60} rot={-2} at={t.at('lowest-paying') - 2} />
      <Tag text="Irish emigrants leaving home (1866, later depiction) · an emigrant ship, 1850 · Five Points, New York, 1827 (Catlin)" />
    </AbsoluteFill>
  );
};

/** Catholic, in a Protestant country: the alarm, in a nativist cartoon. */
const Alarm: React.FC<{t: TL}> = ({t}) => {
  const frame = useCurrentFrame();
  const g = useGFrame();
  const z = interpolate(frame, [t.at('And a lot'), t.at('This hostility')], [1.02, 1.1], clamp);
  return (
    <AbsoluteFill style={{background: INK, overflow: 'hidden'}}>
      <Img src={staticFile('img/ch04/propagation.jpg')} style={{position: 'absolute', inset: 0, width: 1920, height: 1080, objectFit: 'cover', filter: 'grayscale(1) contrast(1.25) brightness(0.9)', transform: `scale(${z})`}} />
      <AbsoluteFill style={{background: 'radial-gradient(ellipse at 50% 50%, transparent 40%, rgba(0,0,0,0.7) 100%)'}} />
      {g >= t.at('Catholic') && <Highlight text="CATHOLIC" x={110} y={100} size={96} at={t.at('Catholic')} seed={311} />}
      <Note text="in an overwhelmingly Protestant country" x={130} y={240} size={56} rot={-3} at={t.at('overwhelmingly')} />
      {g >= t.at('alarm') && <Highlight text="ALARM" x={1330} y={130} size={110} at={t.at('alarm')} seed={313} rot={4} />}
      <Tag text="“The Propagation Society. More free than welcome,” anti-Catholic cartoon, N. Currier, 1855 · Library of Congress" />
    </AbsoluteFill>
  );
};

const Nativism: React.FC<{t: TL}> = ({t}) => {
  const g = useGFrame();
  const n = t.at('nativism');
  return (
    <AbsoluteFill>
      <DarkPaper />
      <Note text="this hostility has a name:" x={330} y={260} size={62} rot={-3} at={t.at('hostility')} />
      {g >= n && <Highlight text="NATIVISM" x={330} y={380} size={150} at={n} seed={315} rot={-2} />}
      <Definition term="na·tiv·ism" def="hostility toward immigrants by people already living in a country" at={n + 8} x={330} y={610} />
      <Note text="and it got ugly fast." x={420} y={780} size={66} rot={-3} at={t.at('ugly')} />
    </AbsoluteFill>
  );
};

const Convent: React.FC<{t: TL}> = ({t}) => {
  const frame = useCurrentFrame();
  const g = useGFrame();
  const z = interpolate(frame, [t.at('In 1834'), t.at('Two years')], [1, 1.07], clamp);
  return (
    <AbsoluteFill>
      <DarkPaper />
      <div style={{position: 'absolute', left: 700, top: 150, transform: `scale(${z}) rotate(-1.5deg)`, transformOrigin: '50% 50%'}}>
        <div style={{background: '#f4efe6', padding: 16, boxShadow: '0 22px 40px rgba(0,0,0,0.7)'}}>
          <Img src={staticFile('img/ch04/convent_ruins.jpg')} style={{width: 1060, display: 'block', filter: 'grayscale(1) contrast(1.2)'}} />
        </div>
      </div>
      {g >= t.at('1834') && <Highlight text="1834" x={90} y={110} size={110} at={t.at('1834')} seed={317} />}
      <Note text="a mob, outside Boston" x={90} y={300} size={52} rot={-4} at={t.at('mob')} />
      <Note text="a Catholic convent" x={100} y={390} size={52} rot={-3} at={t.at('Catholic', 2)} />
      {g >= t.at('burned') && <Highlight text="BURNED TO THE GROUND" x={480} y={910} size={96} at={t.at('burned')} seed={319} rot={-2} />}
      <Tag text="Ruins of the Ursuline Convent, Charlestown, Massachusetts · engraving, c. 1834" y={40} />
    </AbsoluteFill>
  );
};

const Monk: React.FC<{t: TL}> = ({t}) => {
  const g = useGFrame();
  const pal = usePal();
  return (
    <AbsoluteFill>
      <DarkPaper />
      <Note text="two years later..." x={110} y={100} size={58} rot={-4} at={t.at('Two years')} />
      <Card src="img/ch04/monk_cover.jpg" x={140} y={220} w={500} h={660} rot={-3} at={t.at('book') - 2} filter="grayscale(1) contrast(1.3) brightness(1.1)" />
      {g >= t.at('Awful') && <Highlight text="AWFUL DISCLOSURES OF MARIA MONK" x={690} y={230} size={56} at={t.at('Awful')} seed={321} />}
      <Note text="“the true story of a young woman" x={740} y={380} size={56} rot={-2} at={t.at('claimed')} />
      <Note text="who escaped a convent in Montreal”" x={780} y={460} size={56} rot={-2} at={t.at('escaped')} />
      <Note text="accused priests and nuns" x={720} y={580} size={54} rot={-3} at={t.at('accused')} color={pal.subject} />
      <Note text="of shocking secret crimes" x={760} y={650} size={54} rot={-3} at={t.at('shocking')} color={pal.subject} />
      {g >= t.at('sensation') && <Stamp text="SENSATION" x={760} y={740} at={t.at('sensation')} rot={-8} size={110} />}
      <Note text="one of America's best-sellers before the Civil War" x={660} y={960} size={42} rot={-2} at={t.at('best-selling')} />
      <Tag text="Awful Disclosures of Maria Monk, first published New York, 1836 (later edition cover)" y={40} />
    </AbsoluteFill>
  );
};

const Fake: React.FC<{t: TL}> = ({t}) => {
  const g = useGFrame();
  const f0 = t.at('fake');
  return (
    <AbsoluteFill>
      <DarkPaper />
      <Card src="img/ch04/monk_title.jpg" x={140} y={140} w={520} rot={-3} at={t.at('There was')} filter="grayscale(1) contrast(1.3) brightness(1.1)" />
      <Note text="just one problem..." x={700} y={110} size={60} rot={-3} at={t.at('one problem')} />
      {g >= f0 && <Stamp text="FAKE" x={240} y={430} at={f0} rot={-14} size={190} />}
      <Card src="img/ch04/exposure.jpg" x={1510} y={520} w={340} rot={4} at={t.at('Investigators')} filter="grayscale(1) contrast(1.2)" />
      <Note text="investigators found nothing" x={720} y={260} size={52} rot={-2} at={t.at('Investigators')} />
      <Note text="her own mother: she never lived there" x={720} y={380} size={48} rot={-2} at={t.at('mother')} />
      <Note text="shaped by anti-Catholic ministers" x={700} y={600} size={46} rot={-3} at={t.at('anti-Catholic')} />
      <Note text="who knew exactly what fears" x={720} y={675} size={46} rot={-2} at={t.at('fears')} color={usePal().subject} />
      <Note text="they were selling" x={740} y={745} size={46} rot={-2} at={t.at('selling')} color={usePal().subject} />
      <Tag text="Awful Disclosures, 1836 · Awful Exposure of the Atrocious Plot, a rebuttal published in 1836" y={40} />
    </AbsoluteFill>
  );
};

/** "Sound familiar?": a story that spreads faster than the truth. */
const Familiar: React.FC<{t: TL}> = ({t}) => {
  const g = useGFrame();
  const pal = usePal();
  const r0 = t.at('spreads');
  const lie = interpolate(g, [r0 - 6, r0 + 14], [0, 1], {...clamp, easing: Easing.out(Easing.cubic)});
  const truth = interpolate(g, [r0 - 6, r0 + 60], [0, 0.32], clamp);
  const bar = (y: number, label: string, p: number, color: string, at: number) => (
    <div style={{position: 'absolute', left: 260, top: y, opacity: interpolate(g, [at, at + 5], [0, 1], clamp)}}>
      <div style={{fontFamily: JF.mono, fontSize: 30, letterSpacing: 3, color: '#fff', marginBottom: 12}}>{label}</div>
      <div style={{width: 1400, height: 44, border: '3px solid rgba(255,255,255,0.35)', borderRadius: 4}}>
        <div style={{width: `${p * 100}%`, height: '100%', background: color}} />
      </div>
    </div>
  );
  return (
    <AbsoluteFill>
      <DarkPaper />
      {g >= t.at('Sound') && <Highlight text="SOUND FAMILIAR?" x={260} y={100} size={96} at={t.at('Sound')} seed={323} />}
      {bar(380, 'A SHOCKING STORY THAT CONFIRMS YOUR FEARS', lie, pal.subject, t.at('shocking', 2))}
      {bar(560, 'THE TRUTH', truth, pal.mark, t.at('truth') - 4)}
      <Note text="1836..." x={300} y={760} size={70} rot={-3} at={t.at('1836')} />
      <Note text="...and on your phone today" x={520} y={820} size={70} rot={-3} at={t.at('phone') - 2} color={boxOf(pal)} />
    </AbsoluteFill>
  );
};

const KnowNothings: React.FC<{t: TL}> = ({t}) => {
  const g = useGFrame();
  const kn = t.at('Know-Nothings');
  const w0 = t.at('won');
  return (
    <AbsoluteFill>
      <DarkPaper />
      {g >= t.at('1850s') && <Highlight text="THE 1850s" x={100} y={70} size={80} at={t.at('1850s')} seed={325} />}
      <Note text="nativists get their own party" x={110} y={190} size={56} rot={-3} at={t.at('political')} out={kn} />
      <Card src="img/ch04/citizen_kn.jpg" x={120} y={290} w={460} rot={-3} at={t.at('secret') - 4} filter="grayscale(1) contrast(1.15)" />
      <Note text="“keep it secret”" x={640} y={300} size={58} rot={-3} at={t.at('secret')} />
      {g >= t.at('I know') && <Highlight text="“I KNOW NOTHING.”" x={620} y={420} size={84} at={t.at('I know')} seed={327} rot={-2} />}
      {g >= kn && <Highlight text="THE KNOW-NOTHINGS" x={650} y={570} size={72} at={kn} seed={329} rot={1} />}
      <Card src="img/ch04/kn_polka.jpg" x={1580} y={110} w={270} rot={5} at={kn + 2} />
      <Card src="img/ch04/kn_soap.jpg" x={1560} y={600} w={300} rot={-4} at={kn + 6} />
      <Note text="and they won real elections:" x={660} y={760} size={54} rot={-2} at={w0} />
      <Note text="governors" x={700} y={850} size={58} rot={-3} at={t.at('governors')} color={boxOf(usePal())} />
      <Note text="nearly the entire Massachusetts legislature" x={640} y={940} size={52} rot={-2} at={t.at('nearly')} color={boxOf(usePal())} />
      <Tag text="“Citizen Know Nothing,” Sarony & Co., 1854 · Know Nothing Polka, 1854 · Know Nothing Soap, 1854" y={40} />
    </AbsoluteFill>
  );
};

const KeepOut: React.FC<{t: TL}> = ({t}) => {
  const g = useGFrame();
  const pal = usePal();
  const a = t.at('include');
  const b = t.at('keep people');
  return (
    <AbsoluteFill>
      <DarkPaper />
      <Note text="not every reformer was trying to..." x={200} y={170} size={64} rot={-3} at={t.at('So not')} />
      {g >= a && <Highlight text="INCLUDE MORE PEOPLE" x={200} y={320} size={96} at={a} seed={331} />}
      {g >= t.at('Some were') && <Strike x={190} y={380} w={900} at={t.at('Some were') + 2} />}
      {g >= b && <Highlight text="KEEP PEOPLE OUT" x={380} y={520} size={110} at={b} seed={333} rot={-2} />}
      <Note text="hold onto that too." x={900} y={760} size={70} rot={-4} at={t.at('Hold')} color={pal.mark} />
    </AbsoluteFill>
  );
};

const Body: React.FC = () => {
  const frame = useCurrentFrame();
  const t = makeTimeline(N, 30);
  const at = t.at;
  const cuts: [number, React.ReactNode][] = [
    [0, <Arrivals t={t} />],
    [at('The Germans') - 1, <Paths t={t} />],
    [at('In 1845') - 1, <Famine t={t} />],
    [at('More than') - 1, <Fled t={t} />],
    [at('And a lot') - 1, <Alarm t={t} />],
    [at('This hostility') - 1, <Nativism t={t} />],
    [at('In 1834') - 1, <Convent t={t} />],
    [at('Two years') - 1, <Monk t={t} />],
    [at('There was') - 1, <Fake t={t} />],
    [at('Sound') - 1, <Familiar t={t} />],
    [at('By the') - 1, <KnowNothings t={t} />],
    [at('So not') - 1, <KeepOut t={t} />],
  ];
  const scene = cuts.reduce((acc, [f, node]) => (frame >= f ? node : acc), cuts[0][1]);
  const end = Math.ceil(N.duration * 30);
  return (
    <AbsoluteFill>
      {scene}
      <Finish vignette={0.3} />
      <Audio src={staticFile('audio/ch04_know_nothing.wav')} />
      <Audio src={staticFile('music/nativism.mp3')} volume={(f) => interpolate(f, [0, 20, end - 20, end + 30], [0, 0.15, 0.15, 0], clamp)} />
      {cuts.slice(1).map(([f], i) => <Sfx key={i} at={f} src="sfx/whoosh.wav" volume={0.28} />)}
      {['1815', 'Germans', 'The Irish', '1845', 'More than', 'Catholic', 'alarm', 'nativism', '1834', 'burned', 'Awful', 'Sound', '1850s', 'I know', 'Know-Nothings', 'include', 'keep people'].map((c) => (
        <Sfx key={c} at={at(c)} src="sfx/stamp.wav" volume={0.26} />
      ))}
      {[at('sensation'), at('fake')].map((f, i) => <Sfx key={`b${i}`} at={f} src="sfx/boom.wav" volume={0.35} />)}
      {['immigrants', 'money', 'nothing', 'disease', 'starved', 'lowest-paying', 'overwhelmingly', 'ugly', 'mob', 'claimed', 'accused', 'Investigators', 'mother', 'anti-Catholic', '1836', 'phone', 'secret', 'won', 'governors', 'Hold'].map((c) => (
        <Sfx key={c} at={at(c) - 2} src={WRITE.src} volume={WRITE.volume} />
      ))}
      {[at('Ireland'), at('Germany'), at('Pennsylvania'), at('Ohio')].map((f, i) => <Sfx key={`p${i}`} at={f} src="sfx/tick.wav" volume={0.45} />)}
    </AbsoluteFill>
  );
};

export const Ch04: React.FC = () => (
  <PaletteCtx.Provider value={PALETTES.locked}>
    <StepCtx.Provider value={2.5}>
      <Body />
    </StepCtx.Provider>
  </PaletteCtx.Provider>
);
