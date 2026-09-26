// YouTube thumbnail concepts, drawn at 1920x1080 with the video's own kit and exported at 1280x720.
// Render the last frame so every write-on and stamp is finished: tools render stills at frame 140.
import React from 'react';
import {AbsoluteFill, Img, staticFile} from 'remotion';
import revival from '../public/img/jh/masks/revival.json';
import {Wordmark} from './ch/Intro';
import {MapView} from './ch/common';
import {Finish, Highlight, INK, JF, Loop, MaskData, Note, PALETTES, PaletteCtx, Picture, Place, Tint, Traced} from './jh/Kit';

export const THUMB_FRAMES = 150;
const R = revival as unknown as MaskData;
const TEAL = '#2FE0C4';
const CORAL = '#FF6F61';

/** Channel logo, top-left (YouTube covers the bottom-right with the running time). */
const Logo: React.FC = () => {
  const s = 0.27;
  return (
    <div style={{position: 'absolute', left: 36, top: 30, width: 1440 * s, height: 530 * s, overflow: 'hidden', borderRadius: 14, background: 'rgba(13,12,9,0.78)', boxShadow: '0 8px 24px rgba(0,0,0,0.6)'}}>
      <div style={{position: 'absolute', left: -170 * s, top: -275 * s, width: 1920, height: 1080, transform: `scale(${s})`, transformOrigin: '0 0'}}>
        <Wordmark clockAt={0} numAt={0} minAt={0} hisAt={0} />
      </div>
    </div>
  );
};

/** Hand-drawn check or cross. */
const Mark: React.FC<{x: number; y: number; ok: boolean; s?: number}> = ({x, y, ok, s = 1}) => (
  <svg style={{position: 'absolute', left: 0, top: 0, overflow: 'visible'}} width={1920} height={1080}>
    {ok ? (
      <path d={`M${x},${y} l${22 * s},${26 * s} l${46 * s},${-58 * s}`} fill="none" stroke={TEAL} strokeWidth={13 * s} strokeLinecap="round" strokeLinejoin="round" />
    ) : (
      <g stroke={CORAL} strokeWidth={14 * s} strokeLinecap="round">
        <path d={`M${x},${y - 30 * s} l${56 * s},${58 * s}`} />
        <path d={`M${x + 56 * s},${y - 32 * s} l${-54 * s},${60 * s}`} />
      </g>
    )}
  </svg>
);

/** A · The revival: the preacher in coral, the title, and a checklist of reforms. */
const ThumbA: React.FC = () => {
  const place: Place = {left: -250, top: -140, scale: 1.18};
  const items: [string, boolean][] = [['drinking', true], ['prisons', true], ['schools', true]];
  return (
    <AbsoluteFill style={{background: INK, overflow: 'hidden'}}>
      <Picture src="img/jh/cm_hero.jpg" place={place} size={R.size} bw="grayscale(1) contrast(1.45) brightness(0.9)" />
      <Tint mask="img/jh/masks/revival_magenta_a.png" place={place} size={R.size} />
      <Traced paths={R.shapes.magenta} place={place} at={0} dur={1} width={7} />
      <AbsoluteFill style={{background: 'linear-gradient(90deg, rgba(8,7,5,0) 30%, rgba(8,7,5,0.82) 62%, rgba(8,7,5,0.92) 100%)'}} />
      <Note text="The Time America Wanted to" x={880} y={80} size={60} rot={-2} color={TEAL} />
      <Highlight text="FIX" x={1110} y={200} size={220} at={0} seed={31} rot={-3} />
      <Highlight text="EVERYTHING" x={900} y={440} size={138} at={0} seed={33} rot={-2} />
      {items.map(([w, ok], i) => (
        <React.Fragment key={w}>
          <Mark x={1150} y={740 + i * 104} ok={ok} s={1.05} />
          <Note text={w} x={1245} y={668 + i * 104} size={74} rot={-2} color={ok ? '#f4efe6' : CORAL} />
        </React.Fragment>
      ))}
      <Logo />
      <Finish vignette={0.35} />
    </AbsoluteFill>
  );
};

/** B · The reformers: four real faces on the 1836 map. */
const ThumbB: React.FC = () => {
  const cards: [string, number, number, number, number][] = [
    ['img/prep/dix_portrait.jpg', 70, 380, 390, -4],
    ['img/ch02/finney.jpg', 480, 330, 400, 3],
    ['img/ch08/douglass.jpg', 900, 360, 400, -3],
    ['img/ch10/garrison_1835.jpg', 1320, 330, 400, 4],
  ];
  return (
    <AbsoluteFill style={{background: '#15130f', overflow: 'hidden'}}>
      <MapView cx={2600} cy={2250} s={0.5} dim={0.35} />
      <AbsoluteFill style={{background: 'radial-gradient(ellipse at 50% 60%, rgba(8,6,4,0.2) 30%, rgba(8,6,4,0.8) 100%)'}} />
      {cards.map(([src, x, y, w, rot], i) => (
        <div key={src} style={{position: 'absolute', left: x, top: y, width: w, transform: `rotate(${rot}deg)`, background: '#efe9dd', padding: 12, boxShadow: '0 24px 50px rgba(0,0,0,0.75)',
          outline: i === 2 ? `8px solid ${CORAL}` : undefined, outlineOffset: 8}}>
          <Img src={staticFile(src)} style={{width: w - 24, height: (w - 24) * 1.25, objectFit: 'cover', objectPosition: '50% 22%', display: 'block', filter: 'grayscale(1) contrast(1.2)'}} />
        </div>
      ))}
      <Note text="America, 1830s:" x={600} y={50} size={76} rot={-3} color={TEAL} />
      <Highlight text="FIX EVERYTHING" x={430} y={165} size={150} at={0} seed={41} rot={-2} />
      <Logo />
      <Finish vignette={0.35} />
    </AbsoluteFill>
  );
};

/** C · The mystery: the hidden pamphlet in Savannah, with the question from the cold open. */
const ThumbC: React.FC = () => (
  <AbsoluteFill style={{background: '#15130f', overflow: 'hidden'}}>
    <MapView cx={2644} cy={3045} s={1.5} rot={36} dim={0.3} />
    <AbsoluteFill style={{background: 'rgba(8,6,4,0.4)'}} />
    <div style={{position: 'absolute', left: 1180, top: 110, width: 560, transform: 'rotate(5deg)'}}>
      <Img src={staticFile('img/prep/walker_torn.png')} style={{width: 600, filter: 'drop-shadow(0 30px 40px rgba(0,0,0,0.8))'}} />
      <div style={{position: 'absolute', left: 118, top: 28, width: 364, height: 72, background: INK, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: JF.display, fontSize: 52, color: '#FF9F1C'}}>? ? ?</div>
    </div>
    <Loop cx={1480} cy={560} rx={400} ry={520} tilt={5} at={0} dur={1} width={9} color={CORAL} seed={51} />
    <Highlight text="FIX" x={110} y={300} size={230} at={0} seed={53} rot={-3} />
    <Highlight text="EVERYTHING" x={90} y={560} size={150} at={0} seed={55} rot={-2} />
    <Note text="why was Georgia so scared?" x={120} y={800} size={70} rot={-3} color={TEAL} />
    <Logo />
    <Finish vignette={0.35} />
  </AbsoluteFill>
);

const wrap = (C: React.FC) => () => (
  <PaletteCtx.Provider value={PALETTES.locked}>
    <C />
  </PaletteCtx.Provider>
);
export const ThumbnailA = wrap(ThumbA);
export const ThumbnailB = wrap(ThumbB);
export const ThumbnailC = wrap(ThumbC);
