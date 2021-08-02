import { combineGroups } from '../combineGroups';

describe('combineGroups', () => {
  it('no-op', () => {
    const input = 'abc'.split('');
    const expected = ['a', 'b', 'c'];
    const actual = combineGroups(input);
    expect(actual).toEqual(expected);
  });

  it('simple 1', () => {
    const input = 'abccc'.split('');
    const expected = ['a', 'b', { first: 'c', count: 3 }];
    const actual = combineGroups(input);
    expect(actual).toEqual(expected);
  });

  it('simple 2', () => {
    const input = 'aabccca'.split('');
    const expected = [
      { first: 'a', count: 2 },
      'b',
      { first: 'c', count: 3 },
      'a',
    ];
    const actual = combineGroups(input);
    expect(actual).toEqual(expected);
  });

  it('>1 length', () => {
    const input = 'abab'.split('');
    const expected = [{ first: ['a', 'b'], count: 2 }];
    const actual = combineGroups(input);
    expect(actual).toEqual(expected);
  });

  it('nested', () => {
    const input = 'aaabaaab'.split('');
    const expected = [{ first: [{ first: 'a', count: 3 }, 'b'], count: 2 }];
    const actual = combineGroups(input);
    expect(actual).toEqual(expected);
  });

  it('nested 2', () => {
    const input = 'daacabaacabdd'.split('');
    const expected = [
      'd',
      {
        first: [{ first: 'a', count: 2 }, 'c', 'a', 'b'],
        count: 2,
      },
      { first: 'd', count: 2 },
    ];
    const actual = combineGroups(input);
    expect(actual).toEqual(expected);
  });

  it('nested 3', () => {
    const input = 'oogbgb oogbgb oogbgb oogbgb oogbgb oogbgb oogbgb oogbgb'
      .replace(/\s+/g, '')
      .split('');
    const expected = [
      {
        first: [
          { first: 'o', count: 2 },
          { first: ['g', 'b'], count: 2 },
        ],
        count: 8,
      },
    ];
    const actual = combineGroups(input);
    expect(actual).toEqual(expected);
  });
});
