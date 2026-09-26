// Chapter 8 · Behind the Curtain
import React from 'react';
import {AbsoluteFill, Audio, Easing, Img, interpolate, random, staticFile, useCurrentFrame} from 'remotion';
import words from '../../public/audio/ch08_curtain.words.json';
import curtain from '../../public/img/jh/masks/ch08_behind_curtain.json';
import dix from '../../public/img/jh/masks/dix.json';
import {clamp} from '../lib/anim';
import {makeTimeline, type Narration} from '../lib/timing';
import {boxOf, ColourReveal, Finish, Highlight, INK, JF, Loop, MaskData, Note, PALETTES, PaletteCtx, Picture, Place, StepCtx, Tag, Tint, Traced, useGFrame, usePal} from '../jh/Kit';
import {Card, DarkPaper, MapView, mapToScreen, Sfx, WRITE} from './common';

const N = words as Narration;
const CU = curtain as unknown as MaskData;
const D = dix as unknown as MaskData;
export const CH08_FRAMES = Math.ceil(N.duration * 30) + 30;
type TL = ReturnType<typeof makeTimeline>;
const GEN: [number, number] = [1376, 768];

const fill = (size: [number, number], fx: number, fy: number, z: number): Place => {
  const sc = Math.max(1920 / size[0], 1080 / size[1]) * z;
  return {left: Math.min(0, Math.max(1920 - size[0] * sc, 960 - fx * sc)), top: Math.min(0, Math.max(1080 - size[1] * sc, 540 - fy * sc)), scale: sc};
};

const Strike: React.FC<{x: number; y: number; w: number; at: number}> = ({x, y, w, at}) => {
  const g = useGFrame();
  const pal = usePal();
  if (g < at) return null;
  const p = interpolate(g, [at, at + 5], [0, 1], clamp);
  return (
    <svg style={{position: 'absolute', left: 0, top: 0, overflow: 'visible'}} width={1920} height={1080}>
      <path d={`M${x},${y + 6} Q${x + w / 2},${y - 8} ${x + w},${y}`} fill="none" stroke={boxOf(pal)} strokeWidth={9} strokeLinecap="round" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - p} />
    </svg>
  );
};

const Recall: React.FC<{t: TL}> = ({t}) => {
  const place: Place = {left: 1080, top: 150, scale: 930 / D.size[1]};
  return (
    <AbsoluteFill>
      <DarkPaper />
      <Picture src="img/jh/dix_cut.png" place={place} size={D.size} bw="grayscale(1) contrast(1.1)" style={{filter: 'grayscale(1) contrast(1.1) drop-shadow(0 20px 30px rgba(0,0,0,0.7))'}} />
      <Traced paths={D.shapes.magenta} place={place} at={2} dur={12} width={5} part={0.92} />
      <Note text="notice something about Dorothea Dix?" x={120} y={300} size={58} rot={-3} at={t.at('Notice')} />
      <Note text="she did all this without a vote." x={150} y={420} size={62} rot={-3} at={t.at('without')} color={boxOf(usePal())} />
    </AbsoluteFill>
  );
};

const Coverture: React.FC<{t: TL}> = ({t}) => {
  const g = useGFrame();
  const pal = usePal();
  const cv = t.at('coverture');
  const rights: [string, string, number][] = [['own property', 'own', 360], ['keep her own paycheck', 'keep', 450], ['sign a contract', 'sign', 540], ['sue in court', 'sue', 630]];
  return (
    <AbsoluteFill>
      <DarkPaper />
      <Card src="img/ch01/marriage_art.jpg" x={1340} y={120} w={460} rot={3} at={t.at('married') - 2} />
      <Note text="once a woman got married..." x={110} y={90} size={56} rot={-3} at={t.at('married')} />
      <Note text="the law basically erased her." x={140} y={170} size={56} rot={-3} at={t.at('erased')} color={boxOf(pal)} />
      {g >= cv && <Highlight text="COVERTURE" x={100} y={250} size={84} at={cv} seed={701} rot={-2} />}
      <Note text="she couldn't:" x={120} y={380 - 30} size={44} rot={-2} at={t.at("couldn't")} color="#ffffff" />
      {rights.map(([txt, cue, y]) => (
        <React.Fragment key={cue}>
          <Note text={txt} x={160} y={y + 40} size={54} rot={-2} at={t.at(cue)} />
          <Strike x={150} y={y + 84} w={txt.length * 25} at={t.at(cue) + 6} />
        </React.Fragment>
      ))}
      <Note text="legally: one person" x={1100} y={720} size={62} rot={-3} at={t.at('one person')} />
      {g >= t.at('him') && <Highlight text="…HIM." x={1180} y={830} size={120} at={t.at('him')} seed={703} rot={-3} />}
      <Tag text="N. Currier, The Day Before Marriage, 1847 · Library of Congress" y={1030} />
    </AbsoluteFill>
  );
};

const Reformers: React.FC<{t: TL}> = ({t}) => {
  const g = useGFrame();
  const pal = usePal();
  return (
    <AbsoluteFill>
      <DarkPaper />
      <Note text="many of the most active reformers were women" x={110} y={80} size={54} rot={-3} at={t.at('reformers')} />
      <Card src="img/ch05/family_pledge_art.jpg" x={120} y={220} w={420} rot={-3} at={t.at('temperance') - 2} />
      <Note text="temperance societies" x={130} y={820} size={48} rot={-2} at={t.at('temperance')} />
      <Card src="img/ch01/mott_art.jpg" x={740} y={200} w={420} rot={2} at={t.at('raised') - 2} />
      <Note text="raised money" x={780} y={820} size={48} rot={-2} at={t.at('raised')} />
      <Card src="img/ch01/slavery_art.jpg" x={1340} y={220} w={420} rot={-2} at={t.at('speeches') - 2} />
      <Note text="speeches against slavery" x={1250} y={820} size={48} rot={-2} at={t.at('speeches')} />
      {g >= t.at('wait') && (
        <>
          <div style={{position: 'absolute', inset: 0, background: 'rgba(10,9,7,0.72)'}} />
          <Note text="wait..." x={260} y={330} size={80} rot={-3} at={t.at('wait')} />
          <Note text="we're fighting for everyone's freedom" x={300} y={460} size={66} rot={-3} at={t.at('fighting')} />
          {g >= t.at('but our') && <Highlight text="…BUT OUR OWN?" x={560} y={600} size={110} at={t.at('but our')} seed={705} rot={-2} />}
        </>
      )}
      <Tag text="Temperance family pledge, 1848 · Lucretia Mott, portrait by Joseph Kyle, 1842 (CC BY) · anti-slavery emblem, 1837" y={1030} />
    </AbsoluteFill>
  );
};

/** London, 1840: the women seated behind the curtain (Gemini illustration). */
const London: React.FC<{t: TL}> = ({t}) => {
  const frame = useCurrentFrame();
  const g = useGFrame();
  const l0 = t.at('In 1840');
  const k = interpolate(frame, [l0, t.at('behind') - 4], [0, 1], {...clamp, easing: Easing.inOut(Easing.cubic)});
  const place = fill(GEN, 560 + 420 * k, 380 + 60 * k, 1.02 + 0.28 * k);
  const cAt = t.at('curtain');
  return (
    <AbsoluteFill style={{background: INK, overflow: 'hidden'}}>
      <Picture src="img/gen/ch08_behind_curtain.jpg" place={place} size={GEN} bw="grayscale(1) contrast(1.2)" />
      {g >= t.at('behind') - 2 && <Tint mask="img/jh/masks/ch08_behind_curtain_magenta_a.png" place={place} size={GEN} />}
      <Traced paths={CU.shapes.green} place={place} at={cAt - 2} dur={10} width={6} />
      <Traced paths={CU.shapes.magenta} place={place} at={t.at('watch') - 4} dur={12} width={4} part={0.9} />
      {g >= t.at('1840') && g < t.at('behind') && <Highlight text="LONDON, 1840" x={90} y={80} size={80} at={t.at('1840')} seed={707} />}
      <Card src="img/ch08/stanton.jpg" x={110} y={230} w={250} rot={-3} at={t.at('Elizabeth') - 1} />
      <Card src="img/ch01/mott_art.jpg" x={380} y={240} w={250} rot={3} at={t.at('Lucretia') - 1} />
      <Note text="Stanton & Mott" x={140} y={620} size={52} rot={-3} at={t.at('Stanton')} out={t.at('men voted')} />
      <Note text="the World Anti-Slavery Convention" x={120} y={700} size={46} rot={-2} at={t.at('anti-slavery')} out={t.at('men voted')} />
      <Note text="the men voted not to seat them" x={100} y={100} size={56} rot={-2} at={t.at('men voted')} out={t.at('At a')} />
      {g >= cAt && g < t.at('At a') && <Highlight text="BEHIND A CURTAIN" x={100} y={190} size={80} at={cAt} seed={709} />}
      {g >= t.at('At a') && <Highlight text="AT A CONVENTION ABOUT FREEDOM." x={90} y={100} size={72} at={t.at('At a')} seed={711} rot={-1} />}
      <Tag text="Illustration · women delegates seated behind a curtain, World Anti-Slavery Convention, London, 1840 · Stanton with two of her sons, 1848 · Mott, 1842" />
    </AbsoluteFill>
  );
};

const DISTRICT = [[2760, 1640], [2790, 1575], [2880, 1560], [2990, 1550], [3060, 1555], [3140, 1585], [3150, 1640], [3120, 1700], [3000, 1725], [2860, 1730], [2770, 1705]];
const SENECA = [2945, 1625];

const Seneca: React.FC<{t: TL}> = ({t}) => {
  const frame = useCurrentFrame();
  const g = useGFrame();
  const pal = usePal();
  const s0 = t.at('They were');
  const k = interpolate(frame, [s0, t.at('Seneca')], [0, 1], {...clamp, easing: Easing.inOut(Easing.cubic)});
  const s = 0.6 + 1.6 * k;
  const cx = 3000 - 50 * k;
  const cy = 1900 - 270 * k;
  const S = mapToScreen(cx, cy, s);
  const d = 'M' + DISTRICT.map(([x, y]) => `${x},${y}`).join(' L') + ' Z';
  const dAt = t.at('Burned-Over');
  const [px, py] = S(SENECA);
  return (
    <AbsoluteFill style={{background: '#15130f'}}>
      <MapView cx={cx} cy={cy} s={s}>
        {g >= dAt && <path d={d} fill={`${pal.mark}22`} stroke={pal.mark} strokeWidth={7 / s * 1.5} strokeLinejoin="round" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - interpolate(g, [dAt, dAt + 14], [0, 1], clamp)} />}
      </MapView>
      <AbsoluteFill style={{background: 'radial-gradient(ellipse at 50% 50%, transparent 45%, rgba(8,6,4,0.8) 100%)'}} />
      <Note text="they were furious." x={110} y={100} size={62} rot={-3} at={t.at('furious')} out={t.at('1848')} />
      {g >= t.at('1848') && <Highlight text="1848" x={100} y={90} size={110} at={t.at('1848')} seed={713} />}
      {g >= t.at('Seneca') - 2 && <div style={{position: 'absolute', left: px - 13, top: py - 13, width: 26, height: 26, borderRadius: '50%', background: pal.mark, border: `4px solid ${INK}`}} />}
      {g >= t.at('Seneca') && <Highlight text="SENECA FALLS, N.Y." x={px - 280} y={py + 40} size={72} at={t.at('Seneca')} seed={715} rot={-2} />}
      <Note text="...also in the Burned-Over District" x={920} y={880} size={52} rot={-3} at={t.at('yep')} />
      <Tag text="Mitchell's Map of the United States, 1836 · Library of Congress" />
    </AbsoluteFill>
  );
};

/** The Declaration of Independence, with two words written in. */
const Sentiments: React.FC<{t: TL}> = ({t}) => {
  const frame = useCurrentFrame();
  const g = useGFrame();
  const pal = usePal();
  const d0 = t.at('Stanton wrote');
  const k = interpolate(frame, [t.at('Declaration'), t.at('We hold')], [0, 1], {...clamp, easing: Easing.inOut(Easing.cubic)});
  const s = 0.47 + 1.33 * k;
  const cx = 960 + (1000 - 960) * k;
  const cy = 1140 + (440 - 1140) * k;
  const L = (x: number) => 960 + (x - cx) * s;
  const T = (y: number) => 540 + (y - cy) * s;
  const ins = t.at('and women');
  return (
    <AbsoluteFill style={{background: '#0d0c09', overflow: 'hidden'}}>
      <Img src={staticFile('img/ch08/declaration.jpg')} style={{position: 'absolute', left: L(0), top: T(0), width: 1920 * s, filter: 'sepia(0.35) contrast(1.1) brightness(0.95)'}} />
      <AbsoluteFill style={{background: 'radial-gradient(ellipse at 50% 50%, transparent 35%, rgba(0,0,0,0.75) 100%)'}} />
      <Card src="img/ch08/sf_report.jpg" x={120} y={140} w={260} rot={-4} at={d0} filter="grayscale(1) contrast(1.2)" />
      <Note text="written to sound like..." x={430} y={120} size={54} rot={-3} at={t.at('purpose')} out={t.at('We hold')} />
      {g >= t.at('Declaration') && g < t.at('We hold') && <Highlight text="THE DECLARATION OF INDEPENDENCE" x={420} y={200} size={64} at={t.at('Declaration')} seed={717} />}
      <Note text="...with one little change" x={450} y={320} size={54} rot={-3} at={t.at('change')} out={t.at('We hold')} />
      {g >= t.at('We hold') && (
        <div style={{position: 'absolute', left: 150, top: 700, width: 1640, fontFamily: '"Playfair Display", serif', fontWeight: 900, fontSize: 70, lineHeight: 1.25, color: '#f4efe6',
          background: 'rgba(12,10,8,0.82)', padding: '22px 34px', boxShadow: '0 20px 50px rgba(0,0,0,0.6)'}}>
          “We hold these truths to be self-evident: that all men{' '}
          <span style={{color: boxOf(pal), opacity: interpolate(g, [ins - 2, ins + 3], [0, 1], clamp)}}>and women</span>{' '}are created equal.”
        </div>
      )}
      {g >= ins - 2 && <Note text="^ and women" x={900} y={610} size={70} rot={-6} at={ins - 2} dur={8} color={pal.mark} />}
      <Tag text="Declaration of Independence (1823 Stone facsimile) · Report of the Woman's Rights Convention, Seneca Falls, 1848 (title page)" y={40} />
    </AbsoluteFill>
  );
};

const Vote: React.FC<{t: TL}> = ({t}) => {
  const g = useGFrame();
  const pal = usePal();
  return (
    <AbsoluteFill>
      <DarkPaper />
      <Note text="the most controversial demand of all:" x={110} y={100} size={54} rot={-3} at={t.at('controversial')} />
      {g >= t.at('right to') && <Highlight text="THE RIGHT TO VOTE" x={100} y={190} size={100} at={t.at('right to')} seed={719} rot={-2} />}
      <Note text="“too far,” said some in the room" x={120} y={380} size={56} rot={-3} at={t.at('too far')} />
      <Note text="it passed — barely —" x={140} y={480} size={62} rot={-3} at={t.at('passed')} color={boxOf(pal)} />
      <Card src="img/ch08/douglass.jpg" x={1180} y={130} w={560} rot={3} at={t.at('Frederick') - 2} filter="grayscale(1) contrast(1.1)" />
      {g >= t.at('Frederick') && <Highlight text="FREDERICK DOUGLASS" x={120} y={640} size={80} at={t.at('Frederick')} seed={721} />}
      <Note text="stood up and argued for it" x={150} y={790} size={56} rot={-3} at={t.at('stood')} />
      <Tag text="Frederick Douglass, daguerreotype by Samuel J. Miller, 1847–52 · Art Institute of Chicago" y={1030} />
    </AbsoluteFill>
  );
};

const Years: React.FC<{t: TL}> = ({t}) => {
  const g = useGFrame();
  const pal = usePal();
  const y0 = t.at("Women wouldn't");
  const line = interpolate(g, [y0 + 2, t.at('72') + 4], [0, 1], clamp);
  const s0 = t.at('100');
  const fade = t.at('only');
  return (
    <AbsoluteFill>
      <DarkPaper />
      <svg style={{position: 'absolute', left: 0, top: 0}} width={1920} height={1080}>
        <line x1={200} y1={200} x2={200 + 1520 * line} y2={200} stroke={pal.mark} strokeWidth={7} strokeLinecap="round" />
        <circle cx={200} cy={200} r={14} fill={pal.mark} />
        {line >= 1 && <circle cx={1720} cy={200} r={14} fill={boxOf(pal)} />}
      </svg>
      <div style={{position: 'absolute', left: 150, top: 230, fontFamily: JF.display, fontSize: 56, color: '#fff'}}>1848</div>
      {line >= 1 && <div style={{position: 'absolute', left: 1650, top: 230, fontFamily: JF.display, fontSize: 56, color: boxOf(pal)}}>1920</div>}
      {g >= t.at('72') && <Highlight text="72 YEARS" x={760} y={90} size={70} at={t.at('72')} seed={723} />}
      <Note text="100 people signed at Seneca Falls" x={120} y={380} size={54} rot={-2} at={s0} />
      {g >= s0 && Array.from({length: 100}).map((_, i) => {
        const col = i % 20;
        const row = Math.floor(i / 20);
        const survivor = i === 57;
        const gone = interpolate(g, [fade + (random(`f${i}`) * 30), fade + 8 + (random(`f${i}`) * 30)], [1, 0.12], clamp);
        const appear = interpolate(g, [s0 + i * 0.25, s0 + i * 0.25 + 3], [0, 1], clamp);
        return <div key={i} style={{position: 'absolute', left: 130 + col * 52, top: 500 + row * 56, width: 30, height: 30, borderRadius: '50%',
          background: survivor ? pal.mark : '#EDE7DC', opacity: appear * (survivor ? 1 : gone), boxShadow: survivor && g >= fade ? `0 0 20px 6px ${pal.mark}` : undefined}} />;
      })}
      <Note text="only one lived to 1920:" x={1260} y={500} size={44} rot={-3} at={t.at('only')} />
      {g >= t.at('Charlotte') && <Highlight text="CHARLOTTE WOODWARD" x={1230} y={600} size={50} at={t.at('Charlotte')} seed={725} rot={-2} />}
      <Tag text="Report of the Woman's Rights Convention, Seneca Falls, 1848: 100 signers of the Declaration of Sentiments" y={1030} />
    </AbsoluteFill>
  );
};

const Body: React.FC = () => {
  const frame = useCurrentFrame();
  const t = makeTimeline(N, 30);
  const at = t.at;
  const cuts: [number, React.ReactNode][] = [
    [0, <Recall t={t} />],
    [at('In fact') - 1, <Coverture t={t} />],
    [at('Now') - 1, <Reformers t={t} />],
    [at('In 1840') - 1, <London t={t} />],
    [at('They were') - 1, <Seneca t={t} />],
    [at('Stanton wrote') - 1, <Sentiments t={t} />],
    [at('Then came') - 1, <Vote t={t} />],
    [at("Women wouldn't") - 1, <Years t={t} />],
  ];
  const scene = cuts.reduce((acc, [f, node]) => (frame >= f ? node : acc), cuts[0][1]);
  const end = Math.ceil(N.duration * 30);
  return (
    <AbsoluteFill>
      {scene}
      <Finish vignette={0.3} />
      <Audio src={staticFile('audio/ch08_curtain.wav')} />
      <Audio src={staticFile('music/curtain.mp3')} volume={(f) => interpolate(f, [0, 20, end - 20, end + 30], [0, 0.15, 0.15, 0], clamp)} />
      {cuts.slice(1).map(([f], i) => <Sfx key={i} at={f} src="sfx/whoosh.wav" volume={0.28} />)}
      {['coverture', 'him', 'but our', '1840', 'curtain', 'At a', '1848', 'Seneca', 'Declaration', 'right to', 'Frederick', '72', 'Charlotte'].map((c) => <Sfx key={c} at={at(c)} src="sfx/stamp.wav" volume={0.26} />)}
      {['Notice', 'without', 'married', 'erased', 'own', 'keep', 'sign', 'sue', 'one person', 'reformers', 'wait', 'fighting', 'men voted', 'furious', 'yep', 'purpose', 'change', 'and women', 'controversial', 'too far', 'passed', 'stood', '100', 'only'].map((c) => (
        <Sfx key={c} at={at(c) - 2} src={WRITE.src} volume={WRITE.volume} />
      ))}
    </AbsoluteFill>
  );
};

export const Ch08: React.FC = () => (
  <PaletteCtx.Provider value={PALETTES.locked}>
    <StepCtx.Provider value={2.5}>
      <Body />
    </StepCtx.Provider>
  </PaletteCtx.Provider>
);
