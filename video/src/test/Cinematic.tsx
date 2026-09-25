// Direction B: cinematic documentary. Near-black ground, full-bleed graded images with slow pushes,
// film grain and vignette, a light serif for titles and quotes, a single ember accent.
import React from 'react';
import {AbsoluteFill, Audio, Img, interpolate, random, staticFile, useCurrentFrame} from 'remotion';
import {clamp, life, prog} from '../lib/anim';
import {C, Captions, F, Grain, Source, Vignette} from '../lib/look';
import {clips, tl} from './data';

const Beat: React.FC<{from: number; to: number; children: React.ReactNode; style?: React.CSSProperties}> = ({from, to, children, style}) => {
  const frame = useCurrentFrame();
  const o = life(frame, from, to, 10, 8);
  const blur = interpolate(frame, [from, from + 12], [10, 0], clamp);
  if (frame < from || frame > to) return null;
  return <div style={{position: 'absolute', opacity: o, filter: `blur(${blur}px)`, ...style}}>{children}</div>;
};

/** Slow-rising embers, drawn around a point. */
const Embers: React.FC<{x: number; y: number; spread?: number; n?: number; from?: number}> = ({x, y, spread = 260, n = 18, from = 0}) => {
  const frame = useCurrentFrame() - from;
  if (frame < 0) return null;
  return (
    <AbsoluteFill style={{mixBlendMode: 'screen'}}>
      {Array.from({length: n}).map((_, i) => {
        const life = 90 + random(`l${i}`) * 90;
        const t = ((frame + random(`o${i}`) * life) % life) / life;
        const px = x + (random(`x${i}`) - 0.5) * spread + Math.sin((frame + i * 20) / 18) * 12;
        const py = y - t * 260;
        const size = 3 + random(`s${i}`) * 5;
        return <div key={i} style={{position: 'absolute', left: px, top: py, width: size, height: size, borderRadius: '50%',
          background: C.emberSoft, boxShadow: `0 0 ${size * 4}px ${size}px rgba(255,110,40,0.55)`, opacity: Math.sin(t * Math.PI) * 0.9}} />;
      })}
    </AbsoluteFill>
  );
};

const Title: React.FC<{big: string; small: string; at1: number; at2: number; x?: number; y?: number}> = ({big, small, at1, at2, x = 110, y = 690}) => {
  const frame = useCurrentFrame();
  return (
    <div style={{position: 'absolute', left: x, top: y}}>
      <div style={{fontFamily: F.serif, fontStyle: 'italic', fontWeight: 300, fontSize: 132, color: C.bone, lineHeight: 1,
        opacity: life(frame, at1, Infinity, 16), filter: `blur(${interpolate(frame, [at1, at1 + 16], [12, 0], clamp)}px)`}}>{big}</div>
      <div style={{width: interpolate(frame, [at2 - 4, at2 + 14], [0, 90], clamp), height: 3, background: C.ember, margin: '28px 0 22px'}} />
      <div style={{fontFamily: F.sans, fontWeight: 600, fontSize: 28, letterSpacing: 11, color: C.bone, opacity: life(frame, at2, Infinity, 14)}}>{small}</div>
    </div>
  );
};

export const CinemaCold: React.FC<{captions?: boolean}> = ({captions = true}) => {
  const frame = useCurrentFrame();
  const t = tl('cold');
  const cut = t.at('Somewhere') - 6;
  const x = 12;
  const wharfO = interpolate(frame, [cut, cut + x], [1, 0], clamp);
  const k1 = prog(frame, 0, cut + x, (v) => v);
  const k2 = prog(frame, cut, t.frames + 30, (v) => v);
  const notAt = t.at('Not guns');
  return (
    <AbsoluteFill style={{background: C.night}}>
      <Audio src={staticFile(clips.cold.audio)} />
      <AbsoluteFill style={{opacity: 1 - wharfO}}>
        <Img src={staticFile('img/gen/coat_lining.jpg')} style={{width: '100%', height: '100%', objectFit: 'cover',
          transform: `scale(${1.05 + 0.12 * k2})`, transformOrigin: '70% 58%', filter: 'saturate(0.75) contrast(1.08) brightness(0.78)'}} />
        <Embers x={1260} y={640} from={cut} />
      </AbsoluteFill>
      <AbsoluteFill style={{opacity: wharfO}}>
        <Img src={staticFile('img/gen/savannah_wharf.jpg')} style={{width: '100%', height: '100%', objectFit: 'cover',
          transform: `scale(${1.06 + 0.1 * k1}) translateX(${k1 * 30}px)`, transformOrigin: '24% 55%', filter: 'saturate(0.5) contrast(1.1) brightness(0.72) hue-rotate(-8deg)'}} />
        <Title big="December 1829" small="SAVANNAH, GEORGIA" at1={t.at('December') - 4} at2={t.at('Savannah')} />
      </AbsoluteFill>
      <Vignette strength={0.8} />
      <Beat from={t.at('sixty copies') - 4} to={notAt - 4} style={{right: 130, top: 170, textAlign: 'right'}}>
        <div style={{fontFamily: F.serif, fontWeight: 300, fontSize: 150, color: C.bone, lineHeight: 1}}>60</div>
        <div style={{fontFamily: F.sans, fontWeight: 600, fontSize: 24, letterSpacing: 9, color: C.bone, marginTop: 10}}>COPIES ON BOARD</div>
      </Beat>
      {[
        ['Not guns.', notAt, t.at('Not gunpowder') - 3],
        ['Not gunpowder.', t.at('Not gunpowder'), t.at('A pamphlet') - 3],
        ['A pamphlet.', t.at('A pamphlet'), 99999],
      ].map(([txt, a, b], i) => (
        <Beat key={i} from={a as number} to={b as number} style={{left: 130, top: 430}}>
          <div style={{fontFamily: F.serif, fontStyle: i === 2 ? 'normal' : 'italic', fontWeight: 300, fontSize: 120, color: i === 2 ? C.emberSoft : C.bone,
            textShadow: '0 4px 30px rgba(0,0,0,0.8)'}}>{txt}</div>
        </Beat>
      ))}
      <Grain opacity={0.16} />
      {captions && <Captions words={clips.cold.n.words} style="cinema" hideFrom={[[0, t.at('A ship') - 3], [notAt - 4, 99999]]} />}
    </AbsoluteFill>
  );
};

export const CinemaDix: React.FC<{captions?: boolean}> = ({captions = true}) => {
  const frame = useCurrentFrame();
  const t = tl('dix');
  const words = clips.dix.n.words;
  const q0 = t.idx('in cages');
  const qStart = t.at('in cages') - 14;
  const dim = interpolate(frame, [qStart - 6, qStart + 16], [1, 0.32], clamp);
  const slide = prog(frame, qStart - 6, qStart + 30);
  const quote = words.slice(q0);
  const beats: [string, number, number][] = [
    ['She couldn’t vote.', t.at('Remember'), t.at('And she told') - 2],
    ['She couldn’t hold office.', t.at('and she couldn\'t hold'), t.at('And she told') - 2],
    ['But she could write.', t.at('But she could'), t.at('And she told') - 2],
  ];
  return (
    <AbsoluteFill style={{background: C.night}}>
      <Audio src={staticFile(clips.dix.audio)} />
      <div style={{position: 'absolute', left: -60 - slide * 120, top: 0, height: 1080, width: 1000, opacity: dim,
        WebkitMaskImage: 'linear-gradient(90deg, #000 55%, transparent 96%)'}}>
        <Img src={staticFile('img/prep/dix_portrait.jpg')} style={{height: 1080, width: 1000, objectFit: 'cover', objectPosition: '50% 30%',
          transform: `scale(${1.04 + frame / 3000})`, filter: 'sepia(0.25) contrast(1.1) brightness(0.9)'}} />
      </div>
      <Vignette strength={0.7} />
      <div style={{position: 'absolute', left: 110, top: 850, opacity: life(frame, 6, t.at('And she told') - 2, 16, 10)}}>
        <div style={{fontFamily: F.serif, fontWeight: 300, fontSize: 80, color: C.bone, lineHeight: 1}}>Dorothea Dix</div>
        <div style={{fontFamily: F.sans, fontWeight: 600, fontSize: 22, letterSpacing: 8, color: C.bone, marginTop: 16, opacity: 0.85}}>1802 – 1887 · TEACHER AND REFORMER</div>
      </div>
      {beats.map(([txt, a, b], i) => (
        <Beat key={i} from={a} to={b} style={{left: 1000, top: 330 + i * 120}}>
          <div style={{fontFamily: F.serif, fontStyle: i === 2 ? 'normal' : 'italic', fontWeight: 300, fontSize: 78, color: i === 2 ? C.emberSoft : C.bone}}>{txt}</div>
        </Beat>
      ))}
      {frame >= qStart && (
        <div style={{position: 'absolute', left: 760, top: 190, width: 1060, opacity: life(frame, qStart, Infinity, 12)}}>
          <div style={{fontFamily: F.serif, fontWeight: 300, fontSize: 84, lineHeight: 1.16, color: C.bone}}>
            {quote.map((w, i) => {
              const s = w.s * 30;
              const on = interpolate(frame, [s - 2, s + 4], [0.14, 1], clamp);
              const hot = interpolate(frame, [s - 2, s + 2, s + 16], [0, 1, 0], clamp);
              return (
                <span key={i} style={{opacity: on, color: hot > 0.05 ? `rgba(255,122,61,${0.4 + hot * 0.6})` : undefined}}>
                  {i === 0 ? '“' : ''}{w.w.replace(/[“”"]/g, '')}{i === quote.length - 1 ? '”' : ''}{' '}
                </span>
              );
            })}
          </div>
          <div style={{fontFamily: F.sans, fontWeight: 600, fontSize: 21, letterSpacing: 5, color: C.bone, opacity: 0.7, marginTop: 44}}>
            — MEMORIAL TO THE LEGISLATURE OF MASSACHUSETTS, 1843
          </div>
        </div>
      )}
      <Source text="Daguerreotype, c. 1849" dark opacity={life(frame, 6, qStart, 16, 12)} />
      <Grain opacity={0.16} />
      {captions && <Captions words={words} style="cinema" hideFrom={[[t.at('Remember') - 2, t.at('And she told') - 2], [qStart, 99999]]} />}
    </AbsoluteFill>
  );
};

export const CinemaGallons: React.FC<{captions?: boolean}> = ({captions = true}) => {
  const frame = useCurrentFrame();
  const t = tl('gallons');
  const seven = t.at('seven');
  const three = t.at('three times');
  const today = t.at('today');
  const bar = (at: number, len: number) => interpolate(frame, [at, at + 18], [0, len], {...clamp, easing: (v) => 1 - Math.pow(1 - v, 3)});
  return (
    <AbsoluteFill style={{background: C.night}}>
      <Audio src={staticFile(clips.gallons.audio)} />
      <Img src={staticFile('img/prep/drunkards_art.jpg')} style={{position: 'absolute', width: '100%', height: '100%', objectFit: 'cover',
        transform: `scale(${1.1 + frame / 2500})`, filter: `blur(${interpolate(frame, [seven - 10, seven + 10], [0, 7], clamp)}px) saturate(0.5) brightness(${interpolate(frame, [seven - 10, seven + 10], [0.6, 0.25], clamp)})`}} />
      <Vignette strength={0.85} />
      <Beat from={t.at('number') - 4} to={seven - 6} style={{left: 0, right: 0, top: 800, textAlign: 'center'}}>
        <div style={{fontFamily: F.sans, fontWeight: 600, fontSize: 24, letterSpacing: 8, color: C.bone, opacity: 0.8}}>N. CURRIER · THE DRUNKARD’S PROGRESS · 1846</div>
      </Beat>
      {frame >= seven - 4 && (
        <div style={{position: 'absolute', left: 250, top: 70, display: 'flex', alignItems: 'center', gap: 50, opacity: life(frame, seven - 4, Infinity, 12)}}>
          <div style={{fontFamily: F.serif, fontWeight: 300, fontSize: 560, color: C.bone, lineHeight: 1, filter: `blur(${interpolate(frame, [seven - 4, seven + 10], [14, 0], clamp)}px)`}}>7</div>
          <div>
            <div style={{fontFamily: F.serif, fontStyle: 'italic', fontWeight: 300, fontSize: 130, color: C.bone, lineHeight: 1, opacity: life(frame, t.at('gallons'), Infinity, 10)}}>gallons</div>
            <div style={{fontFamily: F.sans, fontWeight: 600, fontSize: 25, letterSpacing: 7, color: C.bone, marginTop: 26, opacity: life(frame, t.at('pure alcohol'), Infinity, 10) * 0.85}}>
              OF PURE ALCOHOL · PER ADULT · PER YEAR · c. 1830
            </div>
          </div>
        </div>
      )}
      {frame >= three - 8 && (
        <div style={{position: 'absolute', left: 260, top: 690, fontFamily: F.mono, color: C.bone}}>
          {[
            ['1830', 7.1, C.ember, three - 8],
            ['TODAY', 2.5, 'rgba(237,231,220,0.75)', today - 4],
          ].map(([label, n, color, at], i) => (
            <div key={i} style={{display: 'flex', alignItems: 'center', gap: 26, height: 70, opacity: life(frame, at as number, Infinity, 8)}}>
              <div style={{width: 120, fontSize: 24, letterSpacing: 3}}>{label}</div>
              <div style={{height: 6, width: bar(at as number, (n as number) * 150), background: color as string}} />
              <div style={{fontSize: 24}}>{(n as number).toFixed(1)} gal</div>
            </div>
          ))}
          <div style={{position: 'absolute', left: 1000, top: 58, whiteSpace: 'nowrap', lineHeight: 1, fontFamily: F.serif, fontWeight: 300, fontSize: 100, color: C.emberSoft, opacity: life(frame, three + 6, Infinity, 12)}}>≈ 3×</div>
        </div>
      )}
      <Source text="Data: Rorabaugh, The Alcoholic Republic; NIAAA" dark opacity={life(frame, seven, Infinity, 12)} />
      <Grain opacity={0.16} />
      {captions && <Captions words={clips.gallons.n.words} style="cinema" />}
    </AbsoluteFill>
  );
};
