// Short · "Knock once for yes…": the Fox sisters, from chapter 3 ("Take 1848. Hydesville, New York." through
// "She'd been cracking her toe joints."), then the Fix Everything outro (watch the full video, subscribe). ~57 s.
import React from 'react';
import {AbsoluteFill, interpolate, useCurrentFrame} from 'remotion';
import ch03 from '../../public/audio/ch03_knock_once.words.json';
import outro from '../../public/audio/fe_short_outro_subscribe.words.json';
import foxMask from '../../public/img/jh/masks/fox_sisters.json';
import {clamp} from '../lib/anim';
import {makeTimeline, type Narration} from '../lib/timing';
import {Arrow, boxOf, Highlight, JF, Loop, type MaskData, Note, useGFrame, usePal} from '../jh/Kit';
import {Card, DarkPaper, Sfx, WRITE} from '../ch/common';
import {type Clip, CropV, joinWords, MapViewV, mapToScreenV, OutroSubscribe, OutroWatch, PinV, ShortShell, shortFrames, TagV} from './Short';

const CLIPS: Clip[] = [
  {stem: 'ch03_knock_once', words: ch03 as Narration, from: 6.15, to: 55.75},
  {stem: 'fe_short_outro_subscribe', words: outro as Narration, from: 0, to: (outro as Narration).duration},
];
export const SHORT_FOX_FRAMES = shortFrames(CLIPS);
const N = joinWords(CLIPS);
const T = makeTimeline(N, 30);
type TL = typeof T;

const FOX = foxMask as unknown as MaskData;
const HYDESVILLE = [2885, 1602];
const ROCHESTER = [2808, 1590];

/** 1848, Hydesville: the Fox sisters' daguerreotype is on the desk from frame 0 (it is the cover). */
const Sisters: React.FC<{t: TL}> = ({t}) => {
  const g = useGFrame();
  return (
    <AbsoluteFill>
      <DarkPaper />
      <CropV src="img/ch03/fox_easterly.jpg" size={[1513, 2000]} x={330} y={590} w={460} h={608} fx={756} fy={1000} scale={460 / 1513} rot={-3} at={-100}
        bw="grayscale(1) contrast(1.15) brightness(1.05)" mask={{alpha: 'img/jh/masks/fox_sisters_subject_a.png', paths: FOX.shapes.subject}} traceAt={-100} />
      <Card src="img/ch03/fox_family.jpg" x={770} y={760} w={240} rot={5} at={t.at('family') - 2} filter="grayscale(1) contrast(1.15)" />
      {g >= t.at('1848') && <Highlight text="1848" x={40} y={495} size={96} at={t.at('1848')} seed={203} rot={-3} />}
      <Note text="Hydesville, N.Y." x={390} y={500} size={46} rot={-3} at={t.at('Hydesville')} />
      {g >= t.at('Maggie') && <Highlight text="MAGGIE & KATE FOX" x={60} y={1100} size={74} at={t.at('Maggie')} seed={207} rot={-2} />}
      <TagV text="Kate and Maggie Fox, daguerreotype by Thomas M. Easterly, 1852 · Fox family plate, 1905" />
    </AbsoluteFill>
  );
};

/** The knocks: the Fox house, KNOCK stamped three times, yes / no, "it's a spirit." */
const Knocks: React.FC<{t: TL}> = ({t}) => {
  const g = useGFrame();
  const pal = usePal();
  const kAt = [t.at('knocking'), t.at('knocks'), t.at('Once')];
  const pos = [[110, 600], [560, 700], [260, 860]];
  return (
    <AbsoluteFill>
      <DarkPaper />
      <Card src="img/ch03/hydesville_house.jpg" x={70} y={560} w={940} rot={-1.5} at={-100} filter="grayscale(1) contrast(1.25) brightness(0.6)" />
      {kAt.map((a, i) => (g >= a && g < a + 18 ? (
        <div key={i} style={{position: 'absolute', left: pos[i][0], top: pos[i][1], fontFamily: JF.display, fontSize: 120, color: boxOf(pal),
          transform: `rotate(${i % 2 ? 6 : -6}deg) scale(${interpolate(g, [a, a + 3, a + 6], [1.4, 0.95, 1], clamp)})`, textShadow: '0 6px 20px rgba(0,0,0,0.8)'}}>KNOCK</div>
      ) : null))}
      <Note text="knock = yes" x={110} y={620} size={70} rot={-4} at={t.at('Once') + 2} />
      <Note text="silence = no" x={480} y={760} size={70} rot={-3} at={t.at('Silence')} />
      {g >= t.at('spirit') && <Highlight text="“IT'S A SPIRIT.”" x={60} y={1110} size={84} at={t.at('spirit')} seed={209} rot={-2} />}
      <TagV text="The Fox house, Hydesville (detail of a 1905 plate)" />
    </AbsoluteFill>
  );
};

/** Word spreads: Hydesville to Rochester on the 1836 map. */
const Spreads: React.FC<{t: TL}> = ({t}) => {
  const g = useGFrame();
  const pal = usePal();
  const s = 3.0;
  const toS = mapToScreenV(2846, 1600, s);
  const w0 = t.at('Word');
  const ripple = interpolate(g, [w0, w0 + 30], [0, 1], clamp);
  const [hx, hy] = toS(HYDESVILLE);
  const [rx, ry] = toS(ROCHESTER);
  return (
    <AbsoluteFill style={{background: '#15130f'}}>
      <MapViewV cx={2846} cy={1600} s={s}>
        {ripple < 1 && [0, 1, 2].map((i) => <circle key={i} cx={HYDESVILLE[0]} cy={HYDESVILLE[1]} r={20 + (ripple * 150 + i * 30)} fill="none" stroke={pal.mark} strokeWidth={4} opacity={1 - ripple} />)}
      </MapViewV>
      <AbsoluteFill style={{background: 'radial-gradient(ellipse at 50% 45%, transparent 40%, rgba(8,6,4,0.8) 100%)'}} />
      <PinV x={hx} y={hy} at={0} label="Hydesville" dx={20} dy={30} />
      <PinV x={rx} y={ry} at={t.at('Rochester')} label="Rochester" dx={-230} dy={-90} />
      <Arrow x1={hx - 10} y1={hy + 20} x2={rx + 18} y2={ry + 18} bow={30} at={t.at('moves')} />
      <Note text="word spreads..." x={80} y={540} size={64} rot={-4} at={w0} />
      <TagV text="Mitchell's Map of the United States, 1836 · Library of Congress" />
    </AbsoluteFill>
  );
};

/** Séances, and people paid to attend. */
const Seances: React.FC<{t: TL}> = ({t}) => (
  <AbsoluteFill>
    <DarkPaper />
    <Card src="img/ch03/knockings_art.jpg" x={190} y={510} w={700} rot={-3} at={t.at('séances') - 1} filter="grayscale(0.6) contrast(1.1)" />
    <Note text="séances, and people paid to attend" x={60} y={1150} size={46} rot={-3} at={t.at('pay') - 4} />
    <TagV text="Rochester Knockings!, 1851 · Library of Congress" />
  </AbsoluteFill>
);

/** P.T. Barnum puts them on display; then the word itself: Spiritualism. */
const Barnum: React.FC<{t: TL}> = ({t}) => {
  const g = useGFrame();
  const pal = usePal();
  const sp = t.at('Spiritualism');
  return (
    <AbsoluteFill>
      <DarkPaper />
      <Card src="img/ch03/barnum_art.jpg" x={60} y={510} w={420} rot={-3} at={t.at('P.T.') - 1} />
      <Card src="img/ch03/barnum_museum.jpg" x={520} y={720} w={480} rot={3} at={t.at('display') - 4} filter="grayscale(1) contrast(1.15)" />
      {g >= t.at('Barnum') && g < sp && <Highlight text="P.T. BARNUM" x={520} y={540} size={80} at={t.at('Barnum')} seed={211} rot={-3} />}
      <Note text="on display" x={540} y={1080} size={46} rot={-3} at={t.at('display')} out={sp} />
      <Note text="in New York City" x={560} y={1150} size={46} rot={-3} at={t.at('display')} out={sp} />
      {g >= sp && (
        <>
          <div style={{position: 'absolute', inset: 0, background: 'rgba(10,9,7,0.45)'}} />
          <Highlight text="SPIRITUALISM" x={70} y={660} size={124} at={sp} seed={213} rot={-2} />
          <div style={{position: 'absolute', left: 80, top: 860, width: 860, fontFamily: JF.sans, fontWeight: 600, fontSize: 40, lineHeight: 1.35, color: '#fff', background: 'rgba(10,10,10,0.8)', padding: '16px 26px',
            opacity: interpolate(g, [sp + 10, sp + 16], [0, 1], clamp)}}>
            <span style={{color: pal.mark}}>spir·it·u·al·ism</span> · the belief that the dead can talk to the living
          </div>
        </>
      )}
      <TagV text="P.T. Barnum, Brady studio · Barnum's American Museum, Gleason's Pictorial, 1853" />
    </AbsoluteFill>
  );
};

/** A dozen years later: the Civil War, and Spiritualism explodes. */
const War: React.FC<{t: TL}> = ({t}) => {
  const g = useGFrame();
  const pal = usePal();
  const tl0 = t.at('Think');
  const line = interpolate(g, [tl0 + 4, t.at('later')], [0, 1], clamp);
  return (
    <AbsoluteFill>
      <DarkPaper />
      <svg style={{position: 'absolute', left: 0, top: 0}} width={1080} height={1920}>
        <line x1={110} y1={600} x2={110 + 820 * line} y2={600} stroke={pal.mark} strokeWidth={6} strokeLinecap="round" />
        <circle cx={110} cy={600} r={14} fill={pal.mark} />
        {line >= 1 && <circle cx={930} cy={600} r={14} fill={pal.subject} />}
      </svg>
      <div style={{position: 'absolute', left: 60, top: 625, fontFamily: JF.display, fontSize: 52, color: '#fff'}}>1848</div>
      {line >= 1 && <div style={{position: 'absolute', left: 840, top: 625, fontFamily: JF.display, fontSize: 52, color: pal.subject}}>1861</div>}
      <Note text="about a dozen years later..." x={180} y={500} size={50} rot={-2} at={t.at('dozen')} />
      {g >= t.at('Civil') && <Highlight text="THE CIVIL WAR" x={230} y={700} size={84} at={t.at('Civil')} seed={215} rot={-2} />}
      <Card src="img/ch03/soldier1_art.jpg" x={60} y={830} w={290} rot={-4} at={t.at('kills')} />
      <Card src="img/ch03/soldier2_art.jpg" x={390} y={820} w={260} rot={2} at={t.at('hundreds')} />
      <Card src="img/ch03/soldier3_art.jpg" x={690} y={880} w={330} rot={-3} at={t.at('young men') - 2} />
      {g >= t.at('explodes') && <Highlight text="SPIRITUALISM EXPLODES" x={50} y={1110} size={66} at={t.at('explodes')} seed={217} rot={-2} />}
      <TagV text="Civil War tintypes and cartes de visite · Library of Congress" />
    </AbsoluteFill>
  );
};

/** Mary Todd Lincoln held séances in the White House. */
const MaryLincoln: React.FC<{t: TL}> = ({t}) => {
  const g = useGFrame();
  return (
    <AbsoluteFill>
      <DarkPaper />
      <Card src="img/ch03/mary_lincoln_art.jpg" x={60} y={505} w={460} rot={-2} at={t.at('Mary') - 1} />
      {g >= t.at('Mary') && <Highlight text="MARY TODD" x={560} y={560} size={74} at={t.at('Mary')} seed={219} rot={-2} />}
      {g >= t.at('Mary') && <Highlight text="LINCOLN" x={580} y={668} size={74} at={t.at('Mary') + 2} seed={220} rot={-2} />}
      <Note text="séances" x={580} y={820} size={46} rot={-3} at={t.at('séances', 2)} />
      <Note text="in the White House" x={560} y={890} size={38} rot={-3} at={t.at('séances', 2)} />
      <Note text="after her son died" x={560} y={980} size={38} rot={-4} at={t.at('son') - 4} color="#ffffff" />
      <TagV text="Mary Todd Lincoln, Brady studio, 1861 · Library of Congress" />
    </AbsoluteFill>
  );
};

/** 1888: Maggie Fox admits on stage that it was a trick. */
const Trick: React.FC<{t: TL}> = ({t}) => {
  const g = useGFrame();
  return (
    <AbsoluteFill>
      <DarkPaper />
      <Note text="oh, and the knocking?" x={60} y={500} size={52} rot={-4} at={t.at('Oh')} />
      {g >= t.at('1888') && <Highlight text="1888" x={770} y={500} size={76} at={t.at('1888')} seed={221} rot={-2} />}
      <Card src="img/ch03/deathblow_art.jpg" x={60} y={620} w={430} rot={-4} at={t.at('Oh')} filter="sepia(0.3) contrast(1.1)" />
      <Card src="img/ch03/deathblow_sig_art.jpg" x={540} y={620} w={450} rot={3} at={t.at('admitted') - 1} filter="sepia(0.3) contrast(1.15)" />
      <Loop cx={540 + 0.51 * 450} cy={620 + 0.958 * 450} rx={0.452 * 450} ry={56} tilt={3} at={t.at('stage')} dur={10} width={6} seed={241} />
      {g >= t.at('trick') && <Highlight text="“IT WAS A TRICK.”" x={60} y={1120} size={80} at={t.at('trick')} seed={223} rot={-2} />}
      <TagV text="The Death-Blow to Spiritualism, 1888, signed by Margaret Fox Kane and Catherine Fox Jencken" />
    </AbsoluteFill>
  );
};

/** She'd been cracking her toe joints. */
const Toes: React.FC<{t: TL}> = ({t}) => {
  const g = useGFrame();
  const x = 70;
  const y = 720;
  const w = 940;
  return (
    <AbsoluteFill>
      <DarkPaper />
      {g >= t.at('trick') && <Highlight text="“IT WAS A TRICK.”" x={60} y={520} size={80} at={-100} seed={223} rot={-2} />}
      <Card src="img/ch03/gray290_big.jpg" x={x} y={y} w={w} rot={-2} at={t.at('cracking') - 2} filter="contrast(1.2)" />
      <Loop cx={x + 0.893 * w} cy={y + 0.25 * w} rx={0.15 * w} ry={0.089 * w} tilt={-10} at={t.at('toe')} dur={8} width={6} seed={243} />
      <Note text="crack!" x={720} y={1090} size={70} rot={8} at={t.at('toe')} />
      <Note text="her toe joints" x={90} y={1130} size={62} rot={-4} at={t.at('joints')} />
      <TagV text="Foot skeleton, Gray's Anatomy (1918), plate 290" />
    </AbsoluteFill>
  );
};

const Body: React.FC<{t: TL}> = ({t}) => {
  const at = t.at;
  const cuts: [number, React.ReactNode][] = [
    [0, <Sisters t={t} />],
    [at('knocking') - 2, <Knocks t={t} />],
    [at('Word') - 1, <Spreads t={t} />],
    [at('The girls') - 1, <Seances t={t} />],
    [at('P.T.') - 1, <Barnum t={t} />],
    [at('Think') - 1, <War t={t} />],
    [at('Mary') - 1, <MaryLincoln t={t} />],
    [at('Oh') - 1, <Trick t={t} />],
    [at("She'd") - 1, <Toes t={t} />],
    [at('Want') - 1, <OutroWatch t={t} />],
    [at('And subscribe') - 1, <OutroSubscribe t={t} />],
  ];
  const frame = useCurrentFrame();
  return (
    <>
      {cuts.reduce((acc, [f, node]) => (frame >= f ? node : acc), cuts[0][1])}
      {[at('knocking'), at('knocks'), at('Once')].map((f, i) => <Sfx key={`k${i}`} at={f} src="sfx/knock.wav" volume={0.5} />)}
      {['1848', 'Maggie', 'spirit', 'Barnum', 'Spiritualism', 'Civil', 'explodes', 'Mary', '1888', 'trick', 'subscribe'].map((c) => <Sfx key={c} at={at(c)} src="sfx/stamp.wav" volume={0.26} />)}
      {['Hydesville', 'Silence', 'Word', 'pay', 'display', 'dozen', 'son', 'Oh', 'toe', 'joints', 'Want'].map((c) => <Sfx key={c} at={at(c) - 2} src={WRITE.src} volume={WRITE.volume} />)}
      {[at('Rochester')].map((f) => <Sfx key="pin" at={f} src="sfx/tick.wav" volume={0.45} />)}
    </>
  );
};

const CUTS = ['knocking', 'Word', 'The girls', 'P.T.', 'Think', 'Mary', 'Oh', "She'd", 'Want', 'And subscribe'].map((p) => T.at(p) - 1);

export const ShortFox: React.FC = () => (
  <ShortShell clips={CLIPS} headline={['KNOCK ONCE', 'FOR YES…']} music={{src: 'music/spirits.mp3', volume: 0.09, duck: [[T.at('Think'), T.at('Mary')]], duckTo: 0.5}} cuts={CUTS}>
    <Body t={T} />
  </ShortShell>
);
