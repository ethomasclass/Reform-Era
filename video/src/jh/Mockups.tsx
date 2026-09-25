// Still mockups for the field-notebook documentary look (built as short compositions so they can animate later).
import React from 'react';
import {AbsoluteFill, Img, staticFile} from 'remotion';
import revival from '../../public/img/jh/masks/revival.json';
import wharf from '../../public/img/jh/masks/wharf.json';
import dix from '../../public/img/jh/masks/dix.json';
import {Arrow, ColourReveal, Finish, Grid, Highlight, INK, JF, Loop, MaskData, Note, Picture, Place, Tag, Tint, Traced, usePal, boxOf, accentOf} from './Kit';

const R = revival as unknown as MaskData;
const WH = wharf as unknown as MaskData;
const D = dix as unknown as MaskData;

export const JHRevival: React.FC = () => {
  const place: Place = {left: 0, top: 0, scale: 1920 / R.size[0]};
  const src = 'img/jh/cm_hero.jpg';
  return (
    <AbsoluteFill style={{background: INK}}>
      <Picture src={src} place={place} size={R.size} bw="grayscale(1) contrast(1.45) brightness(1.02)" />
      <ColourReveal src={src} place={place} size={R.size} from={0.58} to={0.92} filter="sepia(0.7) saturate(1.8) brightness(1.04) contrast(1.05)" />
      <Grid x={1180} y={0} w={740} h={560} />
      <Tint mask="img/jh/masks/revival_magenta_a.png" place={place} size={R.size} />
      <Traced paths={R.shapes.green} place={place} at={0} dur={1} part={0.86} width={4.5} />
      <Traced paths={R.shapes.magenta} place={place} at={0} dur={1} width={5} />
      <Loop cx={667} cy={396} rx={40} ry={33} tilt={-12} at={0} dur={1} width={5} seed={2} />
      <Highlight text="THE BURNED-OVER" after="DISTRICT" x={100} y={120} size={92} />
      <Tag text="Camp-Meeting · lithograph, c. 1829 · Library of Congress" />
      <Finish />
    </AbsoluteFill>
  );
};

export const JHCold: React.FC = () => {
  const s = 1920 / WH.size[0];
  const place: Place = {left: 0, top: (1080 - WH.size[1] * s) / 2, scale: s};
  const src = 'img/gen/savannah_wharf.jpg';
  return (
    <AbsoluteFill style={{background: INK}}>
      <Picture src={src} place={place} size={WH.size} bw="grayscale(1) contrast(1.25) brightness(1.02)" />
      <ColourReveal src={src} place={place} size={WH.size} from={0.5} to={0.82} filter="saturate(1.5) contrast(1.08) brightness(1.08)" />
      <Grid x={1020} y={0} w={900} h={560} />
      <Tint mask="img/jh/masks/wharf_magenta_a.png" place={place} size={WH.size} />
      <Traced paths={WH.shapes.magenta} place={place} at={0} dur={1} width={5} />
      <Note text="just in from Boston" x={1080} y={330} rot={-5} />
      <Arrow x1={1100} y1={400} x2={1000} y2={520} bow={-30} />
      <Highlight text="DECEMBER 1829" x={1010} y={640} size={96} seed={5} />
      <div style={{position: 'absolute', left: 1040, top: 770, fontFamily: JF.display, fontSize: 64, color: boxOf(usePal()), textShadow: '0 3px 14px rgba(0,0,0,0.6)'}}>SAVANNAH, GEORGIA</div>
      <Tag text="Illustration · Savannah waterfront, 1829" />
      <Finish />
    </AbsoluteFill>
  );
};

// Mitchell's 1836 map: city positions and an offshore route, in map pixels (4986 x 4608).
const MAP = {w: 4986, h: 4608};
const BOSTON = [3489, 1660];
const SAVANNAH = [2644, 3045];
const ROUTE = [BOSTON, [3560, 1690], [3690, 1730], [3660, 1840], [3450, 1940], [3380, 2080], [3330, 2230], [3230, 2420], [3260, 2690], [3080, 2900], [2880, 3010], SAVANNAH];

export const JHMap: React.FC = () => {
  const mid = [(BOSTON[0] + SAVANNAH[0]) / 2, (BOSTON[1] + SAVANNAH[1]) / 2];
  const s = 0.86;
  const rot = 36;
  const toScreen = ([x, y]: number[]) => {
    const a = (rot * Math.PI) / 180;
    const dx = (x - mid[0]) * s;
    const dy = (y - mid[1]) * s;
    return [960 + dx * Math.cos(a) - dy * Math.sin(a), 560 + dx * Math.sin(a) + dy * Math.cos(a)];
  };
  const b = toScreen(BOSTON);
  const sv = toScreen(SAVANNAH);
  const d = 'M' + ROUTE.map(([x, y]) => `${x},${y}`).join(' L');
  return (
    <AbsoluteFill style={{background: '#1a1814', overflow: 'hidden'}}>
      <div style={{position: 'absolute', left: 960 - mid[0] * s, top: 560 - mid[1] * s, width: MAP.w * s, height: MAP.h * s,
        transform: `rotate(${rot}deg)`, transformOrigin: `${mid[0] * s}px ${mid[1] * s}px`}}>
        <Img src={staticFile('img/jh/mitchell_1836.jpg')} style={{width: '100%', height: '100%', filter: 'grayscale(1) sepia(0.22) contrast(1.15) brightness(0.92)'}} />
        <svg style={{position: 'absolute', left: 0, top: 0, overflow: 'visible'}} width={MAP.w * s} height={MAP.h * s} viewBox={`0 0 ${MAP.w} ${MAP.h}`}>
          <path d={d} fill="none" stroke="rgba(0,0,0,0.45)" strokeWidth={16} strokeLinejoin="round" strokeLinecap="round" transform="translate(4 6)" />
          <path d={d} fill="none" stroke={usePal().mark} strokeWidth={12} strokeLinejoin="round" strokeLinecap="round" />
        </svg>
      </div>
      <AbsoluteFill style={{background: 'radial-gradient(ellipse at 50% 50%, transparent 40%, rgba(10,8,5,0.7) 100%)'}} />
      {[b, sv].map(([x, y], i) => (
        <div key={i} style={{position: 'absolute', left: x - 13, top: y - 13, width: 26, height: 26, borderRadius: '50%', background: accentOf(usePal()), border: `4px solid ${INK}`, boxShadow: '0 0 0 3px rgba(255,255,255,0.25)'}} />
      ))}
      <Highlight text="BOSTON" x={b[0] + 34} y={b[1] - 58} size={62} seed={7} />
      <Highlight text="SAVANNAH" x={sv[0] - 120} y={sv[1] + 34} size={62} seed={9} />
      <div style={{position: 'absolute', left: 90, top: 215, width: 330, transform: 'rotate(-4deg)'}}>
        <Img src={staticFile('img/prep/walker_torn.png')} style={{width: 330, filter: 'drop-shadow(0 18px 24px rgba(0,0,0,0.6))'}} />
        <div style={{position: 'absolute', left: 64, top: 16, width: 200, height: 40, background: INK, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: JF.display, fontSize: 30, color: boxOf(usePal())}}>? ? ?</div>
      </div>
      <Note text="60 copies" x={450} y={260} rot={-6} size={56} />
      <Arrow x1={300} y1={760} x2={sv[0] - 6} y2={sv[1] - 26} bow={-30} />
      <Highlight text="DECEMBER 1829" x={70} y={70} size={70} seed={11} />
      <Tag text="Mitchell's Map of the United States, 1836 · Library of Congress" />
      <Finish vignette={0.35} />
    </AbsoluteFill>
  );
};

// Dix memorial, 1904 reprint page (1642 x 2400): the quoted lines sit at y 1606-1706, x 135-1489.
export const JHDix: React.FC = () => {
  const ps = 0.9;
  const pl = 640 - 135 * ps;
  const pt = 560 - 1606 * ps;
  const L = (x: number) => pl + x * ps;
  const T = (y: number) => pt + y * ps;
  const cutH = 840;
  const cs = cutH / D.size[1];
  const cplace: Place = {left: -30, top: 1080 - cutH + 40, scale: cs};
  return (
    <AbsoluteFill style={{background: '#121212'}}>
      <div style={{position: 'absolute', inset: 0, transform: 'rotate(-1.5deg)', transformOrigin: '1100px 590px'}}>
        <Img src={staticFile('img/test/dix_p2.jpg')} style={{position: 'absolute', left: pl, top: pt, width: 1642 * ps, filter: 'saturate(0.55) contrast(1.1)'}} />
        <div style={{position: 'absolute', left: L(193), top: T(1612), width: (885 - 193) * ps, height: 42 * ps, background: boxOf(usePal()), mixBlendMode: 'multiply'}} />
        <div style={{position: 'absolute', left: L(120), top: T(1598), width: (1500 - 120) * ps, height: 114 * ps, boxShadow: '0 0 0 3000px rgba(8,8,8,0.72)', borderRadius: 4}} />
      </div>
      <Picture src="img/jh/dix_cut.png" place={cplace} size={D.size} bw="grayscale(1) contrast(1.15)" style={{filter: 'grayscale(1) contrast(1.15) drop-shadow(0 0 0 #fff) drop-shadow(0 20px 30px rgba(0,0,0,0.7))'}} />
      <Traced paths={D.shapes.magenta} place={cplace} at={0} dur={1} part={0.9} width={5} />
      <Highlight text="DOROTHEA DIX" x={390} y={880} size={62} seed={13} />
      <div style={{position: 'absolute', left: 414, top: 972, fontFamily: JF.sans, fontWeight: 600, fontSize: 24, color: '#fff', textShadow: '0 1px 8px #000'}}>1802–1887 · Memorial to the Legislature of Massachusetts, 1843</div>
      <Note text="her own words" x={1300} y={420} rot={-4} />
      <Arrow x1={1290} y1={450} x2={1180} y2={528} bow={-24} />
      <Tag text="Daguerreotype, c. 1849 · Memorial, 1904 reprint" x={44} y={40} />
      <Finish vignette={0.4} />
    </AbsoluteFill>
  );
};
