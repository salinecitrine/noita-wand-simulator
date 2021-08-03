import { Random, random_seed } from '../extra/random';
import { SetRandomSeed } from '../extra/util';

beforeEach(() => {
  SetRandomSeed(0, 100);
});

it('random', () => {
  expect(Random(5, 5)).toEqual(5);
});
