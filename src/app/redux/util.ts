import { WandState } from './wandSlice';
import { Wand } from '../types';
import { trimArray } from '../util/util';
import { defaultWand } from './presets';

const decodeQueryParam = (p: string) => {
  return decodeURIComponent(p.replace(/\+/g, ' '));
};

const encodeQueryParam = (p: string) => encodeURIComponent(p);

export function generateSearchFromWandState(state: WandState) {
  const simplifiedState = {
    ...state,
    spells: trimArray(state.spells, (o) => o === null),
  };
  const params = new URLSearchParams();
  Object.entries(simplifiedState.wand).forEach(([k, v]) => {
    if (typeof v === typeof true) {
      params.append(k, encodeQueryParam(Number(v).toString()));
    }
    params.append(k, encodeQueryParam(v.toString()));
  });
  return (
    '?' + params.toString() + '&spells=' + simplifiedState.spells.join(',')
  );
}

export interface ParsedWandState {
  wand: Wand;
  spells: (string | null)[];
  messages: string[];
}

type Entries<T> = {
  [K in keyof T]: [K, T[K]];
}[keyof T][];

const getEntries = <T extends object>(obj: T) =>
  Object.entries(obj) as Entries<T>;

export function generateWandStateFromSearch(search: string): ParsedWandState {
  const params = new URLSearchParams(search);

  return getEntries(defaultWand).reduce(
    (acc: ParsedWandState, [key]) => {
      if (params.has(key)) {
        const param = params.get(key as string);
        try {
          const decodedParam = decodeQueryParam(param!);
          if (decodedParam.length > 0) {
            try {
              acc.wand = { ...acc.wand, [key]: decodedParam };
            } catch (e) {
              acc.messages.push(
                `Could not parse param: '${key}' with value: '${param}', error: ${e}`,
              );
            }
          } else {
            acc.messages.push(`Decoded empty param: '${key}', using default`);
          }
        } catch (e) {
          acc.messages.push(
            `Could not decode param: '${key}' with value: '${param}', using default, error: ${e}`,
          );
        }
      } else {
        acc.messages.push(`Could not find param: '${key}', using default`);
      }
      return acc;
    },
    {
      wand: { ...defaultWand } as Wand,
      spells: trimArray(
        (params.get('spells') ?? '')
          .split(',')
          .map((s) => (s.length === 0 ? null : s)),
        (s) => !s,
      ),
      messages: [],
    } as ParsedWandState,
  );
}
