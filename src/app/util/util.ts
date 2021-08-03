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
  while (result.length > 0 && predicate(result[result.length - 1])) {
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

export type TypedProperties<T, U> = Pick<
  T,
  {
    [K in keyof T]: T[K] extends U ? K : never;
  }[keyof T]
>;

export function numSign(v: any, round?: number) {
  if (round !== undefined) {
    v = Math.round(Number(v) * Math.pow(10, round)) / Math.pow(10, round);
  }
  return (v < 0 ? '' : '+') + v;
}

export function round(v: any, position: number) {
  return (
    Math.round(Number(v) * Math.pow(10, position)) / Math.pow(10, position)
  );
}

export function sign(v: number) {
  return (v < 0 ? '' : '+') + v;
}

export function forceDisableCanvasSmoothing() {
  // https://stackoverflow.com/a/22018649
  // save old getContext
  const oldGetContext = HTMLCanvasElement.prototype.getContext;

  // get a context, set it to smoothed if it was a 2d context, and return it.
  function getSmoothContext(this: any, contextType: any) {
    let resCtx = oldGetContext.apply(this, arguments as any);
    if (contextType === '2d') {
      setToFalse(resCtx, 'imageSmoothingEnabled');
      setToFalse(resCtx, 'mozImageSmoothingEnabled');
      setToFalse(resCtx, 'oImageSmoothingEnabled');
      setToFalse(resCtx, 'webkitImageSmoothingEnabled');
    }
    return resCtx;
  }

  function setToFalse(obj: any, prop: any) {
    if (obj[prop] !== undefined) obj[prop] = false;
  }

  // inject new smoothed getContext
  HTMLCanvasElement.prototype.getContext = getSmoothContext as any;
}

// https://stackoverflow.com/a/7616484
export function hashString(s: string) {
  let hash = 0;
  let i;
  let chr;
  if (s.length === 0) return hash;
  for (i = 0; i < s.length; i++) {
    chr = s.charCodeAt(i);
    hash = (hash << 5) - hash + chr;
    hash |= 0; // Convert to 32bit integer
  }
  return hash;
}
