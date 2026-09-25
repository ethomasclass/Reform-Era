// Direction A: modern archival collage. Paper ground, black-and-white cut-outs with torn edges,
// halftone on ember orange, condensed headlines, marker strokes, highlighter on real documents.
import React from 'react';
import {AbsoluteFill, Audio, Img, interpolate, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';
import {clamp, life, pop, prog} from '../lib/anim';
import {C, Captions, F, Grain, H, MarkerLoop, Source, Strike, W} from '../lib/look';
import {clips, tl} from './data';

const Paper: React.FC = () => (
  <AbsoluteFill style={{background: C.paper}}>
    <Grain opacity={0.35} blend="multiply" />
  </AbsoluteFill>
);

/** A torn cut-out that springs into place. */
const Cutout: React.FC<{src: string; x: number; y: number; w: number; rot: number; at: number; from?: [number, number]; style?: React.CSSProperties}> = ({
  src, x, y, w, rot, at, from = [0, 140], style,
}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const p = pop(frame, at, fps, 150, 17);
  return (
    <Img
      src={staticFile(src)}
      style={{
        position: 'absolute', left: x, top: y, width: w,
        transform: `translate(${from[0] * (1 - p)}px, ${from[1] * (1 - p)}px) rotate(${rot + (1 - p) * 4}deg)`,
        opacity: interpolate(p, [0, 0.15], [0, 1], clamp),
        filter: 'drop-shadow(0 18px 26px rgba(0,0,0,0.28))',
        ...style,
      }}
    />
  );
};

const Stamp: React.FC<{at: number; children: React.ReactNode; style?: React.CSSProperties}> = ({at, children, style}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const p = pop(frame, at, fps, 260, 18);
  if (frame < at) return null;
  return <div style={{position: 'absolute', transform: `scale(${1.25 - 0.25 * p})`, opacity: interpolate(p, [0, 0.3], [0, 1], clamp), transformOrigin: 'left center', ...style}}>{children}</div>;
};

const Label: React.FC<{children: React.ReactNode; bg?: string; color?: string; style?: React.CSSProperties}> = ({children, bg = C.ink, color = C.paper, style}) => (
  <div style={{display: 'inline-block', background: bg, color, fontFamily: F.sans, fontWeight: 800, fontSize: 30, letterSpacing: 3,
    textTransform: 'uppercase', padding: '8px 16px', ...style}}>{children}</div>
);

export const CollageCold: React.FC<{captions?: boolean}> = ({captions = true}) => {
  const frame = useCurrentFrame();
  const t = tl('cold');
  const ship = t.at('A ship');
  const push = interpolate(frame, [0, ship], [1, 1.07], clamp);
  const drift = interpolate(frame, [ship, t.frames + 30], [1, 1.04], clamp);
  // the page sits at (1210, 120), 540 wide (scale 540/776 of the torn sheet)
  const pageS = 540 / 776;
  return (
    <AbsoluteFill>
      <Audio src={staticFile(clips.cold.audio)} />
      {frame < ship ? (
        <AbsoluteFill style={{background: C.ember}}>
          <Img src={staticFile('img/prep/wharf_halftone.png')} style={{position: 'absolute', width: W, top: 0, transform: `scale(${push})`, transformOrigin: '30% 50%'}} />
          <Stamp at={t.at('December')} style={{left: 96, top: 60}}>
            <div style={{fontFamily: F.head, fontSize: 210, lineHeight: 1, color: C.ink, letterSpacing: 2}}>DECEMBER 1829</div>
          </Stamp>
          <Stamp at={t.at('Savannah')} style={{left: 104, top: 290}}>
            <Label bg={C.paper} color={C.ink} style={{fontSize: 40, padding: '10px 20px'}}>Savannah, Georgia</Label>
          </Stamp>
        </AbsoluteFill>
      ) : (
        <AbsoluteFill style={{transform: `scale(${drift})`}}>
          <Paper />
          <Cutout src="img/prep/wharf_bw_torn.png" x={60} y={110} w={1040} rot={-3} at={ship} from={[-500, 0]} />
          <Stamp at={t.at('from Boston')} style={{left: 760, top: 96}}>
            <Label bg={C.ember} color={C.ink}>From Boston →</Label>
          </Stamp>
          <div style={{position: 'absolute', left: 1210, top: 120, width: 776, height: 1232, transform: `scale(${pageS})`, transformOrigin: '0 0'}}>
            <PageWithRedaction at={t.at('sixty copies')} />
          </div>
          <Stamp at={t.at('sixty')} style={{left: 900, top: 560}}>
            <div style={{transform: 'rotate(-7deg)', fontFamily: F.head, fontSize: 170, color: C.ember, lineHeight: 1, WebkitTextStroke: `4px ${C.ink}`}}>×60</div>
          </Stamp>
          <Stamp at={t.at('guns')} style={{left: 110, top: 745}}>
            <div style={{fontFamily: F.head, fontSize: 118, color: C.ink}}>GUNS</div>
          </Stamp>
          <Strike x={100} y={820} w={240} at={t.at('guns') + 8} />
          <Stamp at={t.at('gunpowder')} style={{left: 390, top: 745}}>
            <div style={{fontFamily: F.head, fontSize: 118, color: C.ink}}>GUNPOWDER</div>
          </Stamp>
          <Strike x={380} y={820} w={540} at={t.at('gunpowder') + 10} />
          <MarkerLoop x={1165} y={70} w={660} h={950} at={t.at('pamphlet', 2) - 2} dur={16} seed={4} width={11} />
          <Source text="Illustration: Savannah waterfront · Page: 1829, title hidden" />
        </AbsoluteFill>
      )}
      {captions && <Captions words={clips.cold.n.words} style="collage" hideFrom={[[0, t.at('A ship') - 3]]} />}
    </AbsoluteFill>
  );
};

const PageWithRedaction: React.FC<{at: number}> = ({at}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const p = pop(frame, at, fps, 150, 17);
  return (
    <div style={{position: 'absolute', inset: 0, transform: `translateY(${(1 - p) * 700}px) rotate(${4 - p * 0.5}deg)`, opacity: interpolate(p, [0, 0.1], [0, 1], clamp)}}>
      <Img src={staticFile('img/prep/walker_torn.png')} style={{width: 776, filter: 'drop-shadow(0 22px 30px rgba(0,0,0,0.3))'}} />
      <div style={{position: 'absolute', left: 150, top: 38, width: 480, height: 92, background: C.ink, transform: 'rotate(-1deg)',
        display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: F.head, fontSize: 70, color: C.ember}}>? ? ?</div>
    </div>
  );
};

const CHECKS: [string, string, boolean][] = [['vote', 'Vote', false], ['office', 'Hold office', false], ['write', 'Write', true]];

export const CollageDix: React.FC<{captions?: boolean}> = ({captions = true}) => {
  const frame = useCurrentFrame();
  const t = tl('dix');
  const words = clips.dix.n.words;
  const q0 = t.idx('in cages');
  const qStart = t.at('in cages') - 16;
  const phase1 = interpolate(frame, [qStart, qStart + 10], [1, 0], clamp);
  // page camera: page point (520, 1048) travels to screen (1300, 330) while scale 0.6 -> 1.05
  const z = prog(frame, qStart + 6, qStart + 34);
  const s = 0.6 + 0.45 * z;
  const sx = 1330 - 30 * z;
  const sy = 700 - 370 * z;
  const pageIn = pop(frame, qStart, 30, 150, 17);
  // highlighter progress across the two quoted lines, by characters spoken
  const line1 = 'in cages, closets, cellars, stalls, pens! Chained, naked, beaten with';
  const line2 = 'rods, and lashed into obedience.';
  const quoteWords = words.slice(q0).map((w) => w.w.replace(/[“”"]/g, ''));
  let spokenChars = 0;
  let acc = 0;
  quoteWords.forEach((w, i) => {
    const wd = words[q0 + i];
    const k = interpolate(frame, [wd.s * 30, wd.e * 30], [0, 1], clamp);
    spokenChars = Math.max(spokenChars, acc + (w.length + 1) * k);
    acc += w.length + 1;
  });
  const h1 = Math.min(1, spokenChars / (line1.length + 1));
  const h2 = Math.max(0, Math.min(1, (spokenChars - line1.length - 1) / line2.length));
  const BIG = ['cages,', 'closets,', 'cellars,', 'stalls,', 'pens!'];
  const rest = words.slice(t.idx('Chained'));
  return (
    <AbsoluteFill>
      <Audio src={staticFile(clips.dix.audio)} />
      <Paper />
      <AbsoluteFill style={{opacity: phase1}}>
        <Cutout src="img/prep/dix_bw_torn.png" x={130} y={70} w={600} rot={-2} at={0} />
        <Stamp at={8} style={{left: 110, top: 760}}>
          <div style={{background: C.ember, padding: '6px 22px 0', fontFamily: F.head, fontSize: 88, color: C.ink, lineHeight: 1.1}}>DOROTHEA DIX</div>
          <div style={{background: C.ink, color: C.paper, fontFamily: F.sans, fontWeight: 600, fontSize: 30, padding: '10px 22px', display: 'inline-block'}}>1802–1887 · Teacher and reformer</div>
        </Stamp>
        {CHECKS.map(([cue, text, ok], i) => {
          const at = t.at(cue);
          const y = 190 + i * 190;
          return (
            <React.Fragment key={cue}>
              <Stamp at={at} style={{left: 1000, top: y}}>
                <div style={{display: 'flex', alignItems: 'center', gap: 28}}>
                  <div style={{fontFamily: F.head, fontSize: 130, color: ok ? C.ink : 'rgba(22,22,26,0.55)', lineHeight: 1}}>{text.toUpperCase()}</div>
                  <div style={{fontFamily: F.sans, fontWeight: 800, fontSize: 110, color: ok ? C.ember : C.ink, lineHeight: 1}}>{ok ? '✓' : '✕'}</div>
                </div>
              </Stamp>
              {ok && <MarkerLoop x={970} y={y - 30} w={560} h={200} at={at + 6} seed={7} />}
            </React.Fragment>
          );
        })}
        <Source text="Daguerreotype, c. 1849" />
      </AbsoluteFill>
      {frame >= qStart && (
        <AbsoluteFill>
          <div style={{position: 'absolute', left: sx - 520 * s, top: sy - 1048 * s + (1 - pageIn) * 600, width: 1054, height: 1528,
            transform: `scale(${s}) rotate(1.5deg)`, transformOrigin: '0 0'}}>
            <Img src={staticFile('img/prep/dix_page_torn.png')} style={{width: 1054, filter: 'drop-shadow(0 24px 34px rgba(0,0,0,0.3))'}} />
            <div style={{position: 'absolute', left: 92, top: 1014, height: 38, width: (948 - 92) * h1, background: C.ember, mixBlendMode: 'multiply', opacity: 0.6}} />
            <div style={{position: 'absolute', left: 92, top: 1050, height: 38, width: (520 - 92) * h2, background: C.ember, mixBlendMode: 'multiply', opacity: 0.6}} />
          </div>
          {BIG.map((b, i) => (
            <Stamp key={b} at={t.at(b)} style={{left: 96, top: 120 + i * 118}}>
              <div style={{fontFamily: F.head, fontSize: 124, color: i === 4 ? C.ember : C.ink, lineHeight: 1, WebkitTextStroke: i === 4 ? `3px ${C.ink}` : undefined}}>{b.toUpperCase()}</div>
            </Stamp>
          ))}
          <div style={{position: 'absolute', left: 100, top: 740, width: 600, fontFamily: F.sans, fontWeight: 800, fontSize: 42, lineHeight: 1.2, color: C.ink, textTransform: 'uppercase'}}>
            {rest.map((w, i) => (
              <span key={i} style={{opacity: life(frame, Math.round(w.s * 30) - 2, Infinity, 4)}}>{w.w.replace(/[“”"]/g, '')} </span>
            ))}
          </div>
          <Source bottom text="D. L. Dix, Memorial to the Legislature of Massachusetts, 1843 (1904 reprint)" />
        </AbsoluteFill>
      )}
      {captions && <Captions words={words} style="collage" hideFrom={[[qStart, 99999]]} />}
    </AbsoluteFill>
  );
};

const Jug: React.FC<{fill: number; color: string; size?: number}> = ({fill, color, size = 78}) => {
  const id = React.useId().replace(/:/g, '');
  return (
    <svg width={size} height={size * 1.15} viewBox="0 0 100 115">
      <defs>
        <clipPath id={id}><rect x="0" y={115 - 115 * fill} width="100" height="115" /></clipPath>
      </defs>
      <path d="M38 6 h24 v14 c16 6 26 22 26 44 c0 26 -14 44 -38 44 c-24 0 -38 -18 -38 -44 c0 -22 10 -38 26 -44 z M72 30 c14 -4 22 6 18 18 c-2 8 -8 12 -14 12" fill="none" stroke={C.ink} strokeWidth="5" />
      <path d="M38 6 h24 v14 c16 6 26 22 26 44 c0 26 -14 44 -38 44 c-24 0 -38 -18 -38 -44 c0 -22 10 -38 26 -44 z" fill={color} clipPath={`url(#${id})`} />
    </svg>
  );
};

export const CollageGallons: React.FC<{captions?: boolean}> = ({captions = true}) => {
  const frame = useCurrentFrame();
  const t = tl('gallons');
  const seven = t.at('seven');
  const three = t.at('three times');
  const today = t.at('today');
  const count = Math.round(interpolate(frame, [seven, seven + 14], [0, 7], clamp));
  return (
    <AbsoluteFill>
      <Audio src={staticFile(clips.gallons.audio)} />
      <Paper />
      <Cutout src="img/prep/drunkards_torn.png" x={1020} y={60} w={830} rot={3} at={0} from={[300, 0]} />
      <Stamp at={t.at('number')} style={{left: 100, top: 110}}>
        <Label>A number that sounds made up</Label>
      </Stamp>
      <Stamp at={t.at('Around 1830')} style={{left: 100, top: 190}}>
        <Label bg={C.ember} color={C.ink}>c. 1830</Label>
      </Stamp>
      {frame >= seven && (
        <div style={{position: 'absolute', left: 90, top: 250, display: 'flex', alignItems: 'flex-end', gap: 26}}>
          <div style={{fontFamily: F.head, fontSize: 400, lineHeight: 0.9, color: C.ember, WebkitTextStroke: `5px ${C.ink}`}}>{count}</div>
          <div style={{paddingBottom: 30, opacity: life(frame, t.at('gallons'), Infinity, 6)}}>
            <div style={{fontFamily: F.head, fontSize: 150, lineHeight: 0.9, color: C.ink}}>GALLONS</div>
            <div style={{fontFamily: F.sans, fontWeight: 600, fontSize: 32, color: C.ink, marginTop: 14, opacity: life(frame, t.at('pure alcohol'), Infinity, 6)}}>of pure alcohol · per adult · per year</div>
          </div>
        </div>
      )}
      {frame >= three - 6 && (
        <div style={{position: 'absolute', left: 100, top: 690}}>
          {[
            ['1830', 7.1, C.ember, three - 6],
            ['Today', 2.5, C.ink, today - 4],
          ].map(([label, n, color, at], row) => (
            <div key={row} style={{display: 'flex', alignItems: 'center', gap: 10, height: 110, opacity: life(frame, at as number, Infinity, 6)}}>
              <div style={{width: 170, fontFamily: F.mono, fontWeight: 600, fontSize: 28, color: C.ink, textTransform: 'uppercase'}}>{label}</div>
              {Array.from({length: Math.ceil(n as number)}).map((_, i) => {
                const f = Math.min(1, (n as number) - i);
                const k = interpolate(frame, [(at as number) + i * 2, (at as number) + i * 2 + 8], [0, 1], clamp);
                return <Jug key={i} fill={f * k} color={color as string} />;
              })}
            </div>
          ))}
          <Stamp at={three + 4} style={{left: 900, top: 30}}>
            <div style={{fontFamily: F.head, fontSize: 150, color: C.ember, WebkitTextStroke: `4px ${C.ink}`}}>≈3×</div>
          </Stamp>
        </div>
      )}
      <Source text="N. Currier, The Drunkard's Progress, 1846 · Data: Rorabaugh; NIAAA" />
      {captions && <Captions words={clips.gallons.n.words} style="collage" />}
    </AbsoluteFill>
  );
};

export {H, W};
