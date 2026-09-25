import cold from '../../public/audio/test_cold.words.json';
import dix from '../../public/audio/test_dix.words.json';
import gallons from '../../public/audio/test_gallons.words.json';
import {makeTimeline, type Narration} from '../lib/timing';
import {FPS} from '../lib/look';

export const TAIL = 24; // frames held after the last word

export const clips = {
  cold: {n: cold as Narration, audio: 'audio/test_cold.wav'},
  dix: {n: dix as Narration, audio: 'audio/test_dix.wav'},
  gallons: {n: gallons as Narration, audio: 'audio/test_gallons.wav'},
};
export type ClipName = keyof typeof clips;

export const tl = (c: ClipName) => makeTimeline(clips[c].n, FPS);
export const frames = (c: ClipName) => Math.ceil(clips[c].n.duration * FPS) + TAIL;
