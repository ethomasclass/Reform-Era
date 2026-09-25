// Shared pieces for the style test: fonts, film grain, captions synced to the narration, and marker strokes.
import React, {useEffect, useState} from 'react';
import {AbsoluteFill, continueRender, delayRender, interpolate, random, useCurrentFrame, useVideoConfig} from 'remotion';
import '@fontsource/anton/latin-400.css';
import '@fontsource/inter/latin-400.css';
import '@fontsource/inter/latin-600.css';
import '@fontsource/inter/latin-800.css';
import '@fontsource/fraunces/latin-300.css';
import '@fontsource/fraunces/latin-300-italic.css';
import '@fontsource/fraunces/latin-600.css';
import '@fontsource/ibm-plex-mono/latin-400.css';
import '@fontsource/ibm-plex-mono/latin-600.css';
import {clamp} from './anim';
import type {Word} from './timing';

export const W = 1920;
export const H = 1080;
export const FPS = 30;

export const F = {
  head: '"Anton", sans-serif',
  sans: '"Inter", sans-serif',
  serif: '"Fraunces", serif',
  mono: '"IBM Plex Mono", monospace',
};

export const C = {
  paper: '#EEE8DD',
  ink: '#16161A',
  ember: '#FF5A1F',
  night: '#0B0B0D',
  bone: '#EDE7DC',
  emberSoft: '#FF7A3D',
};

const FACES = [
  '400 20px Anton',
  '400 20px Inter',
  '600 20px Inter',
  '800 20px Inter',
  '300 20px Fraunces',
  'italic 300 20px Fraunces',
  '600 20px Fraunces',
  '400 20px "IBM Plex Mono"',
  '600 20px "IBM Plex Mono"',
];

/** Holds the render until every face is loaded, so no frame is drawn in a fallback font. */
export const FontGate: React.FC<{children: React.ReactNode}> = ({children}) => {
  const [handle] = useState(() => delayRender('fonts'));
  useEffect(() => {
    Promise.all(FACES.map((f) => document.fonts.load(f))).then(() => continueRender(handle));
  }, [handle]);
  return <>{children}</>;
};

/** Animated film grain. */
export const Grain: React.FC<{opacity?: number; blend?: React.CSSProperties['mixBlendMode']}> = ({opacity = 0.12, blend = 'overlay'}) => {
  const frame = useCurrentFrame();
  const seed = Math.floor(frame / 2) % 50;
  return (
    <AbsoluteFill style={{opacity, mixBlendMode: blend, pointerEvents: 'none'}}>
      <svg width="100%" height="100%">
        <filter id={`g${seed}`}>
          <feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves="2" seed={seed} stitchTiles="stitch" />
          <feColorMatrix type="saturate" values="0" />
        </filter>
        <rect width="100%" height="100%" filter={`url(#g${seed})`} />
      </svg>
    </AbsoluteFill>
  );
};

export const Vignette: React.FC<{strength?: number}> = ({strength = 0.75}) => (
  <AbsoluteFill style={{background: `radial-gradient(ellipse at 50% 45%, rgba(0,0,0,0) 45%, rgba(0,0,0,${strength}) 100%)`, pointerEvents: 'none'}} />
);

/** Seconds -> frame of the i-th word. */
export const wf = (words: Word[], i: number, fps: number) => Math.round(words[i].s * fps);

/**
 * Captions: the narration in short chunks (a new chunk at each sentence or every ~7 words); the
 * spoken word is full strength, words still to come are dimmer, and `key` words take the accent.
 */
export const Captions: React.FC<{
  words: Word[];
  style: 'collage' | 'cinema';
  hideFrom?: number[][];
}> = ({words, style, hideFrom = []}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const t = frame / fps;
  const chunks: number[][] = [];
  let cur: number[] = [];
  words.forEach((w, i) => {
    cur.push(i);
    if (/[.!?:]["”]?$/.test(w.w) || cur.length >= 7 || w.para_end) {
      chunks.push(cur);
      cur = [];
    }
  });
  if (cur.length) chunks.push(cur);
  const ci = chunks.findIndex((c, k) => t >= words[c[0]].s - 0.05 && (k + 1 >= chunks.length || t < words[chunks[k + 1][0]].s - 0.05));
  if (ci < 0) return null;
  const chunk = chunks[ci];
  const last = words[chunk[chunk.length - 1]];
  if (t > last.e + 0.6) return null;
  if (hideFrom.some(([a, b]) => frame >= a && frame < b)) return null;
  const cinema = style === 'cinema';
  return (
    <AbsoluteFill style={{justifyContent: 'flex-end', alignItems: 'center', paddingBottom: cinema ? 70 : 60}}>
      <div
        style={{
          fontFamily: F.sans,
          fontWeight: cinema ? 400 : 600,
          fontSize: cinema ? 38 : 40,
          letterSpacing: cinema ? 0.3 : -0.2,
          color: cinema ? C.bone : '#fff',
          background: cinema ? 'transparent' : 'rgba(22,22,26,0.88)',
          padding: cinema ? 0 : '10px 22px',
          borderRadius: cinema ? 0 : 6,
          textShadow: cinema ? '0 2px 12px rgba(0,0,0,0.9)' : 'none',
          maxWidth: 1400,
          textAlign: 'center',
        }}
      >
        {chunk.map((i) => {
          const w = words[i];
          const spoken = t >= w.s;
          const key = w.k === 'key';
          return (
            <span key={i} style={{opacity: spoken ? 1 : 0.45, color: key && spoken ? (cinema ? C.emberSoft : C.ember) : undefined}}>
              {w.w.replace(/[“”"]/g, '')}{' '}
            </span>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};

/** A hand-drawn marker loop around a box, drawn on over `dur` frames. */
export const MarkerLoop: React.FC<{x: number; y: number; w: number; h: number; at: number; dur?: number; color?: string; seed?: number; width?: number}> = ({
  x, y, w, h, at, dur = 14, color = C.ember, seed = 1, width = 9,
}) => {
  const frame = useCurrentFrame();
  const p = interpolate(frame, [at, at + dur], [0, 1], clamp);
  const pts: string[] = [];
  const n = 60;
  for (let i = 0; i <= n + 5; i++) {
    const a = (i / n) * Math.PI * 2 - 2.2;
    const wob = 1 + (random(`${seed}-${i}`) - 0.5) * 0.025 + (i / n) * 0.035;
    pts.push(`${(x + w / 2 + Math.cos(a) * (w / 2) * wob).toFixed(1)},${(y + h / 2 + Math.sin(a) * (h / 2) * wob).toFixed(1)}`);
  }
  const len = 3.3 * (w + h) * 1.15;
  return (
    <svg style={{position: 'absolute', left: 0, top: 0, overflow: 'visible'}} width={W} height={H}>
      <polyline points={pts.join(' ')} fill="none" stroke={color} strokeWidth={width} strokeLinecap="round" strokeLinejoin="round"
        strokeDasharray={len} strokeDashoffset={len * (1 - p)} />
    </svg>
  );
};

/** A marker strike through a line of text. */
export const Strike: React.FC<{x: number; y: number; w: number; at: number; color?: string}> = ({x, y, w, at, color = C.ember}) => {
  const frame = useCurrentFrame();
  const p = interpolate(frame, [at, at + 7], [0, 1], clamp);
  return (
    <svg style={{position: 'absolute', left: 0, top: 0, overflow: 'visible'}} width={W} height={H}>
      <path d={`M ${x} ${y + 4} Q ${x + w / 2} ${y - 6} ${x + w} ${y - 2}`} fill="none" stroke={color} strokeWidth={10} strokeLinecap="round"
        strokeDasharray={w * 1.1} strokeDashoffset={w * 1.1 * (1 - p)} />
    </svg>
  );
};

/** Small source line, bottom-left. */
export const Source: React.FC<{text: string; dark?: boolean; opacity?: number; bottom?: boolean}> = ({text, dark, opacity = 1, bottom}) => (
  <div style={{position: 'absolute', left: 48, ...(bottom ? {bottom: 40} : {top: 40}), fontFamily: F.mono, fontSize: 19, letterSpacing: 0.5, opacity,
    color: dark ? 'rgba(237,231,220,0.7)' : 'rgba(22,22,26,0.75)', textTransform: 'uppercase'}}>{text}</div>
);
