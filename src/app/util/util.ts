import { Preset, PresetGroup } from '../types';

export function union<T, U>(setA: Set<T>, setB: Set<U>) {
  let _union = new Set<T | U>(setA);
  for (let elem of setB) {
    _union.add(elem);
  }
  return _union;
}

export function chunk<T>(arr: T[], chunkSize: number) {
  if (chunkSize <= 0) {
    throw Error('Invalid chunk size');
  }
  let result = [];
  for (let i = 0; i < arr.length; i += chunkSize)
    result.push(arr.slice(i, i + chunkSize));
  return result;
}

export function range(n: number) {
  return [...Array(n).keys()];
}

type DiffResult<T extends object> = Partial<
  { [key in keyof T]: { a: T[key]; b: T[key] } }
>;

export function diff<T extends object>(a: T, b: T) {
  const result: any = {};
  const keys = [...new Set([...Object.keys(a), ...Object.keys(b)])];
  keys.forEach((k) => {
    const aa: any = a;
    const ba: any = b;
    if (aa[k] !== ba[k]) {
      result[k] = { a: aa[k], b: ba[k] };
    }
  });
  return result as DiffResult<T>;
}

export function isSinglePreset(p: Preset | PresetGroup): p is Preset {
  return p.hasOwnProperty('spells');
}

export function isPresetGroup(p: Preset | PresetGroup): p is PresetGroup {
  return p.hasOwnProperty('presets');
}

export function notNull<T>(x: T | null): x is T {
  return x !== null;
}

export function notNullOrUndefined<T>(x: T | null | undefined): x is T {
  return x !== null && x !== undefined;
}

export const lazy = <T>(callback: () => T) => {
  let val: T | undefined = undefined;
  return () => {
    if (val === undefined) {
      val = callback();
    }
    return val;
  };
};

export const ACTION_TYPES = [
  'PROJECTILE',
  'STATIC_PROJECTILE',
  'MODIFIER',
  'DRAW_MANY',
  'MATERIAL',
  'OTHER',
  'UTILITY',
  'PASSIVE',
];

export function groupBy<T, K extends string>(arr: T[], keyFn: (x: T) => K) {
  return arr.reduce((acc, cur) => {
    const k = keyFn(cur);
    if (!acc[k]) {
      acc[k] = [];
    }
    acc[k].push(cur);
    return acc;
  }, {} as Record<K, T[]>);
}

export function constToDisplayString(c: string) {
  return c.replace(/_/g, ' ').replace(/\w\S*/g, function (txt) {
    return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
  });
}

export function omit<T extends object, K extends keyof T>(obj: T, keys: K[]) {
  return Object.fromEntries(
    Object.entries(obj).filter(([k, v]) => !keys.includes(k as K)),
  ) as Partial<T>;
}

export function trimArray<T>(arr: T[], predicate: (o: T) => boolean): T[] {
  let result = [...arr];
  while (predicate(result[result.length - 1]) && arr.length > 0) {
    result.pop();
  }
  return result;
}

export function fixArraySize<T>(arr: T[], size: number): (T | null)[] {
  if (size > arr.length) {
    return [...arr, ...Array(size - arr.length).fill(null)];
  } else if (size < arr.length) {
    return arr.slice(0, size);
  } else {
    return arr;
  }
}
