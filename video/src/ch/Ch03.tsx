// Chapter 3 · Knock Once for Yes
import React from 'react';
import {AbsoluteFill, Audio, Easing, Img, interpolate, staticFile, useCurrentFrame} from 'remotion';
import words from '../../public/audio/ch03_knock_once.words.json';
import {clamp} from '../lib/anim';
import {makeTimeline, type Narration} from '../lib/timing';
import {Arrow, boxOf, Finish, Highlight, INK, JF, Loop, Note, PALETTES, PaletteCtx, StepCtx, Tag, useGFrame, useHand, usePal} from '../jh/Kit';
import {Card, DarkPaper, Ember, MapView, mapToScreen, Sfx, WRITE} from './common';

const N = words as Narration;
export const CH03_FRAMES = Math.ceil(N.duration * 30) + 30;
type TL = ReturnType<typeof makeTimeline>;

const DISTRICT = [[2760, 1640], [2790, 1575], [2880, 1560], [2990, 1550], [3060, 1555], [3140, 1585], [3150, 1640], [3120, 1700], [3000, 1725], [2860, 1730], [2770, 1705]];
const HYDESVILLE = [2885, 1602];
const ROCHESTER = [2808, 1590];
const PALMYRA = [2855, 1600];
const KIRTLAND = [2475, 1815];
const INDEPENDENCE = [1313, 2144];
const NAUVOO = [1539, 1956];
const CARTHAGE = [1590, 1975];
const UTAH = [-700, 1880];

const Pin: React.FC<{p: number[]; at: number; label?: string; dx?: number; dy?: number}> = ({p, at, label, dx = 16, dy = -46}) => {
  const g = useGFrame();
  const pal = usePal();
  const hand = useHand();
  if (g < at) return null;
  const k = interpolate(g, [at, at + 3, at + 6], [0, 1.35, 1], clamp);
  return (
    <>
      <div style={{position: 'absolute', left: p[0] - 12, top: p[1] - 12, width: 24, height: 24, borderRadius: '50%', background: pal.mark, border: `4px solid ${INK}`, transform: `scale(${k})`}} />
      {label && <div style={{position: 'absolute', left: p[0] + dx, top: p[1] + dy, fontFamily: hand.family, fontSize: 40 * hand.scale, color: pal.mark, whiteSpace: 'nowrap',
        textShadow: '0 0 2px #111, 0 0 4px #111, 2px 2px 0 #111, -2px -2px 0 #111'}}>{label}</div>}
    </>
  );
};

const Opening: React.FC<{t: TL}> = ({t}) => {
  const g = useGFrame();
  return (
    <AbsoluteFill style={{background: '#0b0a08'}}>
      <DarkPaper />
      <Ember x={1500} y={300} at={-30} size={0.7} />
      <Note text="find the truth for themselves..." x={160} y={380} size={62} rot={-3} at={t.at('truth') - 4} />
      {g >= t.at('new truths') && <Highlight text="SOME VERY NEW TRUTHS" x={200} y={520} size={96} at={t.at('new truths')} seed={201} rot={-2} />}
    </AbsoluteFill>
  );
};

const Hydes: React.FC<{t: TL}> = ({t}) => {
  const frame = useCurrentFrame();
  const g = useGFrame();
  const pal = usePal();
  const s = interpolate(frame, [t.at('Take') - 2, t.at('Two')], [1.9, 2.3], clamp);
  const toS = mapToScreen(2930, 1640, s);
  const d = 'M' + DISTRICT.map(([x, y]) => `${x},${y}`).join(' L') + ' Z';
  return (
    <AbsoluteFill style={{background: '#15130f'}}>
      <MapView cx={2930} cy={1640} s={s}>
        <path d={d} fill={`${pal.mark}22`} stroke={pal.mark} strokeWidth={7} strokeLinejoin="round" opacity={g >= t.at('Burned-Over') ? 1 : 0.5} />
      </MapView>
      <AbsoluteFill style={{background: 'radial-gradient(ellipse at 50% 50%, transparent 45%, rgba(8,6,4,0.8) 100%)'}} />
      <Pin p={toS(HYDESVILLE)} at={t.at('Hydesville')} />
      {g >= t.at('1848') && <Highlight text="1848" x={120} y={100} size={110} at={t.at('1848')} seed={203} />}
      {g >= t.at('Hydesville') && <Highlight text="HYDESVILLE, N.Y." x={toS(HYDESVILLE)[0] - 200} y={toS(HYDESVILLE)[1] + 40} size={70} at={t.at('Hydesville')} seed={205} rot={-2} />}
      <Note text="right in the Burned-Over District" x={860} y={880} size={48} rot={-4} at={t.at('Burned-Over')} />
      <Tag text="Mitchell's Map of the United States, 1836 · Library of Congress" />
    </AbsoluteFill>
  );
};

const Sisters: React.FC<{t: TL}> = ({t}) => {
  const g = useGFrame();
  return (
    <AbsoluteFill>
      <DarkPaper />
      <Card src="img/ch03/fox_family.jpg" x={1150} y={90} w={600} rot={4} at={t.at('family') - 2} filter="grayscale(1) contrast(1.15)" />
      <Card src="img/ch03/fox_easterly.jpg" x={200} y={60} w={620} h={820} rot={-3} at={t.at('Two') - 1} filter="grayscale(1) contrast(1.15) brightness(1.05)" />
      {g >= t.at('Maggie') && <Highlight text="MAGGIE & KATE FOX" x={150} y={920} size={80} at={t.at('Maggie')} seed={207} rot={-2} />}
      <Note text="+ their family, in Hydesville" x={1120} y={930} size={48} rot={-3} at={t.at('family')} />
      <Tag text="Kate and Maggie Fox, daguerreotype by Thomas M. Easterly, 1852 · Fox family plate, 1905" y={40} />
    </AbsoluteFill>
  );
};

const Knocks: React.FC<{t: TL}> = ({t}) => {
  const frame = useCurrentFrame();
  const g = useGFrame();
  const pal = usePal();
  const z = interpolate(frame, [t.at('knocking') - 2, t.at('Word')], [1.02, 1.12], clamp);
  const kAt = [t.at('knocking'), t.at('knocks'), t.at('Once')];
  return (
    <AbsoluteFill style={{background: INK, overflow: 'hidden'}}>
      <Img src={staticFile('img/ch03/hydesville_house.jpg')} style={{position: 'absolute', left: 0, top: 0, width: 1920, height: 1080, objectFit: 'cover', filter: 'grayscale(1) contrast(1.25) brightness(0.55)', transform: `scale(${z})`}} />
      <AbsoluteFill style={{background: 'radial-gradient(ellipse at 50% 50%, transparent 30%, rgba(0,0,0,0.75) 100%)'}} />
      {kAt.map((a, i) => g >= a && g < a + 18 ? (
        <div key={i} style={{position: 'absolute', left: 300 + i * 480, top: 200 + (i % 2) * 90, fontFamily: JF.display, fontSize: 130, color: boxOf(pal),
          transform: `rotate(${i % 2 ? 6 : -6}deg) scale(${interpolate(g, [a, a + 3, a + 6], [1.4, 0.95, 1], clamp)})`, textShadow: '0 6px 20px rgba(0,0,0,0.8)'}}>KNOCK</div>
      ) : null)}
      <Note text="knock = yes" x={220} y={620} size={88} rot={-4} at={t.at('Once') + 2} />
      <Note text="silence = no" x={1000} y={700} size={88} rot={-3} at={t.at('Silence')} />
      {g >= t.at('spirit') && <Highlight text="“IT'S A SPIRIT.”" x={560} y={860} size={100} at={t.at('spirit')} seed={209} rot={-2} />}
      <Tag text="The Fox house, Hydesville (detail of a 1905 plate)" y={40} />
    </AbsoluteFill>
  );
};

const Spreads: React.FC<{t: TL}> = ({t}) => {
  const frame = useCurrentFrame();
  const g = useGFrame();
  const pal = usePal();
  const s = 3.0;
  const toS = mapToScreen(2846, 1600, s);
  const w0 = t.at('Word');
  const ripple = interpolate(g, [w0, w0 + 30], [0, 1], clamp);
  return (
    <AbsoluteFill style={{background: '#15130f'}}>
      <MapView cx={2846} cy={1600} s={s}>
        {ripple < 1 && [0, 1, 2].map((i) => <circle key={i} cx={HYDESVILLE[0]} cy={HYDESVILLE[1]} r={20 + (ripple * 150 + i * 30)} fill="none" stroke={pal.mark} strokeWidth={4} opacity={1 - ripple} />)}
      </MapView>
      <AbsoluteFill style={{background: 'radial-gradient(ellipse at 50% 50%, transparent 45%, rgba(8,6,4,0.8) 100%)'}} />
      <Pin p={toS(HYDESVILLE)} at={0} label="Hydesville" />
      <Pin p={toS(ROCHESTER)} at={t.at('Rochester')} label="Rochester" dx={-200} dy={-60} />
      <Arrow x1={toS(HYDESVILLE)[0] - 10} y1={toS(HYDESVILLE)[1] + 20} x2={toS(ROCHESTER)[0] + 18} y2={toS(ROCHESTER)[1] + 18} bow={30} at={t.at('moves')} />
      <Note text="word spreads..." x={140} y={140} size={64} rot={-4} at={w0} />
    </AbsoluteFill>
  );
};

const Seances: React.FC<{t: TL}> = ({t}) => {
  const g = useGFrame();
  const sp = t.at('Spiritualism');
  return (
    <AbsoluteFill>
      <DarkPaper />
      <Card src="img/ch03/knockings_art.jpg" x={120} y={110} w={640} rot={-3} at={t.at('séances') - 1} filter="grayscale(0.6) contrast(1.1)" />
      <Note text="séances — and people paid to attend" x={120} y={900} size={54} rot={-3} at={t.at('pay') - 4} out={sp} />
      <Card src="img/ch03/barnum_art.jpg" x={880} y={80} w={430} rot={3} at={t.at('P.T.') - 1} />
      <Card src="img/ch03/barnum_museum.jpg" x={1300} y={420} w={560} rot={-4} at={t.at('display') - 4} filter="grayscale(1) contrast(1.15)" />
      {g >= t.at('Barnum') && g < sp && <Highlight text="P.T. BARNUM" x={860} y={620} size={80} at={t.at('Barnum')} seed={211} rot={-3} />}
      <Note text="on display in New York City" x={1120} y={940} size={50} rot={-3} at={t.at('display')} out={sp} />
      {g >= sp && (
        <>
          <div style={{position: 'absolute', inset: 0, background: 'rgba(10,9,7,0.6)'}} />
          <Highlight text="SPIRITUALISM" x={330} y={400} size={140} at={sp} seed={213} rot={-2} />
          <div style={{position: 'absolute', left: 350, top: 600, width: 1200, fontFamily: JF.sans, fontWeight: 600, fontSize: 40, color: '#fff', background: 'rgba(10,10,10,0.8)', padding: '16px 26px',
            opacity: interpolate(g, [sp + 10, sp + 16], [0, 1], clamp)}}>
            <span style={{color: usePal().mark}}>spir·it·u·al·ism</span> · the belief that the dead can talk to the living
          </div>
        </>
      )}
      <Tag text="Rochester Knockings!, 1851 · P.T. Barnum, Brady studio · Barnum's American Museum, Gleason's Pictorial, 1853" y={40} />
    </AbsoluteFill>
  );
};

const War: React.FC<{t: TL}> = ({t}) => {
  const g = useGFrame();
  const pal = usePal();
  const tl0 = t.at('Think');
  const line = interpolate(g, [tl0 + 4, t.at('later')], [0, 1], clamp);
  return (
    <AbsoluteFill>
      <DarkPaper />
      <svg style={{position: 'absolute', left: 0, top: 0}} width={1920} height={1080}>
        <line x1={200} y1={170} x2={200 + 1500 * line} y2={170} stroke={pal.mark} strokeWidth={6} strokeLinecap="round" />
        <circle cx={200} cy={170} r={14} fill={pal.mark} />
        {line >= 1 && <circle cx={1700} cy={170} r={14} fill={pal.subject} />}
      </svg>
      <div style={{position: 'absolute', left: 150, top: 200, fontFamily: JF.display, fontSize: 56, color: '#fff'}}>1848</div>
      {line >= 1 && <div style={{position: 'absolute', left: 1640, top: 200, fontFamily: JF.display, fontSize: 56, color: pal.subject}}>1861</div>}
      <Note text="about a dozen years later..." x={640} y={80} size={52} rot={-2} at={t.at('dozen')} />
      {g >= t.at('Civil') && <Highlight text="THE CIVIL WAR" x={560} y={250} size={100} at={t.at('Civil')} seed={215} rot={-2} />}
      <Card src="img/ch03/soldier1_art.jpg" x={150} y={430} w={420} rot={-4} at={t.at('kills')} />
      <Card src="img/ch03/soldier2_art.jpg" x={740} y={450} w={400} rot={2} at={t.at('hundreds')} />
      <Card src="img/ch03/soldier3_art.jpg" x={1280} y={470} w={520} rot={-3} at={t.at('young men') - 2} />
      <Note text="hundreds of thousands of young men" x={180} y={960} size={52} rot={-2} at={t.at('hundreds')} out={t.at('Millions')} />
      <Note text="millions of grieving families" x={260} y={920} size={60} rot={-3} at={t.at('Millions')} out={t.at('explodes')} />
      {g >= t.at('explodes') && <Highlight text="SPIRITUALISM EXPLODES" x={420} y={900} size={96} at={t.at('explodes')} seed={217} rot={-2} />}
      <Tag text="Civil War tintypes and cartes de visite · Library of Congress" y={40} />
    </AbsoluteFill>
  );
};

const MaryLincoln: React.FC<{t: TL}> = ({t}) => {
  const g = useGFrame();
  return (
    <AbsoluteFill>
      <DarkPaper />
      <Card src="img/ch03/mary_lincoln_art.jpg" x={220} y={70} w={620} rot={-2} at={t.at('Mary') - 1} />
      {g >= t.at('Mary') && <Highlight text="MARY TODD LINCOLN" x={940} y={300} size={86} at={t.at('Mary')} seed={219} />}
      <Note text="séances — in the White House" x={940} y={470} size={54} rot={-3} at={t.at('séances', 2)} />
      <Note text="after her son died" x={1000} y={580} size={54} rot={-4} at={t.at('son') - 4} />
      <Tag text="Mary Todd Lincoln, Brady studio, 1861 · Library of Congress" y={40} />
    </AbsoluteFill>
  );
};

const Trick: React.FC<{t: TL}> = ({t}) => {
  const g = useGFrame();
  const c = t.at('cracking');
  return (
    <AbsoluteFill>
      <DarkPaper />
      <Note text="oh, and the knocking?" x={640} y={110} size={60} rot={-4} at={t.at('Oh')} />
      <Card src="img/ch03/deathblow_art.jpg" x={140} y={250} w={470} rot={-4} at={t.at('1888') - 1} filter="sepia(0.3) contrast(1.1)" />
      <Card src="img/ch03/deathblow_sig_art.jpg" x={600} y={250} w={520} rot={3} at={t.at('admitted') - 1} filter="sepia(0.3) contrast(1.15)" />
      <Loop cx={865} cy={748} rx={235} ry={62} tilt={3} at={t.at('stage')} dur={10} width={6} seed={241} />
      {g >= t.at('1888') && <Highlight text="1888" x={130} y={180} size={96} at={t.at('1888')} seed={221} />}
      {g >= t.at('trick') && <Highlight text="“IT WAS A TRICK.”" x={180} y={900} size={96} at={t.at('trick')} seed={223} rot={-2} />}
      <Card src="img/ch03/gray290_big.jpg" x={1180} y={300} w={700} rot={-2} at={c - 2} filter="contrast(1.2)" />
      <Loop cx={1805} cy={475} rx={105} ry={62} tilt={-10} at={t.at('toe')} dur={8} width={6} seed={243} />
      <Note text="crack!" x={1660} y={210} size={70} rot={8} at={t.at('toe')} />
      <Note text="her toe joints" x={1300} y={640} size={62} rot={-4} at={t.at('joints')} />
      <Tag text="The Death-Blow to Spiritualism, 1888, signed by Margaret Fox Kane and Catherine Fox Jencken · foot skeleton, Gray's Anatomy" y={40} />
    </AbsoluteFill>
  );
};

const Churches: React.FC<{t: TL}> = ({t}) => {
  const g = useGFrame();
  const pal = usePal();
  const col = (x: number, at: number, title: string, line1: string, line2: string, seed: number, a2: number, img: string, rot: number) => (
    <>
      <Card src={img} x={x + 60} y={170} w={330} rot={rot} at={at - 2} filter="grayscale(1) contrast(1.15)" />
      {g >= at && <Highlight text={title} x={x} y={600} size={84} at={at} seed={seed} rot={-2} />}
      <Note text={line1} x={x + 20} y={760} size={58} rot={-3} at={at + 8} />
      <Note text={line2} x={x + 40} y={850} size={58} rot={-2} at={a2} color={pal.subject} />
    </>
  );
  return (
    <AbsoluteFill>
      <DarkPaper />
      <Note text="new churches were popping up too" x={160} y={70} size={58} rot={-3} at={t.at('New churches')} />
      {col(140, t.at('Unitarians'), 'UNITARIANS', 'Jesus: a great teacher...', '...but not God', 225, t.at('not God'), 'img/ch03/channing.jpg', -3)}
      {col(1020, t.at('Universalists'), 'UNIVERSALISTS', 'everyone would', 'eventually be saved', 227, t.at('eventually'), 'img/ch03/ballou_art.jpg', 3)}
      <Tag text="Unitarian William Ellery Channing, by Gilbert Stuart, c. 1815 · Universalist Hosea Ballou, engraving, 1852" y={1030} />
    </AbsoluteFill>
  );
};

const Smith: React.FC<{t: TL}> = ({t}) => {
  const g = useGFrame();
  const pal = usePal();
  const j = t.at('Joseph');
  return (
    <AbsoluteFill>
      <DarkPaper />
      {g >= t.at('1830') && <Highlight text="1830" x={140} y={100} size={96} at={t.at('1830')} seed={229} />}
      <Card src="img/ch03/smith_maudsley.jpg" x={150} y={230} w={440} rot={-3} at={j - 1} filter="grayscale(1) contrast(1.1)" />
      {g >= j && <Highlight text="JOSEPH SMITH" x={140} y={830} size={76} at={j} seed={231} rot={-2} />}
      <Note text="profile drawn from life, 1842" x={170} y={950} size={42} rot={-2} at={j + 6} color="#ffffff" />
      <Note text="from the Burned-Over District, too" x={620} y={220} size={50} rot={-3} at={t.at('District', 2) - 6} />
      <Card src="img/ch03/bom_art.jpg" x={880} y={300} w={560} rot={3} at={t.at('published') - 1} filter="sepia(0.3) contrast(1.1)" />
      <Note text="he said: translated from golden plates" x={820} y={830} size={46} rot={-3} at={t.at('golden') - 4} color={boxOf(pal)} />
      <Tag text="Joseph Smith, profile by Sutcliffe Maudsley, 1842 · The Book of Mormon, first edition, Palmyra, 1830" y={40} />
    </AbsoluteFill>
  );
};

const Trek: React.FC<{t: TL}> = ({t}) => {
  const frame = useCurrentFrame();
  const g = useGFrame();
  const pal = usePal();
  const u0 = t.at('led');
  const k = interpolate(frame, [u0 - 6, t.at('Utah') + 6], [0, 1], {...clamp, easing: Easing.inOut(Easing.cubic)});
  const cx = 2100 + (700 - 2100) * k;
  const cy = 1880;
  const s = 0.72 - 0.26 * k;
  const toS = mapToScreen(cx, cy, s);
  const legs: [number[], number[], number][] = [
    [PALMYRA, KIRTLAND, t.at('Ohio')], [KIRTLAND, INDEPENDENCE, t.at('Missouri')], [INDEPENDENCE, NAUVOO, t.at('Illinois')], [NAUVOO, UTAH, u0],
  ];
  return (
    <AbsoluteFill style={{background: '#15130f'}}>
      <MapView cx={cx} cy={cy} s={s}>
        {legs.map(([a, b, at], i) => {
          const p = interpolate(g, [at - 4, at + (i === 3 ? 34 : 8)], [0, 1], clamp);
          if (p <= 0) return null;
          return <line key={i} x1={a[0]} y1={a[1]} x2={a[0] + (b[0] - a[0]) * p} y2={a[1] + (b[1] - a[1]) * p} stroke={pal.mark} strokeWidth={10 / s * 0.6}
            strokeLinecap="round" strokeDasharray={i === 3 ? `${40} ${30}` : undefined} />;
        })}
      </MapView>
      <Pin p={toS(PALMYRA)} at={t.at('York', 3)} label="New York" />
      <Pin p={toS(KIRTLAND)} at={t.at('Ohio')} label="Ohio" />
      <Pin p={toS(INDEPENDENCE)} at={t.at('Missouri')} label="Missouri" dx={-60} dy={30} />
      <Pin p={toS(NAUVOO)} at={t.at('Illinois')} label="Illinois" dx={-20} dy={-56} />
      {g >= t.at('mob') && (() => {
        const [x, y] = toS(CARTHAGE);
        return <div style={{position: 'absolute', left: x - 30, top: y - 44, fontFamily: JF.sans, fontWeight: 800, fontSize: 70, color: pal.subject, textShadow: '0 2px 8px #000'}}>✕</div>;
      })()}
      <Note text="Smith killed by a mob, 1844" x={toS(CARTHAGE)[0] + 30} y={toS(CARTHAGE)[1] + 30} size={48} rot={-3} at={t.at('mob')} out={u0} color={boxOf(pal)} />
      <Card src="img/ch03/carthage_art.jpg" x={780} y={720} w={470} rot={-3} at={t.at('mob') - 1} filter="grayscale(1) contrast(1.15)" />
      <Note text="chased west..." x={140} y={120} size={60} rot={-4} at={t.at('chased')} out={u0} />
      <Card src="img/ch03/brigham_young_art.jpg" x={1450} y={560} w={340} rot={4} at={t.at('Brigham') - 1} filter="grayscale(1) contrast(1.15)" />
      {g >= t.at('Brigham') && <Highlight text="BRIGHAM YOUNG" x={1300} y={960} size={64} at={t.at('Brigham')} seed={233} rot={-2} />}
      <Pin p={toS(UTAH)} at={t.at('Utah') - 2} />
      {g >= t.at('Utah') - 2 && <Highlight text="UTAH" x={toS(UTAH)[0] - 90} y={toS(UTAH)[1] + 36} size={90} at={t.at('Utah') - 2} seed={235} />}
      <Note text="off the edge of the 1836 map →" x={toS([200, 1500])[0]} y={toS([200, 1500])[1] - 200} size={40} rot={-4} at={u0 + 14} color="#ffffff" />
      <Tag text="Mitchell's Map of the United States, 1836 · Brigham Young, daguerreotype, 1853" />
    </AbsoluteFill>
  );
};

const Freedom: React.FC<{t: TL}> = ({t}) => {
  const frame = useCurrentFrame();
  const g = useGFrame();
  const pal = usePal();
  const r0 = t.at('Religious');
  const hl = interpolate(g, [t.at('freedom'), t.at('freedom') + 10], [0, 1], clamp);
  const z = interpolate(frame, [r0, t.at('newcomers')], [1.05, 1.15], clamp);
  return (
    <AbsoluteFill style={{background: INK, overflow: 'hidden'}}>
      <Img src={staticFile('img/ch03/bill_of_rights_art.jpg')} style={{position: 'absolute', inset: 0, width: 1920, height: 1080, objectFit: 'cover', filter: 'grayscale(0.4) brightness(0.45)', transform: `scale(${z})`}} />
      <div style={{position: 'absolute', left: 220, top: 260, width: 1480, fontFamily: '"Playfair Display", serif', fontWeight: 900, fontSize: 64, lineHeight: 1.3, color: '#f4efe6', textShadow: '0 3px 14px #000'}}>
        “Congress shall make no law respecting an establishment of religion, or prohibiting the{' '}
        <span style={{background: `linear-gradient(90deg, ${boxOf(pal)} ${hl * 100}%, transparent ${hl * 100}%)`, color: hl > 0.5 ? INK : '#f4efe6', padding: '0 8px'}}>free exercise thereof</span>...”
      </div>
      <Note text="— the First Amendment" x={1200} y={640} size={52} rot={-3} at={r0 + 10} />
      <Note text="...but new ways made a lot of Americans very uncomfortable" x={200} y={820} size={46} rot={-2} at={t.at('But when')} />
      <Tag text="The Bill of Rights, 1789 · National Archives" y={40} />
    </AbsoluteFill>
  );
};

const Boats: React.FC<{t: TL}> = ({t}) => {
  const frame = useCurrentFrame();
  const g = useGFrame();
  const n0 = t.at('nothing');
  const z = interpolate(frame, [n0, n0 + 150], [1.02, 1.12], clamp);
  return (
    <AbsoluteFill style={{background: INK, overflow: 'hidden'}}>
      <Img src={staticFile('img/ch03/emigrants_art.jpg')} style={{position: 'absolute', inset: 0, width: 1920, height: 1080, objectFit: 'cover', filter: 'grayscale(1) contrast(1.25)', transform: `scale(${z})`, transformOrigin: '60% 50%'}} />
      <AbsoluteFill style={{background: 'radial-gradient(ellipse at 50% 50%, transparent 45%, rgba(0,0,0,0.6) 100%)'}} />
      {g >= t.at('newcomers') && <Highlight text="THE NEWCOMERS" x={110} y={860} size={100} at={t.at('newcomers')} seed={237} rot={-2} />}
      <Tag text="Emigrants landing in New York, Harper's Weekly, 1858 · Library of Congress" y={40} />
    </AbsoluteFill>
  );
};

const Body: React.FC = () => {
  const frame = useCurrentFrame();
  const t = makeTimeline(N, 30);
  const at = t.at;
  const cuts: [number, React.ReactNode][] = [
    [0, <Opening t={t} />],
    [at('Take') - 1, <Hydes t={t} />],
    [at('Two') - 1, <Sisters t={t} />],
    [at('knocking') - 2, <Knocks t={t} />],
    [at('Word') - 1, <Spreads t={t} />],
    [at('The girls') - 1, <Seances t={t} />],
    [at('Think') - 1, <War t={t} />],
    [at('Mary') - 1, <MaryLincoln t={t} />],
    [at('Oh') - 1, <Trick t={t} />],
    [at('New churches') - 1, <Churches t={t} />],
    [at('And in') - 1, <Smith t={t} />],
    [at('His followers') - 1, <Trek t={t} />],
    [at('Religious') - 1, <Freedom t={t} />],
    [at('And nothing') - 1, <Boats t={t} />],
  ];
  const scene = cuts.reduce((acc, [f, node]) => (frame >= f ? node : acc), cuts[0][1]);
  const end = Math.ceil(N.duration * 30);
  return (
    <AbsoluteFill>
      {scene}
      <Finish vignette={0.3} />
      <Audio src={staticFile('audio/ch03_knock_once.wav')} />
      <Audio src={staticFile('music/spirits.mp3')} volume={(f) => interpolate(f, [0, 20, end - 20, end + 30], [0, 0.15, 0.15, 0], clamp)} />
      {cuts.slice(1).map(([f], i) => <Sfx key={i} at={f} src="sfx/whoosh.wav" volume={0.28} />)}
      {[at('knocking'), at('knocks'), at('Once')].map((f, i) => <Sfx key={`k${i}`} at={f} src="sfx/knock.wav" volume={0.5} />)}
      {['new truths', '1848', 'Hydesville', 'Maggie', 'spirit', 'Barnum', 'Spiritualism', 'Civil', 'explodes', 'Mary', '1888', 'trick', 'Unitarians', 'Universalists', '1830', 'Joseph', 'Brigham', 'Utah', 'newcomers'].map((c) => (
        <Sfx key={c} at={at(c)} src="sfx/stamp.wav" volume={0.26} />
      ))}
      {['truth', 'family', 'Silence', 'pay', 'display', 'dozen', 'hundreds', 'Millions', 'son', 'admitted', 'toe', 'not God', 'eventually', 'golden', 'mob', 'But when'].map((c) => (
        <Sfx key={c} at={at(c) - 2} src={WRITE.src} volume={WRITE.volume} />
      ))}
      {[at('Rochester'), at('York', 3), at('Ohio'), at('Missouri'), at('Illinois')].map((f, i) => <Sfx key={`p${i}`} at={f} src="sfx/tick.wav" volume={0.45} />)}
    </AbsoluteFill>
  );
};

export const Ch03: React.FC = () => (
  <PaletteCtx.Provider value={PALETTES.locked}>
    <StepCtx.Provider value={2.5}>
      <Body />
    </StepCtx.Provider>
  </PaletteCtx.Provider>
);
