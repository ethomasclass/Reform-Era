import React from 'react';
import {AbsoluteFill, Composition, Series} from 'remotion';
import {life} from './lib/anim';
import {C, F, FontGate, FPS, H, W} from './lib/look';
import {useCurrentFrame} from 'remotion';
import {CinemaCold, CinemaDix, CinemaGallons} from './test/Cinematic';
import {CollageCold, CollageDix, CollageGallons} from './test/Collage';
import {frames, type ClipName} from './test/data';
import {JFonts, PALETTES, PaletteCtx} from './jh/Kit';
import {JHCold, JHDix, JHMap, JHRevival} from './jh/Mockups';
import {MapTest, MAP_TEST_FRAMES} from './jh/MapTest';
import {Ch01, CH01_FRAMES} from './ch/Ch01';

const SLATE = 75;

const Slate: React.FC<{letter: string; name: string; dark?: boolean}> = ({letter, name, dark}) => {
  const frame = useCurrentFrame();
  const o = life(frame, 0, SLATE, 10, 10);
  return (
    <AbsoluteFill style={{background: dark ? C.night : C.paper, alignItems: 'center', justifyContent: 'center', opacity: o}}>
      <div style={{fontFamily: F.mono, fontSize: 26, letterSpacing: 8, color: dark ? C.bone : C.ink, opacity: 0.7}}>STYLE TEST · FIX EVERYTHING</div>
      <div style={{fontFamily: dark ? F.serif : F.head, fontWeight: dark ? 300 : 400, fontSize: 120, color: dark ? C.bone : C.ink, marginTop: 20}}>
        <span style={{color: C.ember}}>{letter}</span> · {name}
      </div>
    </AbsoluteFill>
  );
};

const SCENES: {id: string; clip: ClipName; C: React.FC<{captions?: boolean}>}[] = [
  {id: 'A-Cold', clip: 'cold', C: CollageCold},
  {id: 'A-Dix', clip: 'dix', C: CollageDix},
  {id: 'A-Gallons', clip: 'gallons', C: CollageGallons},
  {id: 'B-Cold', clip: 'cold', C: CinemaCold},
  {id: 'B-Dix', clip: 'dix', C: CinemaDix},
  {id: 'B-Gallons', clip: 'gallons', C: CinemaGallons},
];

const Reel: React.FC = () => (
  <FontGate>
    <Series>
      <Series.Sequence durationInFrames={SLATE}><Slate letter="A" name="Modern archival collage" /></Series.Sequence>
      {SCENES.slice(0, 3).map((s) => (
        <Series.Sequence key={s.id} durationInFrames={frames(s.clip)}><s.C /></Series.Sequence>
      ))}
      <Series.Sequence durationInFrames={SLATE}><Slate letter="B" name="Cinematic documentary" dark /></Series.Sequence>
      {SCENES.slice(3).map((s) => (
        <Series.Sequence key={s.id} durationInFrames={frames(s.clip)}><s.C /></Series.Sequence>
      ))}
    </Series>
  </FontGate>
);

const reelFrames = 2 * SLATE + SCENES.reduce((a, s) => a + frames(s.clip), 0);

export const Root: React.FC = () => (
  <>
    <Composition id="Ch01" width={W} height={H} fps={FPS} durationInFrames={CH01_FRAMES} component={() => <JFonts><Ch01 /></JFonts>} />
    <Composition id="MapTest" width={W} height={H} fps={FPS} durationInFrames={MAP_TEST_FRAMES} component={() => <JFonts><MapTest /></JFonts>} />
    <Composition id="StyleTest" component={Reel} width={W} height={H} fps={FPS} durationInFrames={reelFrames} />
    {SCENES.map((s) => (
      <Composition key={s.id} id={s.id} width={W} height={H} fps={FPS} durationInFrames={frames(s.clip)}
        component={() => <FontGate><s.C /></FontGate>} />
    ))}
    {[['JH-Cold', JHCold], ['JH-Map', JHMap], ['JH-Revival', JHRevival], ['JH-Dix', JHDix]].map(([id, C]) => {
      const Comp = C as React.FC;
      return <Composition key={id as string} id={id as string} width={W} height={H} fps={FPS} durationInFrames={30} component={() => <JFonts><Comp /></JFonts>} />;
    })}
    {Object.keys(PALETTES).flatMap((p) =>
      [['Cold', JHCold], ['Map', JHMap], ['Revival', JHRevival], ['Dix', JHDix]].map(([n, C]) => {
        const Comp = C as React.FC;
        return (
          <Composition key={`${p}-${n}`} id={`P-${p}-${n}`} width={W} height={H} fps={FPS} durationInFrames={30}
            component={() => <PaletteCtx.Provider value={PALETTES[p]}><JFonts><Comp /></JFonts></PaletteCtx.Provider>} />
        );
      }),
    )}
  </>
);
