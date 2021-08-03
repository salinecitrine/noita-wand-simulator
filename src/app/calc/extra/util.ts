import {
  SetRandomSeed as SetRandomSeedExt,
  Random as RandomExt,
} from './random';

export function Random(min: number, max: number) {
  return RandomExt(min, max);
}

export function SetRandomSeed(a: number, b: number) {
  SetRandomSeedExt(0, a, b);
}
