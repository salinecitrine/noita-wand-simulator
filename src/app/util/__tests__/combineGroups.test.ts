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

  it('long group', () => {
    const input = Array(800).fill('x');
    const expected = [
      {
        first: 'x',
        count: 800,
      },
    ];
    const actual = combineGroups(input);
    expect(actual).toEqual(expected);
  });

  it('d10-d4-d2-a', () => {
    const g1 = ['a', 'a'];
    const g2 = ['d2', ...g1].flat();
    const g3 = ['d4', ...Array(4).fill(g2)].flat();
    const input = ['d10', ...Array(10).fill(g3)].flat();
    const expected = [
      'd10',
      {
        first: [
          'd4',
          {
            first: [
              'd2',
              {
                first: 'a',
                count: 2,
              },
            ],
            count: 4,
          },
        ],
        count: 10,
      },
    ];
    const actual = combineGroups(input);
    expect(actual).toEqual(expected);
  });

  it('d10-d10-d10-a', () => {
    const g1 = ['a'];
    const g2 = ['d10', ...g1].flat();
    const g3 = ['d10', ...Array(10).fill(g2)].flat();
    const input = ['d10', ...Array(10).fill(g3)].flat();
    const expected = [
      'd10',
      {
        first: [
          'd10',
          {
            first: ['d10', 'a'],
            count: 10,
          },
        ],
        count: 10,
      },
    ];
    const actual = combineGroups(input);
    expect(actual).toEqual(expected);
  });
});
