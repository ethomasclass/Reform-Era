// Chapter 9 · Heaven on Earth (Results May Vary). Light through the Shakers; the Oneida section drops to the quiet palette.
import React from 'react';
import {AbsoluteFill, Audio, Easing, Img, interpolate, staticFile, useCurrentFrame} from 'remotion';
import words from '../../public/audio/ch09_utopia.words.json';
import {clamp} from '../lib/anim';
import {makeTimeline, type Narration} from '../lib/timing';
import {Arrow, boxOf, ColourReveal, Finish, Highlight, INK, JF, Loop, Note, PALETTES, PaletteCtx, Picture, Place, StepCtx, Tag, useGFrame, usePal} from '../jh/Kit';
import {Card, DarkPaper, Ember, Sfx, WRITE} from './common';

const N = words as Narration;
export const CH09_FRAMES = Math.ceil(N.duration * 30) + 36;
type TL = ReturnType<typeof makeTimeline>;
const GEN: [number, number] = [1376, 768];

const fill = (size: [number, number], fx: number, fy: number, z: number): Place => {
  const sc = Math.max(1920 / size[0], 1080 / size[1]) * z;
  return {left: Math.min(0, Math.max(1920 - size[0] * sc, 960 - fx * sc)), top: Math.min(0, Math.max(1080 - size[1] * sc, 540 - fy * sc)), scale: sc};
};

const Strike: React.FC<{x: number; y: number; w: number; at: number; color?: string}> = ({x, y, w, at, color}) => {
  const g = useGFrame();
  const pal = usePal();
  if (g < at) return null;
  const p = interpolate(g, [at, at + 5], [0, 1], clamp);
  return (
    <svg style={{position: 'absolute', left: 0, top: 0, overflow: 'visible'}} width={1920} height={1080}>
      <path d={`M${x},${y + 6} Q${x + w / 2},${y - 8} ${x + w},${y}`} fill="none" stroke={color ?? boxOf(pal)} strokeWidth={9} strokeLinecap="round" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - p} />
    </svg>
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

const Rethink: React.FC<{t: TL}> = ({t}) => {
  const g = useGFrame();
  return (
    <AbsoluteFill>
      <DarkPaper />
      <Ember x={1500} y={330} at={-20} size={0.7} />
      <Note text="some reformers didn't want to fix one problem..." x={140} y={330} size={58} rot={-3} at={t.at('Some')} />
      {g >= t.at('rethink') && <Highlight text="THEY WANTED TO RETHINK LIFE ITSELF." x={140} y={470} size={80} at={t.at('rethink')} seed={801} rot={-2} />}
    </AbsoluteFill>
  );
};

const Transcend: React.FC<{t: TL}> = ({t}) => {
  const g = useGFrame();
  const pal = usePal();
  const sr = t.at('Self-Reliance');
  return (
    <AbsoluteFill>
      <DarkPaper />
      <Card src="img/ch09/emerson.jpg" x={1360} y={120} w={430} rot={3} at={t.at('Ralph') - 2} filter="grayscale(1) contrast(1.15)" />
      <Note text="New England writers:" x={110} y={80} size={50} rot={-3} at={t.at('New England')} />
      {g >= t.at('Transcendentalists') && <Highlight text="THE TRANSCENDENTALISTS" x={100} y={160} size={84} at={t.at('Transcendentalists')} seed={803} />}
      <Note text="don't just follow what" x={120} y={320} size={50} rot={-2} at={t.at('follow')} color="#ffffff" />
      {[['church', 'church', 110], ['government', 'government', 350], ['society', 'society', 770]].map(([w, cue, x]) => (
        <React.Fragment key={w as string}>
          <Note text={w as string} x={x as number} y={400} size={60} rot={-3} at={t.at(cue as string)} />
          <Strike x={(x as number) - 10} y={450} w={(w as string).length * 30} at={t.at(cue as string) + 5} />
        </React.Fragment>
      ))}
      <Note text="tells you." x={1030} y={400} size={50} rot={-3} at={t.at('tells')} color="#ffffff" />
      <Note text="look inward." x={140} y={540} size={66} rot={-3} at={t.at('inward')} />
      <Note text="look at nature." x={420} y={620} size={66} rot={-3} at={t.at('nature')} />
      <Note text="trust yourself." x={600} y={700} size={66} rot={-3} at={t.at('Trust')} />
      {g >= sr && <Highlight text="“SELF-RELIANCE”" x={1180} y={890} size={76} at={sr} seed={805} rot={-3} />}
      <Note text="Ralph Waldo Emerson" x={1320} y={800} size={50} rot={-3} at={t.at('Ralph')} />
      <Tag text="Ralph Waldo Emerson, photograph, c. 1870s · “Self-Reliance” appeared in Emerson's Essays, 1841" y={1030} />
    </AbsoluteFill>
  );
};

const Walden: React.FC<{t: TL}> = ({t}) => {
  const frame = useCurrentFrame();
  const g = useGFrame();
  const c0 = t.at('He built');
  const place = fill(GEN, 700, 420, interpolate(frame, [c0, t.at('Quick')], [1.02, 1.12], clamp));
  if (frame < c0) {
    return (
      <AbsoluteFill>
        <DarkPaper />
        <Card src="img/ch09/thoreau.jpg" x={200} y={100} w={560} rot={-3} at={t.at('His friend') - 1} filter="grayscale(1) contrast(1.15)" />
        {g >= t.at('Henry') && <Highlight text="HENRY DAVID THOREAU" x={840} y={330} size={80} at={t.at('Henry')} seed={807} />}
        <Note text="actually tried it." x={880} y={480} size={66} rot={-3} at={t.at('actually')} />
        <Tag text="Henry David Thoreau, daguerreotype by B. D. Maxham, 1856" y={1030} />
      </AbsoluteFill>
    );
  }
  return (
    <AbsoluteFill style={{background: INK, overflow: 'hidden'}}>
      <Picture src="img/gen/ch09_walden_interior.jpg" place={place} size={GEN} bw="grayscale(1) contrast(1.2)" />
      <ColourReveal src="img/gen/ch09_walden_interior.jpg" place={place} size={GEN} from={0.55} to={0.92} />
      <Card src="img/ch09/walden_title.jpg" x={110} y={120} w={330} rot={-4} at={t.at('Walden') - 2} filter="grayscale(1) contrast(1.2)" />
      <Note text="a tiny cabin at Walden Pond" x={500} y={110} size={58} rot={-3} at={t.at('tiny')} />
      <Note text="two years" x={520} y={200} size={62} rot={-3} at={t.at('two years')} />
      <Note text="life, stripped down to the basics" x={120} y={900} size={58} rot={-2} at={t.at('stripped')} />
      <Tag text="Illustration · inside a one-room cabin at Walden Pond, 1845 · Walden, first edition title page, 1854" />
    </AbsoluteFill>
  );
};

// 1852 Concord map (2354 x 1863 px).
const CMAP: [number, number] = [2354, 1863];
const WALDEN = [1236, 1303];
const VILLAGE = [1110, 945];

const MythBust: React.FC<{t: TL}> = ({t}) => {
  const frame = useCurrentFrame();
  const g = useGFrame();
  const pal = usePal();
  const m0 = t.at('Quick');
  const k = interpolate(frame, [m0, m0 + 30], [0, 1], {...clamp, easing: Easing.inOut(Easing.cubic)});
  const s = 0.62 + 1.1 * k;
  const cx = 1177 + (1110 - 1177) * k;
  const cy = 930 + (1130 - 930) * k;
  const S = ([x, y]: number[]) => [960 + (x - cx) * s, 540 + (y - cy) * s];
  const w0 = t.at('walked');
  const p = interpolate(g, [w0 - 4, w0 + 20], [0, 1], {...clamp, easing: Easing.inOut(Easing.quad)});
  const [ax, ay] = S(WALDEN);
  const [bx, by] = S(VILLAGE);
  const mx = (ax + bx) / 2 + 70;
  const my = (ay + by) / 2;
  return (
    <AbsoluteFill style={{background: '#15130f'}}>
      <Img src={staticFile('img/ch09/concord_1852.jpg')} style={{position: 'absolute', left: 960 - cx * s, top: 540 - cy * s, width: CMAP[0] * s, filter: 'grayscale(1) sepia(0.25) contrast(1.15) brightness(0.85)'}} />
      <AbsoluteFill style={{background: 'radial-gradient(ellipse at 50% 50%, transparent 45%, rgba(8,6,4,0.8) 100%)'}} />
      <svg style={{position: 'absolute', left: 0, top: 0, overflow: 'visible'}} width={1920} height={1080}>
        <defs>
          <mask id="walk" maskUnits="userSpaceOnUse" x={0} y={0} width={1920} height={1080}>
            <path d={`M${ax},${ay} Q${mx},${my} ${bx},${by}`} fill="none" stroke="#fff" strokeWidth={20} pathLength={1} strokeDasharray={1} strokeDashoffset={1 - p} />
          </mask>
        </defs>
        <path d={`M${ax},${ay} Q${mx},${my} ${bx},${by}`} fill="none" stroke={INK} strokeWidth={13} strokeDasharray="20 14" strokeLinecap="round" mask="url(#walk)" />
        <path d={`M${ax},${ay} Q${mx},${my} ${bx},${by}`} fill="none" stroke={pal.mark} strokeWidth={7} strokeDasharray="20 14" strokeLinecap="round" mask="url(#walk)" />
      </svg>
      {g >= t.at('Walden', 2) && <div style={{position: 'absolute', left: ax - 13, top: ay - 13, width: 26, height: 26, borderRadius: '50%', background: pal.mark, border: `4px solid ${INK}`}} />}
      {g >= t.at('town') && <div style={{position: 'absolute', left: bx - 13, top: by - 13, width: 26, height: 26, borderRadius: '50%', background: boxOf(pal), border: `4px solid ${INK}`}} />}
      <Note text="quick myth-bust:" x={110} y={90} size={56} rot={-3} at={t.at('myth-bust')} />
      {g >= t.at('mile') && <Highlight text="~1½ MILES FROM TOWN" x={80} y={180} size={64} at={t.at('mile')} seed={809} />}
      <Note text="he walked in all the time" x={1150} y={330} size={48} rot={-3} at={w0} />
      <Note text="...sometimes for dinner" x={1170} y={410} size={48} rot={-3} at={t.at('dinner')} color={boxOf(pal)} />
      <Note text="at his family's house" x={1190} y={480} size={48} rot={-3} at={t.at('house')} color={boxOf(pal)} />
      {g >= t.at('Not exactly') && <Highlight text="NOT EXACTLY THE WILDERNESS." x={100} y={880} size={80} at={t.at('Not exactly')} seed={811} rot={-2} />}
      <Tag text="Map of the town of Concord, H. F. Walling, 1852 (Walden Pond from a survey by H. D. Thoreau) · Library of Congress" y={40} />
    </AbsoluteFill>
  );
};

const Jail: React.FC<{t: TL}> = ({t}) => {
  const g = useGFrame();
  const pal = usePal();
  return (
    <AbsoluteFill>
      <DarkPaper />
      <Card src="img/ch09/thoreau.jpg" x={120} y={140} w={380} rot={-3} at={t.at('But Thoreau') - 1} filter="grayscale(1) contrast(1.15)" />
      <Note text="one night in jail" x={560} y={140} size={66} rot={-3} at={t.at('night')} />
      <Note text="for refusing to pay a tax that supported..." x={580} y={250} size={50} rot={-2} at={t.at('refusing')} color="#ffffff" />
      <Note text="slavery" x={600} y={340} size={62} rot={-3} at={t.at('slavery')} color={boxOf(pal)} />
      <Note text="+ an unjust war" x={880} y={340} size={62} rot={-3} at={t.at('unjust')} color={boxOf(pal)} />
      {g >= t.at('Civil') && <Highlight text="“CIVIL DISOBEDIENCE”" x={560} y={470} size={90} at={t.at('Civil')} seed={813} rot={-2} />}
      <Note text="a century later, it inspired..." x={110} y={760} size={46} rot={-3} at={t.at('century')} />
      <Card src="img/ch09/gandhi.jpg" x={880} y={580} w={300} rot={-3} at={t.at('Gandhi') - 1} filter="grayscale(1) contrast(1.15)" />
      <Card src="img/ch09/king.jpg" x={1250} y={600} w={540} rot={3} at={t.at('Martin') - 1} filter="grayscale(1) contrast(1.1)" />
      <Note text="Gandhi" x={940} y={970} size={44} rot={-2} at={t.at('Gandhi')} />
      <Note text="Martin Luther King Jr." x={1330} y={970} size={44} rot={-2} at={t.at('Martin')} />
      <Tag text="Thoreau, 1856 · Gandhi, Elliott & Fry, 1931 · King, Marion S. Trikosko, 1964, Library of Congress" y={40} />
    </AbsoluteFill>
  );
};

const Utopian: React.FC<{t: TL}> = ({t}) => {
  const g = useGFrame();
  const u = t.at('utopian');
  return (
    <AbsoluteFill>
      <DarkPaper />
      <Note text="others went further:" x={330} y={260} size={62} rot={-3} at={t.at('Others')} />
      <Note text="entirely new societies" x={360} y={360} size={66} rot={-3} at={t.at('entirely')} />
      {g >= u && <Highlight text="UTOPIAN COMMUNITIES" x={330} y={470} size={110} at={u} seed={815} rot={-2} />}
      <Definition term="u·to·pi·an" def="aiming at a perfect society, often unrealistically" at={u + 8} x={330} y={680} />
    </AbsoluteFill>
  );
};

const Shakers: React.FC<{t: TL}> = ({t}) => {
  const frame = useCurrentFrame();
  const g = useGFrame();
  const pal = usePal();
  const size: [number, number] = [3000, 2522];
  const s0 = t.at('The Shakers');
  const cnt = t.at('peaking');
  const place = fill(size, 1450, 1150, interpolate(frame, [s0, cnt], [1.3, 1.45], clamp));
  const S = (x: number, y: number) => [place.left + x * place.scale, place.top + y * place.scale];
  const [dx, dy] = S(1300, 1300);
  if (frame >= t.at('Which worked') - 1) {
    const n = Math.round(interpolate(g, [t.at('6,000') - 6, t.at('6,000') + 8], [0, 6000], clamp));
    const fall = t.at('2025');
    const m = g >= fall ? Math.round(interpolate(g, [fall, t.at('three')], [6000, 3], {...clamp, easing: Easing.out(Easing.cubic)})) : n;
    return (
      <AbsoluteFill>
        <DarkPaper />
        <Note text="which worked for a while..." x={120} y={120} size={58} rot={-3} at={t.at('worked')} />
        <div style={{position: 'absolute', left: 0, right: 0, top: 290, textAlign: 'center', fontFamily: JF.display, fontSize: 300, lineHeight: 1, color: g >= t.at('three') ? boxOf(pal) : '#f4efe6', textShadow: '0 8px 30px rgba(0,0,0,0.8)'}}>
          {m.toLocaleString('en-US')}
        </div>
        <Note text={g >= fall ? 'Shakers left, as of 2025' : 'members at the peak'} x={720} y={660} size={62} rot={-3} at={t.at('6,000')} />
        <Tag text="Peak around 6,000 (mid-1800s); three members at Sabbathday Lake, Maine, in 2025" y={1030} />
      </AbsoluteFill>
    );
  }
  return (
    <AbsoluteFill style={{background: INK, overflow: 'hidden'}}>
      <Picture src="img/ch09/shakers.jpg" place={place} size={size} bw="grayscale(1) contrast(1.2)" />
      {g >= s0 && <Highlight text="THE SHAKERS" x={100} y={90} size={90} at={s0} seed={817} />}
      <Note text="led by “Mother Ann Lee”" x={110} y={230} size={54} rot={-3} at={t.at('Mother')} out={t.at('They got')} />
      <Note text="shared all their property · strict rules" x={110} y={310} size={50} rot={-2} at={t.at('shared')} out={t.at('They got')} />
      <Loop cx={dx} cy={dy} rx={560} ry={260} tilt={-3} at={t.at('shake') - 2} dur={12} width={6} seed={819} />
      <Note text="they'd shake and dance to cast off sin" x={110} y={230} size={54} rot={-3} at={t.at('shake')} out={t.at('They also')} />
      {g >= t.at('celibacy') && <Highlight text="TOTAL CELIBACY" x={100} y={220} size={80} at={t.at('celibacy')} seed={821} rot={-2} />}
      <Note text="no marriage." x={110} y={360} size={62} rot={-3} at={t.at('No marriage')} />
      <Note text="no kids." x={640} y={380} size={62} rot={-3} at={t.at('No kids')} />
      <Note text="grew only by converts + orphans" x={110} y={880} size={58} rot={-3} at={t.at('converts')} color={boxOf(pal)} />
      <Tag text="“Shakers near Lebanon, state of N. York, their mode of worship,” lithograph, c. 1830 · Library of Congress" y={1030} />
    </AbsoluteFill>
  );
};

/** Oneida. Quiet palette; no images of young people. */
const Oneida: React.FC<{t: TL}> = ({t}) => {
  const g = useGFrame();
  const o0 = t.at("Then there's");
  const heavy = t.at('But Noyes');
  if (g >= heavy - 2) {
    return (
      <AbsoluteFill style={{background: '#0a0908'}}>
        <DarkPaper />
        <Card src="img/ch09/oneida.jpg" x={1420} y={200} w={400} rot={2} at={-99} filter="grayscale(1) contrast(1.1) brightness(0.55)" />
        <Note text="Noyes and a few leaders held enormous power" x={130} y={260} size={52} rot={-2} at={t.at('leaders')} color="#EDE7DC" />
        <Note text="over members' lives, including teenagers." x={150} y={340} size={52} rot={-2} at={t.at('including')} color="#EDE7DC" />
        <Note text="much of what happened there was abusive." x={130} y={480} size={60} rot={-2} at={t.at('much')} />
        {g >= t.at('1879') && <Highlight text="1879" x={130} y={640} size={90} at={t.at('1879')} seed={823} />}
        <Note text="facing possible criminal charges, Noyes fled to Canada" x={140} y={790} size={46} rot={-2} at={t.at('facing')} color="#EDE7DC" />
        <Note text="and the experiment fell apart." x={160} y={870} size={52} rot={-2} at={t.at('experiment')} />
        <Tag text="Oneida Community Mansion House, stereograph, c. 1860s–70s" y={1030} />
      </AbsoluteFill>
    );
  }
  return (
    <AbsoluteFill>
      <DarkPaper />
      <Card src="img/ch09/oneida.jpg" x={1150} y={110} w={640} rot={2} at={o0} filter="grayscale(1) contrast(1.1)" />
      {g >= t.at('Oneida') && <Highlight text="ONEIDA, NEW YORK · 1848" x={100} y={90} size={70} at={t.at('Oneida')} seed={825} />}
      <Card src="img/ch09/noyes.jpg" x={120} y={240} w={330} rot={-3} at={t.at('John') - 1} filter="grayscale(1) contrast(1.15)" />
      <Note text="John Humphrey Noyes" x={500} y={250} size={56} rot={-3} at={t.at('John')} />
      <Note text="converted by... Charles Finney" x={520} y={340} size={50} rot={-3} at={t.at('guessed')} />
      <Card src="img/ch02/finney.jpg" x={640} y={430} w={170} rot={4} at={t.at('Finney') - 1} filter="grayscale(1) contrast(1.15)" />
      <Note text="believed his followers were already perfect" x={140} y={680} size={48} rot={-2} at={t.at('Noyes believed')} color="#EDE7DC" />
      <Note text="private property had to go..." x={160} y={760} size={52} rot={-2} at={t.at('private')} />
      <Note text="...and so did marriage." x={180} y={840} size={52} rot={-2} at={t.at('decided marriage')} />
      <Note text="nobody allowed an exclusive relationship" x={140} y={930} size={46} rot={-2} at={t.at('exclusive')} color="#EDE7DC" out={t.at('committee')} />
      <Note text="a committee decided who could have children" x={140} y={930} size={46} rot={-2} at={t.at('committee')} color="#EDE7DC" out={t.at('The community')} />
      <Note text="profitable for decades: silverware (still sold today)" x={140} y={930} size={46} rot={-2} at={t.at('silverware') - 4} color="#EDE7DC" />
      <Tag text="John Humphrey Noyes, engraving · Oneida Community Mansion House, c. 1860s–70s · Finney, c. 1850" y={1030} />
    </AbsoluteFill>
  );
};

const Body: React.FC = () => {
  const frame = useCurrentFrame();
  const t = makeTimeline(N, 30);
  const at = t.at;
  const quietFrom = at("Then there's") - 1;
  const cuts: [number, React.ReactNode][] = [
    [0, <Rethink t={t} />],
    [at('In New') - 1, <Transcend t={t} />],
    [at('His friend') - 1, <Walden t={t} />],
    [at('Quick') - 1, <MythBust t={t} />],
    [at('But Thoreau') - 1, <Jail t={t} />],
    [at('Others') - 1, <Utopian t={t} />],
    [at('The Shakers') - 1, <Shakers t={t} />],
    [quietFrom, <PaletteCtx.Provider value={PALETTES.quiet}><Oneida t={t} /></PaletteCtx.Provider>],
  ];
  const scene = cuts.reduce((acc, [f, node]) => (frame >= f ? node : acc), cuts[0][1]);
  const end = Math.ceil(N.duration * 30);
  return (
    <AbsoluteFill>
      {scene}
      <Finish vignette={frame >= quietFrom ? 0.35 : 0.3} />
      <Audio src={staticFile('audio/ch09_utopia.wav')} />
      <Audio src={staticFile('music/utopia.mp3')} volume={(f) => interpolate(f, [0, 20, end - 20, end + 36], [0, 0.15, 0.15, 0], clamp)} />
      {cuts.slice(1, 7).map(([f], i) => <Sfx key={i} at={f} src="sfx/whoosh.wav" volume={0.28} />)}
      <Sfx at={quietFrom} src="sfx/page_turn.wav" volume={0.3} />
      {['rethink', 'Transcendentalists', 'Self-Reliance', 'Henry', 'mile', 'Not exactly', 'Civil', 'utopian', 'The Shakers', 'celibacy'].map((c) => <Sfx key={c} at={at(c)} src="sfx/stamp.wav" volume={0.26} />)}
      {['Oneida', '1879'].map((c) => <Sfx key={c} at={at(c)} src="sfx/stamp.wav" volume={0.18} />)}
      {['Some', 'follow', 'church', 'government', 'society', 'inward', 'nature', 'Trust', 'actually', 'tiny', 'two years', 'stripped', 'myth-bust', 'walked', 'dinner', 'night', 'refusing', 'slavery', 'century', 'Others', 'Mother', 'shake', 'No marriage', 'converts', 'worked', 'John', 'guessed', 'private', 'leaders', 'much', 'facing'].map((c) => (
        <Sfx key={c} at={at(c) - 2} src={WRITE.src} volume={WRITE.volume} />
      ))}
    </AbsoluteFill>
  );
};

export const Ch09: React.FC = () => (
  <PaletteCtx.Provider value={PALETTES.locked}>
    <StepCtx.Provider value={2.5}>
      <Body />
    </StepCtx.Provider>
  </PaletteCtx.Provider>
);
