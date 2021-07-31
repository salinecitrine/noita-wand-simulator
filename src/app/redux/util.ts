import { WandState } from './wandSlice';
import { fixArraySize, trimArray } from '../util/util';

export function generateSearchFromWandState(state: WandState) {
  const simplifiedState = {
    ...state,
    spells: trimArray(state.spells, (o) => o === null),
  };
  const params = new URLSearchParams();
  Object.entries(simplifiedState.wand).forEach(([k, v]) => {
    params.append(k, v.toString());
  });
  return (
    '?' + params.toString() + '&spells=' + simplifiedState.spells.join(',')
  );
}

export function generateWandStateFromSearch(search: string) {
  const params = new URLSearchParams(search);
  const result = [...params.entries()].reduce((acc, [k, v]) => {
    if (k === 'spells') {
      acc.spells = trimArray(
        v.split(',').map((s) => (s.length === 0 ? null : s)),
        (s) => !s,
      );
      console.log(acc.spells);
    } else {
      if (!acc.wand) {
        acc.wand = {};
      }
      acc.wand[k] = JSON.parse(v);
    }
    return acc;
  }, {} as any) as WandState;
  if (result.wand && result.wand.deck_capacity) {
    result.spells = fixArraySize(result.spells, result.wand.deck_capacity);
  }
  return result;
}
