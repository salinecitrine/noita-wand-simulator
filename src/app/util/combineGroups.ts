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

export function combineGroups<T>(
  arr: T[],
  keyFn?: (o: T) => any,
  merge?: (o: GroupedObject<T>[]) => GroupedObject<T>,
): GroupedObject<T>[] {
  let lastLength = -1;
  let result: GroupedObject<T>[] = arr;
  while (result.length !== lastLength) {
    lastLength = result.length;
    result = _combineGroups(result, keyFn, merge);
  }
  return result;
}

function mergeMatches<T, U extends GroupedObject<T>[]>(
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

export function _combineGroups<T>(
  arr: GroupedObject<T>[],
  keyFn?: (o: T) => any,
  merge?: (o: GroupedObject<T>[]) => GroupedObject<T>,
): GroupedObject<T>[] {
  const keyCache = new Map<GroupedObject<T>, any>();

  const k = (o: GroupedObject<T>): any => {
    if (!keyFn) {
      return o;
    }

    if (!keyCache.has(o)) {
      if (isArrayObject(o)) {
        return o.map((oi) => k(oi));
      } else if (isMultipleObject(o)) {
        return { first: k(o.first), count: o.count };
      } else if (isRawObject(o)) {
        return keyFn(o);
      } else {
        throw Error(`Unknown type: ${o}`);
      }
    }
  };

  const result: GroupedObject<T>[] = arr.slice();

  for (let seqLen = 1; seqLen <= result.length; seqLen++) {
    // compare all subsequences of length seqLen
    let foundAtLeastOneMatch = false;
    for (let i = 0; i < result.length - seqLen; i++) {
      // i = start of comparison
      // compare arr[i] to arr[i+seqLen] for seqLen elements
      // keep checking a[i+seqLen*j] until it doesn't match
      // if >0 matches, replace all matched items with a MultipleObject
      let matches = 0;
      for (
        let matchi = 1;
        i + (matchi + 1) * seqLen - 1 < result.length;
        matchi++
      ) {
        // number of checked matches
        let match = true;
        for (let cmpi = 0; cmpi < seqLen; cmpi++) {
          // index within comparison
          const cmpA = k(result[i + cmpi]);
          const cmpB = k(result[i + matchi * seqLen + cmpi]);
          if (cmpA === null || cmpB === null || !_.isEqual(cmpA, cmpB)) {
            match = false;
            break;
          }
        }
        if (match) {
          matches++;
        } else {
          break;
        }
      }

      if (matches > 0) {
        foundAtLeastOneMatch = true;
        let first: any = result.slice(i, i + seqLen);
        if (first.length === 1) {
          first = first[0];
        }
        const newObj: MultipleObject<GroupedObject<T>> = {
          first: merge
            ? mergeMatches(
                chunk(result.slice(i, i + seqLen * (matches + 1)), seqLen),
                merge,
              )
            : first,
          count: matches + 1,
        };
        result.splice(i, (matches + 1) * seqLen, newObj as any);
      }
    }
    if (foundAtLeastOneMatch) {
      seqLen--;
    }
  }

  return result;
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
