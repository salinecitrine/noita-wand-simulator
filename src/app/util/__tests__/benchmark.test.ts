import { combineGroups } from '../combineGroups';
import _ from 'lodash';

const runBenchmark = <T extends any[], R>(
  fn: (...args: T) => R,
  input: T,
  expected: R,
  iterations: number,
) => {
  let times: number[] = [];
  for (let i = 0; i < iterations; i++) {
    const t0 = performance.now();
    const actual = fn(...input);
    expect(actual).toEqual(expected);
    const t1 = performance.now();
    times.push(t1 - t0);
  }
  const averageTime = _.mean(times);
  console.log(`${expect.getState().currentTestName}: ${averageTime}ms`);
};

describe('combineGroups', () => {
  it('d10-d10-d4-d2-d2-a', () => {
    const g1 = ['a', 'a'];
    const g2 = ['d2', ...g1].flat();
    const g3 = ['d2', ...Array(2).fill(g2)].flat();
    const g4 = ['d4', ...Array(4).fill(g3)].flat();
    const g5 = ['d10', ...Array(10).fill(g4)].flat();
    const input = ['d10', ...Array(10).fill(g5)].flat();
    const expected = [
      'd10',
      {
        count: 10,
        first: [
          'd10',
          {
            count: 10,
            first: [
              'd4',
              {
                count: 4,
                first: [
                  'd2',
                  {
                    count: 2,
                    first: [
                      'd2',
                      {
                        count: 2,
                        first: 'a',
                      },
                    ],
                  },
                ],
              },
            ],
          },
        ],
      },
    ];
    runBenchmark(combineGroups, [input], expected, 10);
  });

  it('2x d10-d10-d4-d2-d2-a with break', () => {
    const g1 = ['a', 'a'];
    const g2 = ['d2', ...g1].flat();
    const g3 = ['d2', ...Array(2).fill(g2)].flat();
    const g4 = ['d4', ...Array(4).fill(g3)].flat();
    const g5 = ['d10', ...Array(10).fill(g4)].flat();
    const g6 = ['d10', ...Array(10).fill(g5)].flat();
    const input = [...g6, 'b', ...g6];
    const expected = [
      'd10',
      {
        count: 10,
        first: [
          'd10',
          {
            count: 10,
            first: [
              'd4',
              {
                count: 4,
                first: [
                  'd2',
                  {
                    count: 2,
                    first: [
                      'd2',
                      {
                        count: 2,
                        first: 'a',
                      },
                    ],
                  },
                ],
              },
            ],
          },
        ],
      },
      'b',
      'd10',
      {
        count: 10,
        first: [
          'd10',
          {
            count: 10,
            first: [
              'd4',
              {
                count: 4,
                first: [
                  'd2',
                  {
                    count: 2,
                    first: [
                      'd2',
                      {
                        count: 2,
                        first: 'a',
                      },
                    ],
                  },
                ],
              },
            ],
          },
        ],
      },
    ];
    runBenchmark(combineGroups, [input], expected, 1);
  });

  it('4000x a', () => {
    const input = Array(4000).fill('a');
    const expected = [
      {
        count: 4000,
        first: 'a',
      },
    ];
    runBenchmark(combineGroups, [input], expected, 10);
  });
});
