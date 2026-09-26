// Chapter 7 · The Great Equalizer
import React from 'react';
import {AbsoluteFill, Audio, Img, interpolate, staticFile, useCurrentFrame} from 'remotion';
import words from '../../public/audio/ch07_equalizer.words.json';
import {clamp} from '../lib/anim';
import {makeTimeline, type Narration} from '../lib/timing';
import {Arrow, boxOf, Finish, Highlight, INK, JF, Loop, Note, PALETTES, PaletteCtx, StepCtx, Tag, useGFrame, usePal} from '../jh/Kit';
import {Card, DarkPaper, Sfx, WRITE} from './common';

const N = words as Narration;
export const CH07_FRAMES = Math.ceil(N.duration * 30) + 30;
type TL = ReturnType<typeof makeTimeline>;

const Check: React.FC<{x: number; y: number; at: number; text: string; size?: number}> = ({x, y, at, text, size = 60}) => {
  const g = useGFrame();
  const pal = usePal();
  if (g < at) return null;
  const k = interpolate(g, [at, at + 3, at + 6], [0, 1.3, 1], clamp);
  return (
    <div style={{position: 'absolute', left: x, top: y, display: 'flex', alignItems: 'center', gap: 22}}>
      <div style={{fontFamily: JF.sans, fontWeight: 800, fontSize: size, color: pal.mark, transform: `scale(${k})`, lineHeight: 1}}>✓</div>
      <div style={{fontFamily: JF.display, fontSize: size, color: '#f4efe6', lineHeight: 1, textShadow: '0 4px 14px rgba(0,0,0,0.7)', opacity: interpolate(g, [at + 1, at + 4], [0, 1], clamp)}}>{text}</div>
    </div>
  );
};

const Opener: React.FC<{t: TL}> = ({t}) => {
  const frame = useCurrentFrame();
  const g = useGFrame();
  const z = interpolate(frame, [0, t.at('In the')], [1.04, 1.1], clamp);
  return (
    <AbsoluteFill style={{background: INK, overflow: 'hidden'}}>
      <Img src={staticFile('img/ch07/country_school.jpg')} style={{position: 'absolute', inset: 0, width: 1920, height: 1080, objectFit: 'cover', filter: 'grayscale(1) contrast(1.15)', transform: `scale(${z})`}} />
      <AbsoluteFill style={{background: 'radial-gradient(ellipse at 50% 50%, transparent 40%, rgba(0,0,0,0.65) 100%)'}} />
      <Note text="here's a fun one..." x={110} y={110} size={60} rot={-3} at={t.at('fun')} />
      <Note text="you're living inside it right now" x={140} y={200} size={60} rot={-3} at={t.at('living')} />
      <Tag text="Winslow Homer, Country School, 1871 (later depiction) · Saint Louis Art Museum" y={1030} />
    </AbsoluteFill>
  );
};

const Mess: React.FC<{t: TL}> = ({t}) => {
  const g = useGFrame();
  const pal = usePal();
  return (
    <AbsoluteFill>
      <DarkPaper />
      {g >= t.at('early') && <Highlight text="EARLY 1800s" x={100} y={70} size={70} at={t.at('early')} seed={601} />}
      {g >= t.at('mess') && <Highlight text="SCHOOL WAS A MESS." x={560} y={70} size={70} at={t.at('mess')} seed={603} rot={-1} />}
      <Note text="rich?" x={120} y={260} size={70} rot={-3} at={t.at('rich')} />
      <Note text="→ a private tutor" x={140} y={360} size={62} rot={-3} at={t.at('tutor')} color={boxOf(pal)} />
      <Note text="everyone else?" x={120} y={520} size={70} rot={-3} at={t.at('If not')} />
      <Card src="img/ch07/country_school.jpg" x={840} y={230} w={560} rot={-3} at={t.at('one-room') - 2} />
      <Note text="a one-room schoolhouse" x={140} y={630} size={56} rot={-2} at={t.at('one-room')} />
      <Note text="a few months a year" x={160} y={710} size={56} rot={-2} at={t.at('months')} />
      <Card src="img/ch07/nooning_art.jpg" x={1260} y={450} w={560} rot={3} at={t.at('needed') - 2} />
      <Note text="...when you weren't needed on the farm" x={560} y={900} size={54} rot={-2} at={t.at('needed')} color={boxOf(pal)} />
      <Tag text="Winslow Homer, Country School, 1871 · after W. S. Mount, Farmers Nooning, engraving 1843" y={1030} />
    </AbsoluteFill>
  );
};

const Mann: React.FC<{t: TL}> = ({t}) => {
  const g = useGFrame();
  const pal = usePal();
  const w = 560;
  const logic = t.at('More and');
  return (
    <AbsoluteFill>
      <DarkPaper />
      <Card src="img/ch07/mann_art.jpg" x={120} y={120} w={w} rot={-3} at={t.at('Horace') - 1} filter="grayscale(1) contrast(1.25) brightness(1.1)" />
      <Loop cx={120 + w * 0.56} cy={120 + w * 1.31 * 0.34} rx={150} ry={185} tilt={-6} at={t.at('Horace') + 4} dur={10} width={6} seed={605} />
      {g >= t.at('Horace') && <Highlight text="HORACE MANN" x={760} y={120} size={90} at={t.at('Horace')} seed={607} />}
      <Note text="head of education, Massachusetts" x={790} y={270} size={50} rot={-2} at={t.at('head')} out={logic} />
      <Note text="thought that was..." x={800} y={360} size={56} rot={-3} at={t.at('thought')} out={logic} />
      {g >= t.at('dangerous') && g < logic && <Highlight text="DANGEROUS" x={820} y={460} size={110} at={t.at('dangerous')} seed={609} rot={-3} />}
      <Note text="more and more men could vote" x={790} y={290} size={54} rot={-2} at={logic} />
      <Arrow x1={1000} y1={370} x2={1010} y2={450} bow={14} at={t.at('voters') - 6} />
      <Note text="voters who can't read" x={820} y={460} size={60} rot={-3} at={t.at('voters')} />
      <Arrow x1={1030} y1={550} x2={1040} y2={630} bow={-14} at={t.at('easy') - 8} />
      {g >= t.at('easy') && <Highlight text="EASY TO FOOL." x={800} y={650} size={100} at={t.at('easy')} seed={611} rot={-2} />}
      <Tag text="Horace Mann, daguerreotype, Brady studio, c. 1844–50 · Library of Congress" y={1030} />
    </AbsoluteFill>
  );
};

const Common: React.FC<{t: TL}> = ({t}) => {
  const g = useGFrame();
  const pal = usePal();
  const q = t.at('the great');
  return (
    <AbsoluteFill>
      <DarkPaper />
      {g < q && (
        <>
          {g >= t.at('common') && <Highlight text="“COMMON SCHOOLS”" x={100} y={80} size={96} at={t.at('common')} seed={613} />}
          <Check x={140} y={280} at={t.at('free')} text="free" />
          <Check x={140} y={380} at={t.at('public', 1)} text="public" />
          <Check x={140} y={480} at={t.at('taxes')} text="paid for by taxes" />
          <Note text="+ trained teachers" x={1000} y={300} size={58} rot={-3} at={t.at('trained')} />
          <Note text="+ longer school years" x={1020} y={400} size={58} rot={-3} at={t.at('longer')} />
          <Note text="+ better buildings" x={1040} y={500} size={58} rot={-3} at={t.at('better')} />
          <Card src="img/ch07/country_school.jpg" x={700} y={640} w={480} rot={2} at={t.at('He wanted')} />
        </>
      )}
      {g >= q - 8 && (
        <AbsoluteFill>
          <Note text="he called education..." x={160} y={220} size={58} rot={-3} at={q - 8} />
          <div style={{position: 'absolute', left: 160, top: 340, width: 1600, fontFamily: '"Playfair Display", serif', fontWeight: 900, fontSize: 104, lineHeight: 1.15, color: '#f4efe6'}}>
            {['“the', 'great', 'equalizer', 'of', 'the', 'conditions', 'of', 'men.”'].map((w, i) => {
              const wd = N.words[t.idx('the great') + i];
              const on = interpolate(g, [wd.s * 30 - 3, wd.s * 30 + 1], [0.12, 1], clamp);
              const key = w === 'great' || w === 'equalizer';
              return <span key={i} style={{opacity: on, color: key ? boxOf(pal) : undefined}}>{w} </span>;
            })}
          </div>
          <div style={{position: 'absolute', left: 170, top: 640, fontFamily: JF.mono, fontSize: 26, letterSpacing: 3, color: 'rgba(237,231,220,0.75)', opacity: interpolate(g, [t.at('men') , t.at('men') + 6], [0, 1], clamp)}}>
            — HORACE MANN, TWELFTH ANNUAL REPORT, 1848
          </div>
        </AbsoluteFill>
      )}
    </AbsoluteFill>
  );
};

const Objections: React.FC<{t: TL}> = ({t}) => {
  const g = useGFrame();
  const pal = usePal();
  return (
    <AbsoluteFill>
      <DarkPaper />
      <Note text="not everyone loved it." x={110} y={80} size={62} rot={-3} at={t.at('Not everyone')} />
      <Note text="1. rich families: no taxes for poor kids' schooling" x={120} y={200} size={44} rot={-2} at={t.at('Rich')} />
      <Note text="2. farmers: we need the kids working" x={120} y={290} size={44} rot={-2} at={t.at('Farmers')} />
      <Card src="img/ch07/nooning_art.jpg" x={1380} y={120} w={430} rot={4} at={t.at('Farmers') - 1} />
      <Note text="3. Catholic families:" x={120} y={400} size={48} rot={-2} at={t.at('Catholic')} />
      <Card src="img/ch07/riot_art.jpg" x={120} y={500} w={660} rot={-2} at={t.at('Protestant') - 4} />
      <Note text="“public” schools taught" x={840} y={530} size={48} rot={-3} at={t.at('taught')} color={boxOf(pal)} />
      <Note text="from a Protestant Bible" x={870} y={600} size={48} rot={-3} at={t.at('Protestant')} color={boxOf(pal)} />
      {g >= t.at('parish') && <Highlight text="→ CATHOLIC PARISH SCHOOLS" x={830} y={700} size={60} at={t.at('parish')} seed={615} rot={-2} />}
      <Note text="Philadelphia, 1844: a fight over the Bible" x={840} y={830} size={36} rot={-2} at={t.at('spread')} color="#ffffff" />
      <Note text="in schools turned into riots" x={870} y={885} size={36} rot={-2} at={t.at('spread') + 6} color="#ffffff" />
      <Tag text="“Riot in Philadelphia, July 7th 1844,” lithograph · after W. S. Mount, Farmers Nooning · Library of Congress" y={1030} />
    </AbsoluteFill>
  );
};

const Blame: React.FC<{t: TL}> = ({t}) => {
  const g = useGFrame();
  const pal = usePal();
  const w = 560;
  const guy = t.at('this guy');
  return (
    <AbsoluteFill>
      <DarkPaper />
      {g >= t.at('won') && <Highlight text="BUT MANN MOSTLY WON." x={100} y={90} size={84} at={t.at('won')} seed={617} />}
      <Card src="img/ch07/country_school.jpg" x={110} y={280} w={620} rot={-3} at={t.at('sitting')} />
      <Note text="sitting in class, wondering..." x={120} y={760} size={54} rot={-2} at={t.at('sitting')} />
      <Note text="who to blame?" x={160} y={850} size={70} rot={-3} at={t.at('blame')} color={boxOf(pal)} />
      <Card src="img/ch07/mann_art.jpg" x={1180} y={200} w={w} rot={3} at={guy - 3} filter="grayscale(1) contrast(1.25) brightness(1.1)" />
      <Loop cx={1180 + w * 0.56} cy={200 + w * 1.31 * 0.34} rx={150} ry={185} tilt={6} at={guy} dur={8} width={7} seed={619} />
      <Arrow x1={880} y1={560} x2={1260} y2={430} bow={-40} at={guy - 2} width={6} />
      <Note text="this guy." x={820} y={470} size={80} rot={-5} at={guy} />
      {g >= t.at('Horace', 2) && <Highlight text="HORACE MANN." x={1180} y={940} size={80} at={t.at('Horace', 2)} seed={621} rot={-2} />}
    </AbsoluteFill>
  );
};

const Body: React.FC = () => {
  const frame = useCurrentFrame();
  const t = makeTimeline(N, 30);
  const at = t.at;
  const cuts: [number, React.ReactNode][] = [
    [0, <Opener t={t} />],
    [at('In the') - 1, <Mess t={t} />],
    [at('Horace') - 1, <Mann t={t} />],
    [at('So he') - 1, <Common t={t} />],
    [at('Not everyone') - 1, <Objections t={t} />],
    [at('But Mann') - 1, <Blame t={t} />],
  ];
  const scene = cuts.reduce((acc, [f, node]) => (frame >= f ? node : acc), cuts[0][1]);
  const end = Math.ceil(N.duration * 30);
  return (
    <AbsoluteFill>
      {scene}
      <Finish vignette={0.3} />
      <Audio src={staticFile('audio/ch07_equalizer.wav')} />
      <Audio src={staticFile('music/schools.mp3')} volume={(f) => interpolate(f, [0, 20, end - 20, end + 30], [0, 0.15, 0.15, 0], clamp)} />
      {cuts.slice(1).map(([f], i) => <Sfx key={i} at={f} src="sfx/whoosh.wav" volume={0.28} />)}
      {['early', 'mess', 'Horace', 'dangerous', 'easy', 'common', 'parish', 'won', 'this guy'].map((c) => <Sfx key={c} at={at(c)} src="sfx/stamp.wav" volume={0.26} />)}
      {[at('free'), at('public'), at('taxes')].map((f, i) => <Sfx key={`c${i}`} at={f} src="sfx/tick.wav" volume={0.45} />)}
      {['fun', 'living', 'rich', 'tutor', 'If not', 'months', 'needed', 'head', 'thought', 'More and', 'voters', 'trained', 'longer', 'better', 'Not everyone', 'Rich', 'Farmers', 'Catholic', 'taught', 'sitting', 'blame'].map((c) => (
        <Sfx key={c} at={at(c) - 2} src={WRITE.src} volume={WRITE.volume} />
      ))}
    </AbsoluteFill>
  );
};

export const Ch07: React.FC = () => (
  <PaletteCtx.Provider value={PALETTES.locked}>
    <StepCtx.Provider value={2.5}>
      <Body />
    </StepCtx.Provider>
  </PaletteCtx.Provider>
);
