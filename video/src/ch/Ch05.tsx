// Chapter 5 · Seven Gallons
import React from 'react';
import {AbsoluteFill, Audio, Easing, Img, interpolate, staticFile, useCurrentFrame} from 'remotion';
import words from '../../public/audio/ch05_seven_gallons.words.json';
import breakfast from '../../public/img/jh/masks/ch05_breakfast.json';
import {clamp} from '../lib/anim';
import {makeTimeline, type Narration} from '../lib/timing';
import {boxOf, ColourReveal, Finish, Highlight, INK, JF, Loop, MaskData, Note, PALETTES, PaletteCtx, Picture, Place, StepCtx, Tag, Tint, Traced, useGFrame, usePal} from '../jh/Kit';
import {Card, DarkPaper, MapView, mapToScreen, Sfx, WRITE} from './common';

const N = words as Narration;
const BK = breakfast as unknown as MaskData;
export const CH05_FRAMES = Math.ceil(N.duration * 30) + 30;
type TL = ReturnType<typeof makeTimeline>;
const GEN: [number, number] = [1376, 768];

/** Full-bleed image that slowly pushes in, clamped so it always fills the frame. */
const fill = (size: [number, number], fx: number, fy: number, z: number): Place => {
  const sc = Math.max(1920 / size[0], 1080 / size[1]) * z;
  return {left: Math.min(0, Math.max(1920 - size[0] * sc, 960 - fx * sc)), top: Math.min(0, Math.max(1080 - size[1] * sc, 540 - fy * sc)), scale: sc};
};

const Jug: React.FC<{x: number; y: number; at: number; part?: number; ghost?: boolean}> = ({x, y, at, part = 1, ghost}) => {
  const g = useGFrame();
  if (g < at) return null;
  const k = interpolate(g, [at, at + 3, at + 6], [0, 1.25, 1], clamp);
  return (
    <div style={{position: 'absolute', left: x, top: y, width: 150, height: 150, transform: `scale(${k})`, clipPath: part < 1 ? `inset(0 ${(1 - part) * 100}% 0 0)` : undefined}}>
      <Img src={staticFile('img/ch05/jug_cut.png')} style={{width: 150, height: 150, transform: 'rotate(-42deg)', filter: ghost ? 'grayscale(1) brightness(0.7)' : 'drop-shadow(0 8px 12px rgba(0,0,0,0.6))'}} />
    </div>
  );
};

const Opener: React.FC<{t: TL}> = ({t}) => {
  const g = useGFrame();
  return (
    <AbsoluteFill>
      <DarkPaper />
      <Card src="img/ch05/tree_intemperance_art.jpg" x={1150} y={90} w={600} rot={3} at={1} filter="grayscale(1) contrast(1.2)" />
      <Note text="back to the people trying to fix things..." x={120} y={180} size={58} rot={-3} at={t.at('Back')} />
      <Note text="first on a lot of lists:" x={160} y={360} size={62} rot={-3} at={t.at('first')} />
      {g >= t.at('booze') && <Highlight text="BOOZE" x={180} y={480} size={170} at={t.at('booze')} seed={401} rot={-3} />}
      <Tag text="Tree of Intemperance, A. D. Fillmore, c. 1855 · Library of Congress" y={1030} />
    </AbsoluteFill>
  );
};

const Gallons: React.FC<{t: TL}> = ({t}) => {
  const g = useGFrame();
  const pal = usePal();
  const s0 = t.at('seven');
  const today = t.at('today');
  return (
    <AbsoluteFill>
      <DarkPaper />
      <Note text="a number that sounds made up:" x={120} y={90} size={56} rot={-3} at={t.at('number')} />
      {g >= t.at('Around') && <Highlight text="c. 1830" x={120} y={190} size={80} at={t.at('Around')} seed={403} />}
      {Array.from({length: 7}).map((_, i) => <Jug key={i} x={110 + i * 150} y={330} at={s0 + i * 2} />)}
      {g >= s0 && <div style={{position: 'absolute', left: 1250, top: 250, fontFamily: JF.display, fontSize: 200, lineHeight: 1, color: '#f4efe6', textShadow: '0 6px 22px rgba(0,0,0,0.8)'}}>7</div>}
      <Note text="gallons of pure alcohol" x={1250} y={470} size={42} rot={-3} at={t.at('gallons')} />
      <Note text="per adult, per year" x={1280} y={530} size={42} rot={-3} at={t.at('year')} />
      {g >= today - 12 && (
        <div style={{position: 'absolute', left: 120, top: 640, fontFamily: JF.mono, fontSize: 30, letterSpacing: 3, color: '#fff'}}>TODAY</div>
      )}
      {[0, 1].map((i) => <Jug key={i} x={110 + i * 150} y={690} at={today - 10 + i * 2} />)}
      <Jug x={410} y={690} at={today - 6} part={0.5} />
      {g >= t.at('three') && <Highlight text="≈ 3×" x={680} y={720} size={110} at={t.at('three')} seed={405} rot={-2} />}
      <Note text="(US adults today: about 2.5 gallons)" x={1000} y={760} size={38} rot={-2} at={today} color="#ffffff" />
      <Tag text="Data: W. J. Rorabaugh, The Alcoholic Republic (1979) · NIAAA · jug: detail of an illustration" y={1030} />
    </AbsoluteFill>
  );
};

/** Whiskey cheaper than milk; the canal workers' ration. */
const Ration: React.FC<{t: TL}> = ({t}) => {
  const frame = useCurrentFrame();
  const g = useGFrame();
  const place = fill(GEN, 560, 420, interpolate(frame, [t.at('Whiskey'), t.at('Politicians')], [1.02, 1.12], clamp));
  const S = (x: number, y: number) => [place.left + x * place.scale, place.top + y * place.scale];
  const [dx, dy] = S(845, 300);
  return (
    <AbsoluteFill style={{background: INK, overflow: 'hidden'}}>
      <Picture src="img/gen/ch05_grog_ration.jpg" place={place} size={GEN} bw="grayscale(1) contrast(1.25)" />
      <ColourReveal src="img/gen/ch05_grog_ration.jpg" place={place} size={GEN} from={0.55} to={0.9} />
      {g >= t.at('Whiskey') && <Highlight text="WHISKEY" after="< MILK" x={100} y={90} size={90} at={t.at('Whiskey')} seed={407} />}
      <Note text="(cheaper than milk)" x={130} y={220} size={50} rot={-3} at={t.at('milk')} />
      <Loop cx={dx} cy={dy} rx={150} ry={120} tilt={-8} at={t.at('ration') - 2} dur={10} width={6} seed={409} />
      <Note text="a daily ration, as part of the pay" x={760} y={900} size={48} rot={-3} at={t.at('ration')} />
      <Tag text="Illustration · the whiskey ration on an Erie Canal work crew, 1822" />
    </AbsoluteFill>
  );
};

/** Politicians rolled out barrels of liquor. */
const Election: React.FC<{t: TL}> = ({t}) => {
  const frame = useCurrentFrame();
  const g = useGFrame();
  const size: [number, number] = [3840, 2764];
  const place = fill(size, 900, 1900, interpolate(frame, [t.at('Politicians'), t.at('People drank')], [1.35, 1.5], clamp));
  const S = (x: number, y: number) => [place.left + x * place.scale, place.top + y * place.scale];
  const [bx, by] = S(260, 2050);
  return (
    <AbsoluteFill style={{background: INK, overflow: 'hidden'}}>
      <Picture src="img/ch05/county_election.jpg" place={place} size={size} bw="grayscale(1) contrast(1.2)" />
      <Loop cx={bx} cy={by} rx={230} ry={330} tilt={-4} at={t.at('barrels') - 2} dur={10} width={6} seed={411} />
      {g >= t.at('Politicians') && <Highlight text="LIQUOR FOR VOTES" x={900} y={90} size={84} at={t.at('barrels')} seed={413} />}
      <Tag text="George Caleb Bingham, The County Election, 1852 · Saint Louis Art Museum" />
    </AbsoluteFill>
  );
};

/** People drank at breakfast. */
const Breakfast: React.FC<{t: TL}> = ({t}) => {
  const frame = useCurrentFrame();
  const g = useGFrame();
  const place = fill(GEN, 640, 380, interpolate(frame, [t.at('People drank'), t.at('And reformers')], [1.05, 1.14], clamp));
  return (
    <AbsoluteFill style={{background: INK, overflow: 'hidden'}}>
      <Picture src="img/gen/ch05_breakfast.jpg" place={place} size={GEN} bw="grayscale(1) contrast(1.25)" />
      <Tint mask="img/jh/masks/ch05_breakfast_magenta_a.png" place={place} size={GEN} />
      <Traced paths={BK.shapes.magenta} place={place} at={t.at('drank', 2)} dur={8} width={5} />
      {g >= t.at('breakfast') && <Highlight text="AT BREAKFAST." x={1080} y={880} size={96} at={t.at('breakfast')} seed={415} rot={-2} />}
      <Tag text="Illustration · breakfast in an Ohio farmhouse, 1830" y={40} />
    </AbsoluteFill>
  );
};

const Damage: React.FC<{t: TL}> = ({t}) => {
  const g = useGFrame();
  const pal = usePal();
  return (
    <AbsoluteFill>
      <DarkPaper />
      <Card src="img/prep/drunkards_art.jpg" x={640} y={80} w={1180} rot={1.5} at={t.at('And reformers') - 1} filter="grayscale(1) contrast(1.2)" />
      <Note text="reformers saw the damage everywhere:" x={80} y={100} size={50} rot={-3} at={t.at('damage')} />
      {[['poverty', 'poverty'], ['violence at home', 'violence'], ['a paycheck, drunk away', 'drinking']].map(([txt, cue], i) =>
        g >= t.at(cue) ? <Highlight key={txt} text={txt.toUpperCase()} x={90} y={330 + i * 150} size={60} at={t.at(cue)} seed={417 + i} rot={i % 2 ? 2 : -2} /> : null,
      )}
      <Tag text="N. Currier, The Drunkard's Progress, 1846 · Library of Congress" y={1030} />
    </AbsoluteFill>
  );
};

const Beecher: React.FC<{t: TL}> = ({t}) => {
  const g = useGFrame();
  return (
    <AbsoluteFill>
      <DarkPaper />
      <Card src="img/ch05/beecher_art.jpg" x={180} y={110} w={560} rot={-3} at={t.at('Preachers') - 1} />
      {g >= t.at('Lyman') && <Highlight text="LYMAN BEECHER" x={830} y={250} size={84} at={t.at('Lyman')} seed={421} />}
      <Note text="terrifying sermons about..." x={860} y={410} size={58} rot={-3} at={t.at('terrifying')} />
      {g >= t.at('Demon') && <Highlight text="“DEMON RUM.”" x={880} y={530} size={120} at={t.at('Demon')} seed={423} rot={-3} />}
      <Tag text="Lyman Beecher, daguerreotype, Brady studio, c. 1845–50 · Library of Congress" y={1030} />
    </AbsoluteFill>
  );
};

const Factory: React.FC<{t: TL}> = ({t}) => {
  const frame = useCurrentFrame();
  const g = useGFrame();
  const z = interpolate(frame, [t.at('Factory'), t.at('This was')], [1.02, 1.1], clamp);
  return (
    <AbsoluteFill style={{background: INK, overflow: 'hidden'}}>
      <Img src={staticFile('img/ch05/lowell.jpg')} style={{position: 'absolute', inset: 0, width: 1920, height: 1080, objectFit: 'cover', filter: 'grayscale(1) contrast(1.2)', transform: `scale(${z})`}} />
      <AbsoluteFill style={{background: 'radial-gradient(ellipse at 50% 50%, transparent 40%, rgba(0,0,0,0.65) 100%)'}} />
      {g >= t.at('Factory') && <Highlight text="FACTORY OWNERS" x={100} y={90} size={84} at={t.at('Factory')} seed={425} />}
      <Note text="jumped on board too..." x={120} y={220} size={56} rot={-3} at={t.at('jumped')} />
      <Note text="a sober worker shows up on time" x={120} y={880} size={66} rot={-3} at={t.at('sober')} color={boxOf(usePal())} />
      <Tag text="View of Lowell, Massachusetts, c. 1840s · Library of Congress" y={40} />
    </AbsoluteFill>
  );
};

const Movement: React.FC<{t: TL}> = ({t}) => {
  const g = useGFrame();
  return (
    <AbsoluteFill>
      <DarkPaper />
      {g >= t.at('Temperance') && <Highlight text="THE TEMPERANCE MOVEMENT" x={90} y={80} size={84} at={t.at('Temperance')} seed={427} />}
      <Card src="img/ch05/member_cert_art.jpg" x={110} y={230} w={600} rot={-3} at={t.at('Groups') - 1} />
      <Card src="img/ch05/family_pledge_art.jpg" x={1290} y={200} w={500} rot={3} at={t.at('pledge') - 2} />
      <Note text="the American Temperance Society" x={760} y={300} size={52} rot={-3} at={t.at('American')} />
      <Note text="hundreds of thousands" x={790} y={420} size={62} rot={-2} at={t.at('hundreds')} />
      <Note text="signed a pledge to stop drinking" x={760} y={520} size={56} rot={-3} at={t.at('sign')} />
      <Tag text="Temperance society membership certificate, c. 1841 · Temperance Tabula and Family Pledge, 1848 · Library of Congress" y={1030} />
    </AbsoluteFill>
  );
};

const Maine: React.FC<{t: TL}> = ({t}) => {
  const frame = useCurrentFrame();
  const g = useGFrame();
  const pal = usePal();
  const m0 = t.at('And in');
  const k = interpolate(frame, [m0, m0 + 30], [0, 1], {...clamp, easing: Easing.inOut(Easing.cubic)});
  const s = 0.5 + 1.1 * k;
  const cx = 3100 + 450 * k;
  const cy = 1900 - 460 * k;
  const S = mapToScreen(cx, cy, s);
  const [mx, my] = S([3570, 1350]);
  return (
    <AbsoluteFill style={{background: '#15130f'}}>
      <MapView cx={cx} cy={cy} s={s} />
      <AbsoluteFill style={{background: 'radial-gradient(ellipse at 50% 50%, transparent 45%, rgba(8,6,4,0.8) 100%)'}} />
      <Loop cx={mx} cy={my} rx={140 * s} ry={170 * s} tilt={-10} at={t.at('Maine') - 2} dur={12} width={7} seed={431} />
      {g >= t.at('1851') && <Highlight text="1851" x={100} y={90} size={110} at={t.at('1851')} seed={433} />}
      {g >= t.at('Maine') && <Highlight text="MAINE" x={100} y={260} size={110} at={t.at('Maine')} seed={435} />}
      <Note text="the first statewide ban" x={110} y={430} size={60} rot={-3} at={t.at('first', 2)} />
      <Note text="on selling alcohol" x={140} y={520} size={60} rot={-3} at={t.at('selling')} color={pal.subject} />
      <Tag text="Mitchell's Map of the United States, 1836 · Library of Congress" />
    </AbsoluteFill>
  );
};

/** It worked: 7.1 gallons in 1830, 3.1 by 1840. */
const Worked: React.FC<{t: TL}> = ({t}) => {
  const g = useGFrame();
  const pal = usePal();
  const w0 = t.at('worked');
  const d0 = t.at('dropped');
  const p = interpolate(g, [d0 - 4, d0 + 16], [0, 1], {...clamp, easing: Easing.inOut(Easing.quad)});
  const x0 = 260;
  const x1 = 1000;
  const y = (v: number) => 880 - v * 80;
  const ex = x0 + (x1 - x0) * p;
  const ey = y(7.1) + (y(3.1) - y(7.1)) * p;
  const paper = t.at('piece');
  return (
    <AbsoluteFill>
      <DarkPaper />
      <Note text="and here's the wild part..." x={110} y={70} size={52} rot={-3} at={t.at('wild')} />
      {g >= w0 && <Highlight text="IT ACTUALLY WORKED." x={110} y={150} size={88} at={w0} seed={437} />}
      {g >= t.at('By the') && (
        <svg style={{position: 'absolute', left: 0, top: 0}} width={1920} height={1080}>
          <line x1={x0 - 30} y1={y(0)} x2={x1 + 80} y2={y(0)} stroke="rgba(255,255,255,0.45)" strokeWidth={3} />
          <line x1={x0} y1={y(7.1)} x2={ex} y2={ey} stroke={pal.mark} strokeWidth={8} strokeLinecap="round" />
          <circle cx={x0} cy={y(7.1)} r={14} fill={pal.mark} />
          {p >= 1 && <circle cx={x1} cy={y(3.1)} r={14} fill={pal.subject} />}
        </svg>
      )}
      {g >= t.at('By the') && <div style={{position: 'absolute', left: x0 - 60, top: y(0) + 16, fontFamily: JF.mono, fontSize: 28, color: '#fff'}}>1830</div>}
      {g >= t.at('By the') && <div style={{position: 'absolute', left: x1 - 60, top: y(0) + 16, fontFamily: JF.mono, fontSize: 28, color: '#fff'}}>1840</div>}
      {g >= t.at('By the') && <div style={{position: 'absolute', left: x0 + 24, top: y(7.1) - 70, fontFamily: JF.display, fontSize: 54, color: '#f4efe6'}}>7.1 gal</div>}
      {p >= 1 && <div style={{position: 'absolute', left: x1 + 24, top: y(3.1) - 70, fontFamily: JF.display, fontSize: 54, color: pal.subject}}>3.1 gal</div>}
      {g >= t.at('more than half') && <Highlight text="MORE THAN HALF" x={1190} y={380} size={72} at={t.at('more than half')} seed={439} rot={-3} />}
      <Note text="one of the biggest" x={1220} y={520} size={42} rot={-2} at={t.at('biggest')} />
      <Note text="behavior changes" x={1240} y={575} size={42} rot={-2} at={t.at('behavior')} />
      <Note text="in American history" x={1260} y={630} size={42} rot={-2} at={t.at('history')} />
      <Card src="img/ch05/member_cert_art.jpg" x={1420} y={700} w={270} rot={4} at={t.at('signing') - 2} />
      <Note text="...it started with a piece of paper." x={300} y={960} size={56} rot={-2} at={paper - 4} color={boxOf(pal)} />
      <Tag text="Data: Rorabaugh, The Alcoholic Republic · gallons of pure alcohol per person 15+" y={1030} x={1080} />
    </AbsoluteFill>
  );
};

const Body: React.FC = () => {
  const frame = useCurrentFrame();
  const t = makeTimeline(N, 30);
  const at = t.at;
  const cuts: [number, React.ReactNode][] = [
    [0, <Opener t={t} />],
    [at('Because') - 1, <Gallons t={t} />],
    [at('Whiskey') - 1, <Ration t={t} />],
    [at('Politicians') - 1, <Election t={t} />],
    [at('People drank') - 1, <Breakfast t={t} />],
    [at('And reformers') - 1, <Damage t={t} />],
    [at('Preachers') - 1, <Beecher t={t} />],
    [at('Factory') - 1, <Factory t={t} />],
    [at('This was') - 1, <Movement t={t} />],
    [at('And in') - 1, <Maine t={t} />],
    [at("And here's") - 1, <Worked t={t} />],
  ];
  const scene = cuts.reduce((acc, [f, node]) => (frame >= f ? node : acc), cuts[0][1]);
  const end = Math.ceil(N.duration * 30);
  return (
    <AbsoluteFill>
      {scene}
      <Finish vignette={0.3} />
      <Audio src={staticFile('audio/ch05_seven_gallons.wav')} />
      <Audio src={staticFile('music/temperance.mp3')} volume={(f) => interpolate(f, [0, 20, end - 20, end + 30], [0, 0.15, 0.15, 0], clamp)} />
      {cuts.slice(1).map(([f], i) => <Sfx key={i} at={f} src="sfx/whoosh.wav" volume={0.28} />)}
      {['booze', 'Around', 'three', 'Whiskey', 'barrels', 'breakfast', 'poverty', 'violence', 'drinking', 'Lyman', 'Demon', 'Factory', 'Temperance', '1851', 'Maine', 'worked', 'more than half'].map((c) => (
        <Sfx key={c} at={at(c)} src="sfx/stamp.wav" volume={0.26} />
      ))}
      {Array.from({length: 7}).map((_, i) => <Sfx key={`j${i}`} at={at('seven') + i * 2} src="sfx/tick.wav" volume={0.35} />)}
      {['Back', 'first', 'number', 'milk', 'ration', 'damage', 'terrifying', 'jumped', 'sober', 'American', 'hundreds', 'sign', 'selling', 'wild', 'biggest', 'piece'].map((c) => (
        <Sfx key={c} at={at(c) - 2} src={WRITE.src} volume={WRITE.volume} />
      ))}
    </AbsoluteFill>
  );
};

export const Ch05: React.FC = () => (
  <PaletteCtx.Provider value={PALETTES.locked}>
    <StepCtx.Provider value={2.5}>
      <Body />
    </StepCtx.Provider>
  </PaletteCtx.Provider>
);
