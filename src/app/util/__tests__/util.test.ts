import { trimArray } from '../util';

describe('trimArray', () => {
  it('simple example', () => {
    const input = [1, 2, 3, null];
    const expected = [1, 2, 3];

    const result = trimArray(input, (o) => o === null);
    expect(result).toEqual(expected);
  });

  it('empty array', () => {
    const input = [] as any[];
    const expected = [] as any[];

    const result = trimArray(input, (o) => o === null);
    expect(result).toEqual(expected);
  });

  it('nothing to remove', () => {
    const input = [1, 2, 3];
    const expected = [1, 2, 3];

    const result = trimArray(input, (o) => o === null);
    expect(result).toEqual(expected);
  });

  it('nulls in the middle of the array', () => {
    const input = [1, 2, null, 3, null];
    const expected = [1, 2, null, 3];

    const result = trimArray(input, (o) => o === null);
    expect(result).toEqual(expected);
  });
});
