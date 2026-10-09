// Short · "Americans drank 7 gallons a year": the Temperance Movement, from chapter 5 ("Because here's a number that
// sounds made up." through "…it started with people signing a piece of paper."), then the Fix Everything outro. ~66 s.
import React from 'react';
import {AbsoluteFill, Easing, Img, interpolate, staticFile, useCurrentFrame} from 'remotion';
import ch05 from '../../public/audio/ch05_seven_gallons.words.json';
import outro from '../../public/audio/fe_short_outro_subscribe.words.json';
import breakfast from '../../public/img/jh/masks/ch05_breakfast.json';
import {clamp} from '../lib/anim';
import {makeTimeline, type Narration} from '../lib/timing';
import {boxOf, Highlight, INK, JF, Loop, type MaskData, Note, Picture, useGFrame, usePal} from '../jh/Kit';
import {Card, DarkPaper, Sfx, WRITE} from '../ch/common';
import {type Clip, CropV, fillV, joinWords, MapViewV, mapToScreenV, OutroSubscribe, OutroWatch, ShortShell, shortFrames, TagV} from './Short';

const CLIPS: Clip[] = [
  {stem: 'ch05_seven_gallons', words: ch05 as Narration, from: 5.2, to: 64.0},
  {stem: 'fe_short_outro_subscribe', words: outro as Narration, from: 0, to: (outro as Narration).duration},
];
export const SHORT_TEMPERANCE_FRAMES = shortFrames(CLIPS);
const N = joinWords(CLIPS);
const T = makeTimeline(N, 30);
type TL = typeof T;
const GEN: [number, number] = [1376, 768];
const BK = breakfast as unknown as MaskData;

/** The chapter's jug, `size` px; it bumps when its moment comes. */
const Jug: React.FC<{x: number; y: number; at: number; size?: number; part?: number; show?: number}> = ({x, y, at, size = 120, part = 1, show = -999}) => {
  const g = useGFrame();
  if (g < show) return null;
  const k = interpolate(g, [at, at + 3, at + 6], [1, 1.3, 1], clamp);
  return (
    <div style={{position: 'absolute', left: x, top: y, width: size, height: size, transform: `scale(${k})`, clipPath: part < 1 ? `inset(0 ${(1 - part) * 100}% 0 0)` : undefined}}>
      <Img src={staticFile('img/ch05/jug_cut.png')} style={{width: size, height: size, transform: 'rotate(-42deg)', filter: 'drop-shadow(0 8px 12px rgba(0,0,0,0.6))'}} />
    </div>
  );
};

/** Seven gallons a year: the seven jugs are on the desk from frame 0 (the cover), big, and bump one by one. */
const Gallons: React.FC<{t: TL}> = ({t}) => {
  const g = useGFrame();
  const s0 = t.at('seven');
  const today = t.at("That's");
  const J = 175;
  const pos = [[90, 690], [300, 690], [510, 690], [720, 690], [195, 875], [405, 875], [615, 875]];
  return (
    <AbsoluteFill>
      <DarkPaper />
      <Note text="a number that sounds made up:" x={60} y={500} size={50} rot={-3} at={t.at('number')} />
      {g >= t.at('Around') && <Highlight text="c. 1830" x={70} y={580} size={76} at={t.at('Around')} seed={403} rot={-2} />}
      {pos.map(([x, y], i) => <Jug key={i} x={x} y={y} size={J} at={s0 + i * 2} />)}
      <Note text="7 gallons of pure alcohol" x={70} y={1075} size={50} rot={-3} at={t.at('gallons')} out={today} />
      <Note text="per adult, per year" x={100} y={1150} size={50} rot={-3} at={t.at('year')} out={today} color="#ffffff" />
      {g >= today && <div style={{position: 'absolute', left: 70, top: 1070, fontFamily: JF.mono, fontSize: 30, letterSpacing: 3, color: '#fff'}}>TODAY</div>}
      {[0, 1].map((i) => <Jug key={i} x={230 + i * 105} y={1060} size={95} at={today + 2 + i * 2} show={today + 2 + i * 2} />)}
      <Jug x={440} y={1060} size={95} at={today + 6} show={today + 6} part={0.5} />
      {g >= t.at('three') && <Highlight text="≈ 3×" x={600} y={1060} size={90} at={t.at('three')} seed={405} rot={-2} />}
      <TagV text="Data: W. J. Rorabaugh, The Alcoholic Republic (1979) · NIAAA" />
    </AbsoluteFill>
  );
};

/** Whiskey cheaper than milk; the work crew's daily ration (colour creeps in from the right). */
const Ration: React.FC<{t: TL}> = ({t}) => {
  const g = useGFrame();
  const sc = 940 / GEN[0];
  return (
    <AbsoluteFill>
      <DarkPaper />
      <CropV src="img/gen/ch05_grog_ration.jpg" size={GEN} x={70} y={540} w={940} h={525} fx={688} fy={384} scale={sc} rot={-1.5} at={-100} bw="grayscale(1) contrast(1.25)" reveal>
        {(S) => {
          const [dx, dy] = S(845, 300);
          return <Loop cx={dx} cy={dy} rx={80} ry={64} tilt={-8} at={t.at('ration') - 2} dur={10} width={6} seed={409} />;
        }}
      </CropV>
      {g >= t.at('Whiskey') && <Highlight text="WHISKEY" after="< MILK" x={60} y={1110} size={84} at={t.at('Whiskey')} seed={407} rot={-2} />}
      <Note text="a daily ration, as part of the pay" x={90} y={985} size={38} rot={-3} at={t.at('ration')} />
      <TagV text="Illustration · the whiskey ration on an Erie Canal work crew, 1822" />
    </AbsoluteFill>
  );
};

/** Politicians rolled out barrels of liquor to win votes. */
const Election: React.FC<{t: TL}> = ({t}) => {
  const frame = useCurrentFrame();
  const g = useGFrame();
  const size: [number, number] = [3840, 2764];
  const place = fillV(size, 450, 2000, interpolate(frame, [t.at('Politicians'), t.at('People drank')], [1.8, 1.88], clamp));
  const S = (x: number, y: number) => [place.left + x * place.scale, place.top + y * place.scale];
  const [bx, by] = S(260, 2050);
  return (
    <AbsoluteFill style={{background: INK, overflow: 'hidden'}}>
      <Picture src="img/ch05/county_election.jpg" place={place} size={size} bw="grayscale(1) contrast(1.2)" />
      <Loop cx={bx} cy={by} rx={250} ry={330} tilt={-4} at={t.at('barrels') - 2} dur={10} width={6} seed={411} />
      {g >= t.at('Politicians') && <Highlight text="LIQUOR FOR VOTES" x={60} y={520} size={80} at={t.at('barrels')} seed={413} rot={-2} />}
      <TagV text="George Caleb Bingham, The County Election, 1852 · Saint Louis Art Museum" />
    </AbsoluteFill>
  );
};

/** People drank at breakfast: the illustration cropped to the table, the drinker in coral. */
const Breakfast: React.FC<{t: TL}> = ({t}) => {
  const g = useGFrame();
  return (
    <AbsoluteFill>
      <DarkPaper />
      <CropV src="img/gen/ch05_breakfast.jpg" size={GEN} x={70} y={520} w={940} h={560} fx={540} fy={430} scale={1.45} rot={1.5} at={-100} bw="grayscale(1) contrast(1.25)"
        mask={{alpha: 'img/jh/masks/ch05_breakfast_magenta_a.png', paths: BK.shapes.magenta}} traceAt={t.at('drank', 2)} />
      {g >= t.at('breakfast') && <Highlight text="AT BREAKFAST." x={60} y={1110} size={92} at={t.at('breakfast')} seed={415} rot={-2} />}
      <TagV text="Illustration · breakfast in an Ohio farmhouse, 1830" />
    </AbsoluteFill>
  );
};

/** The damage reformers saw. */
const Damage: React.FC<{t: TL}> = ({t}) => {
  const g = useGFrame();
  return (
    <AbsoluteFill>
      <DarkPaper />
      <Card src="img/prep/drunkards_art.jpg" x={150} y={530} w={780} rot={1.5} at={t.at('And reformers') - 1} filter="grayscale(1) contrast(1.2)" />
      {[['POVERTY', 'poverty', 60, 560], ['VIOLENCE AT HOME', 'violence', 120, 780], ['A PAYCHECK, DRUNK AWAY', 'drinking', 50, 1000]].map(([txt, cue, x, y], i) =>
        g >= t.at(cue as string) ? <Highlight key={txt as string} text={txt as string} x={x as number} y={y as number} size={62} at={t.at(cue as string)} seed={417 + i} rot={i % 2 ? 2 : -2} /> : null,
      )}
      <TagV text="N. Currier, The Drunkard's Progress, 1846 · Library of Congress" />
    </AbsoluteFill>
  );
};

/** Lyman Beecher's terrifying sermons about "Demon Rum." */
const Beecher: React.FC<{t: TL}> = ({t}) => {
  const g = useGFrame();
  const demon = t.at('Demon');
  return (
    <AbsoluteFill>
      <DarkPaper />
      <Card src="img/ch05/beecher_art.jpg" x={280} y={505} w={520} rot={-3} at={t.at('Preachers') - 1} />
      <Note text="terrifying sermons about..." x={50} y={520} size={46} rot={-3} at={t.at('terrifying')} />
      {g >= t.at('Lyman') && g < demon && <Highlight text="LYMAN BEECHER" x={60} y={1080} size={76} at={t.at('Lyman')} seed={421} rot={-2} />}
      {g >= demon && <Highlight text="“DEMON RUM.”" x={60} y={1040} size={120} at={demon} seed={423} rot={-3} />}
      <TagV text="Lyman Beecher, daguerreotype, Brady studio, c. 1845–50 · Library of Congress" />
    </AbsoluteFill>
  );
};

/** Factory owners: a sober worker shows up on time. */
const Factory: React.FC<{t: TL}> = ({t}) => {
  const g = useGFrame();
  return (
    <AbsoluteFill>
      <DarkPaper />
      <Card src="img/ch05/lowell.jpg" x={130} y={680} w={820} rot={-2} at={t.at('Factory') - 1} />
      {g >= t.at('Factory') && <Highlight text="FACTORY OWNERS" x={60} y={495} size={80} at={t.at('Factory')} seed={425} rot={-2} />}
      <Note text="jumped on board too..." x={110} y={590} size={46} rot={-3} at={t.at('jumped')} color="#ffffff" />
      <Note text="a sober worker shows up on time" x={60} y={1140} size={46} rot={-3} at={t.at('sober')} color={boxOf(usePal())} />
      <TagV text="View of Lowell, Massachusetts, c. 1840s · Library of Congress" />
    </AbsoluteFill>
  );
};

/** The Temperance Movement: certificates and the family pledge. */
const Movement: React.FC<{t: TL}> = ({t}) => {
  const g = useGFrame();
  return (
    <AbsoluteFill>
      <DarkPaper />
      {g >= t.at('Temperance') && <Highlight text="THE TEMPERANCE" x={60} y={500} size={84} at={t.at('Temperance')} seed={427} rot={-2} />}
      {g >= t.at('Temperance') && <Highlight text="MOVEMENT" x={90} y={612} size={84} at={t.at('Temperance') + 2} seed={428} rot={-2} />}
      <Card src="img/ch05/member_cert_art.jpg" x={60} y={750} w={400} rot={-3} at={t.at('Groups') - 1} />
      <Card src="img/ch05/family_pledge_art.jpg" x={560} y={730} w={380} rot={3} at={t.at('pledge') - 2} />
      <Note text="hundreds of thousands" x={460} y={1150} size={46} rot={-2} at={t.at('hundreds')} />
      <TagV text="Temperance society certificate, c. 1841 · Temperance Tabula and Family Pledge, 1848 · Library of Congress" />
    </AbsoluteFill>
  );
};

/** 1851: Maine bans selling alcohol. */
const Maine: React.FC<{t: TL}> = ({t}) => {
  const frame = useCurrentFrame();
  const g = useGFrame();
  const pal = usePal();
  const m0 = t.at('And in');
  const k = interpolate(frame, [m0, m0 + 30], [0, 1], {...clamp, easing: Easing.inOut(Easing.cubic)});
  const s = 0.5 + 1.1 * k;
  const cx = 3100 + 450 * k;
  const cy = 1900 - 460 * k;
  const S = mapToScreenV(cx, cy, s);
  const [mx, my] = S([3570, 1350]);
  return (
    <AbsoluteFill style={{background: '#15130f'}}>
      <MapViewV cx={cx} cy={cy} s={s} />
      <AbsoluteFill style={{background: 'radial-gradient(ellipse at 50% 45%, transparent 40%, rgba(8,6,4,0.8) 100%)'}} />
      <Loop cx={mx} cy={my} rx={140 * s} ry={170 * s} tilt={-10} at={t.at('Maine') - 2} dur={12} width={7} seed={431} />
      {g >= t.at('1851') && <Highlight text="1851" x={60} y={500} size={100} at={t.at('1851')} seed={433} rot={-2} />}
      {g >= t.at('Maine') && <Highlight text="MAINE" x={330} y={500} size={100} at={t.at('Maine')} seed={435} rot={-3} />}
      <Note text="the first statewide ban" x={70} y={1080} size={54} rot={-3} at={t.at('first')} />
      <Note text="on selling alcohol" x={100} y={1160} size={54} rot={-3} at={t.at('selling')} color={pal.subject} />
      <TagV text="Mitchell's Map of the United States, 1836 · Library of Congress" />
    </AbsoluteFill>
  );
};

/** It actually worked: 7.1 gallons in 1830, 3.1 by 1840. */
const Worked: React.FC<{t: TL}> = ({t}) => {
  const g = useGFrame();
  const pal = usePal();
  const w0 = t.at('worked');
  const d0 = t.at('dropped');
  const p = interpolate(g, [d0 - 4, d0 + 16], [0, 1], {...clamp, easing: Easing.inOut(Easing.quad)});
  const x0 = 140;
  const x1 = 880;
  const y = (v: number) => 1170 - v * 55;
  const ex = x0 + (x1 - x0) * p;
  const ey = y(7.1) + (y(3.1) - y(7.1)) * p;
  const by = t.at('By the');
  return (
    <AbsoluteFill>
      <DarkPaper />
      <Note text="and here's the wild part..." x={60} y={495} size={50} rot={-3} at={t.at('wild')} />
      {g >= w0 && <Highlight text="IT ACTUALLY WORKED." x={60} y={570} size={72} at={w0} seed={437} rot={-2} />}
      {g >= by && (
        <svg style={{position: 'absolute', left: 0, top: 0}} width={1080} height={1920}>
          <line x1={x0 - 30} y1={y(0)} x2={x1 + 60} y2={y(0)} stroke="rgba(255,255,255,0.45)" strokeWidth={3} />
          <line x1={x0} y1={y(7.1)} x2={ex} y2={ey} stroke={pal.mark} strokeWidth={8} strokeLinecap="round" />
          <circle cx={x0} cy={y(7.1)} r={14} fill={pal.mark} />
          {p >= 1 && <circle cx={x1} cy={y(3.1)} r={14} fill={pal.subject} />}
        </svg>
      )}
      {g >= by && <div style={{position: 'absolute', left: x0 - 50, top: y(0) + 14, fontFamily: JF.mono, fontSize: 28, color: '#fff'}}>1830</div>}
      {g >= by && <div style={{position: 'absolute', left: x1 - 50, top: y(0) + 14, fontFamily: JF.mono, fontSize: 28, color: '#fff'}}>1840</div>}
      {g >= by && <div style={{position: 'absolute', left: x0 + 24, top: y(7.1) - 72, fontFamily: JF.display, fontSize: 54, color: '#f4efe6'}}>7.1 gal</div>}
      {p >= 1 && <div style={{position: 'absolute', left: x1 - 200, top: y(3.1) + 20, fontFamily: JF.display, fontSize: 54, color: pal.subject}}>3.1 gal</div>}
      {g >= t.at('more than half') && <Highlight text="MORE THAN HALF" x={420} y={680} size={60} at={t.at('more than half')} seed={439} rot={-3} />}
      <Note text="...it started with a piece of paper." x={60} y={1090} size={40} rot={-2} at={t.at('piece') - 4} color={boxOf(pal)} />
      <TagV text="Data: Rorabaugh, The Alcoholic Republic · gallons of pure alcohol per person 15+" />
    </AbsoluteFill>
  );
};

const Body: React.FC<{t: TL}> = ({t}) => {
  const frame = useCurrentFrame();
  const at = t.at;
  const cuts: [number, React.ReactNode][] = [
    [0, <Gallons t={t} />],
    [at('Whiskey') - 1, <Ration t={t} />],
    [at('Politicians') - 1, <Election t={t} />],
    [at('People drank') - 1, <Breakfast t={t} />],
    [at('And reformers') - 1, <Damage t={t} />],
    [at('Preachers') - 1, <Beecher t={t} />],
    [at('Factory') - 1, <Factory t={t} />],
    [at('This was') - 1, <Movement t={t} />],
    [at('And in') - 1, <Maine t={t} />],
    [at("And here's") - 1, <Worked t={t} />],
    [at('Want') - 1, <OutroWatch t={t} />],
    [at('And subscribe') - 1, <OutroSubscribe t={t} />],
  ];
  return (
    <>
      {cuts.reduce((acc, [f, node]) => (frame >= f ? node : acc), cuts[0][1])}
      {['Around', 'three', 'Whiskey', 'barrels', 'breakfast', 'poverty', 'violence', 'drinking', 'Lyman', 'Demon', 'Factory', 'Temperance', '1851', 'Maine', 'worked', 'more than half', 'subscribe'].map((c) => (
        <Sfx key={c} at={at(c)} src="sfx/stamp.wav" volume={0.26} />
      ))}
      {Array.from({length: 7}).map((_, i) => <Sfx key={`j${i}`} at={at('seven') + i * 2} src="sfx/tick.wav" volume={0.35} />)}
      {['number', 'gallons', 'year', 'ration', 'terrifying', 'jumped', 'sober', 'hundreds', 'first', 'selling', 'wild', 'piece', 'Want'].map((c) => (
        <Sfx key={c} at={at(c) - 2} src={WRITE.src} volume={WRITE.volume} />
      ))}
    </>
  );
};

const CUTS = ['Whiskey', 'Politicians', 'People drank', 'And reformers', 'Preachers', 'Factory', 'This was', 'And in', "And here's", 'Want', 'And subscribe'].map((p) => T.at(p) - 1);

export const ShortTemperance: React.FC = () => (
  <ShortShell clips={CLIPS} headline={['AMERICANS DRANK', '7 GALLONS A YEAR']} headlineSize={86}
    music={{src: 'music/temperance.mp3', volume: 0.12, duck: [[T.at('And reformers'), T.at('Preachers')]], duckTo: 0.5}} cuts={CUTS}>
    <Body t={T} />
  </ShortShell>
);
