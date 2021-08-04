import {
  Random as RandomExt,
  SetRandomSeed as SetRandomSeedExt,
} from './random';
import { store } from '../../redux/store';

export function Random(min: number, max: number) {
  return RandomExt(min, max);
}

export function SetRandomSeed(a: number, b: number) {
  SetRandomSeedExt(store.getState().config.config.random.worldSeed, a, b);
}

export function GameGetFrameNum() {
  return store.getState().config.config.random.frameNumber;
}
