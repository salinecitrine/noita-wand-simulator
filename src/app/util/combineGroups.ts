import { chunk } from './util';
import _ from 'lodash';

export type MultipleObject<T> = {
  first: GroupedObject<T>;
  count: number;
};
export type GroupedObject<T extends Object> =
  | T
  | MultipleObject<T>
  | GroupedObject<T>[];

export function isRawObject<T extends Object>(
  grouped: GroupedObject<T>,
): grouped is T {
  return (
    !Array.isArray(grouped) &&
    !grouped.hasOwnProperty('count') &&
    !grouped.hasOwnProperty('first')
  );
}

export function isMultipleObject<T extends Object>(
  grouped: GroupedObject<T>,
): grouped is MultipleObject<T> {
  return (
    !Array.isArray(grouped) &&
    grouped.hasOwnProperty('count') &&
    grouped.hasOwnProperty('first')
  );
}

export function isArrayObject<T extends Object>(
  grouped: GroupedObject<T>,
): grouped is GroupedObject<T>[] {
  return Array.isArray(grouped);
}

export function simplifyMultipleObject<T extends Object>(
  grouped: GroupedObject<T>,
): GroupedObject<T> {
  if (isMultipleObject(grouped) && grouped.count === 1) {
    const nested = simplifyMultipleObject(grouped.first);
    if (isRawObject(nested)) {
      return nested;
    }
  }

  return grouped;
}

function _mergeMatches<T, U extends GroupedObject<T>[]>(
  matches: U[],
  merge: (o: GroupedObject<T>[]) => GroupedObject<T>,
) {
  if (new Set(matches.map((m) => m.length)).size > 1) {
    throw Error('mismatched match sizes');
  }

  const result = [];
  for (let cmpi = 0; cmpi < matches[0].length; cmpi++) {
    result.push(merge(matches.map((m) => m[cmpi])));
  }

  return result;
}

function _key<T, K>(o: GroupedObject<T>, keyFn: (o: T) => K): GroupedObject<K> {
  if (isArrayObject(o)) {
    return o.map((oi) => _key(oi, keyFn));
  } else if (isMultipleObject(o)) {
    return { first: _key(o.first, keyFn), count: o.count };
  } else if (isRawObject(o)) {
    return keyFn(o);
  } else {
    throw Error(`Unknown type: ${o}`);
  }
}

function* _gen_factor_pairs(n: number) {
  if (!Number.isInteger(n)) {
    return;
  }
  for (let i = 1; i <= n; i++) {
    if (n % i === 0) {
      yield [n / i, i];
    }
  }
}

function* _gen_ms(len: number) {
  for (let d = len; d > 0; d--) {
    for (let [m, s] of _gen_factor_pairs(d)) {
      if (m >= 2) {
        yield [m, s];
      }
    }
  }
}

type Match = {
  start: number;
  seqLen: number;
  count: number;
};

function* _findMatches<T, K>(
  arr: GroupedObject<T>[],
  seqLen: number,
  k: (o: GroupedObject<T>) => T | K,
) {
  let ignoreIndexes = new Set<number>();
  for (let i = 0; i < arr.length - seqLen; i++) {
    if (ignoreIndexes.has(i)) {
      continue;
    }
    // i = start of comparison
    // compare arr[i] to arr[i+seqLen] for seqLen elements
    // keep checking a[i+seqLen*j] until it doesn't match
    // if >0 matches, replace all matched items with a MultipleObject
    let matches = 0;
    for (let matchi = 1; i + (matchi + 1) * seqLen - 1 < arr.length; matchi++) {
      // number of checked matches
      let match = true;
      for (let cmpi = 0; cmpi < seqLen; cmpi++) {
        // index within comparison
        const cmpA = k(arr[i + cmpi]);
        const cmpB = k(arr[i + matchi * seqLen + cmpi]);
        if (!_.isEqual(cmpA, cmpB)) {
          match = false;
          break;
        }
      }
      if (match) {
        matches++;
        ignoreIndexes.add(i + matchi * seqLen);
      } else {
        break;
      }
    }

    if (matches > 0) {
      let first: any = arr.slice(i, i + seqLen);
      if (first.length === 1) {
        first = first[0];
      }

      yield {
        start: i,
        seqLen: seqLen,
        count: matches + 1,
      };
    }
  }
}

function _abbreviateMatch<T>(
  arr: GroupedObject<T>[],
  match: Match,
  merge: (o: GroupedObject<T>[]) => GroupedObject<T>,
  matchCallback?: (arr: GroupedObject<T>) => GroupedObject<T>,
): GroupedObject<T>[] {
  const { start, seqLen, count } = match;
  let abbreviated: GroupedObject<T> = _mergeMatches(
    chunk(arr.slice(start, start + seqLen * count), seqLen),
    merge,
  );
  if (matchCallback) {
    abbreviated = matchCallback(abbreviated);
  }

  if (isArrayObject(abbreviated) && abbreviated.length === 1) {
    abbreviated = abbreviated[0];
  }

  const newObj: MultipleObject<GroupedObject<T>> = {
    first: abbreviated,
    count: count,
  };

  return [
    ...arr.slice(0, start),
    newObj,
    ...arr.slice(start + count * seqLen),
  ] as GroupedObject<T>[];
}

function _combineMatch<T, K>(
  arr: GroupedObject<T>[],
  k: (o: GroupedObject<T>) => T | K,
  merge: (o: GroupedObject<T>[]) => GroupedObject<T>,
  matchCallback: (o: GroupedObject<T>) => GroupedObject<T>,
): GroupedObject<T>[] | null {
  const matchCache = new Map<number, Match[]>();

  for (let [m, s] of _gen_ms(arr.length)) {
    if (!matchCache.has(s)) {
      matchCache.set(s, [..._findMatches(arr, s, k)]);
    }
    for (let match of matchCache.get(s)!) {
      if (match.count === m) {
        return _abbreviateMatch(arr, match, merge, matchCallback);
      }
    }
  }
  return null;
}

export function _combineGroups<T, K>(
  arr: GroupedObject<T>[],
  k: (o: GroupedObject<T>) => T | K,
  merge: (o: GroupedObject<T>[]) => GroupedObject<T> = (o) => o[0],
): GroupedObject<T>[] {
  if (!isArrayObject(arr)) {
    return [arr];
  }
  let result: GroupedObject<T> = arr;
  let newResult: GroupedObject<T> | null = arr;
  while (newResult != null) {
    result = newResult;
    newResult = _combineMatch(result, k, merge, (o) =>
      _combineGroups(isArrayObject(o) ? o : [o], k, merge),
    );
  }

  return result;
}

export function combineGroups<T, K>(
  arr: T[],
  keyFn: (o: T) => T | K = (o) => o,
  merge: (o: GroupedObject<T>[]) => GroupedObject<T> = (o) => o[0],
) {
  const keyCache = new Map<GroupedObject<T>, GroupedObject<T | K>>();
  const k = (o: GroupedObject<T>): GroupedObject<T | K> => {
    if (!keyCache.has(o)) {
      const newKey = _key(o, keyFn);
      keyCache.set(o, newKey);
    }
    return keyCache.get(o)!;
  };

  return _combineGroups(arr, k, merge);
}

export function mergeProperties<T, K extends keyof T>(
  group: T[],
  properties: { prop: K; conflictValue: T[K] }[],
): T {
  return {
    ...group[0],
    ...Object.fromEntries(
      properties.map(({ prop, conflictValue }) => [
        prop,
        _mergedProperty(group, prop, conflictValue),
      ]),
    ),
  };
}

function _mergedProperty<T, K extends keyof T>(
  group: T[],
  prop: K,
  conflictValue: T[K],
): T[K] {
  const allValues = new Set(group.map((o) => o[prop]));
  if (allValues.size === 1) {
    return allValues.values().next().value;
  } else {
    return conflictValue;
  }
}
