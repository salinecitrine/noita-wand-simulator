import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../store';
import { Wand } from '../types';
import { defaultWand } from './presets';

// Define a type for the slice state
interface WandState {
  wand: Wand;
  spells: (string | null)[];
}

// Define the initial state using that type
const initialState: WandState = {
  wand: defaultWand,
  spells: Array(defaultWand.deck_capacity).fill(null),
};

function fixArraySize<T>(arr: T[], size: number): (T | null)[] {
  if (size > arr.length) {
    return [...arr, ...Array(size - arr.length).fill(null)];
  } else if (size < arr.length) {
    return arr.slice(0, size);
  } else {
    return arr;
  }
}

export const wandSlice = createSlice({
  name: 'wand',
  initialState,
  reducers: {
    setWand: (
      state,
      action: PayloadAction<{ wand: Wand; spells?: string[] }>,
    ) => {
      const { wand, spells } = action.payload;
      state.wand = wand;

      if (spells) {
        state.spells = spells;
      }

      state.spells = fixArraySize(state.spells, wand.deck_capacity);
    },
    setSpells: (state, action: PayloadAction<string[]>) => {
      state.spells = action.payload;

      state.spells = fixArraySize(state.spells, state.wand.deck_capacity);
    },
    setSpellAtIndex: (
      state,
      action: PayloadAction<{ spell: string | null; index: number }>,
    ) => {
      const { spell, index } = action.payload;
      state.spells[index] = spell;
    },
    moveSpell: (
      state,
      action: PayloadAction<{ fromIndex: number; toIndex: number }>,
    ) => {
      const { fromIndex, toIndex } = action.payload;
      const sourceSpell = state.spells[fromIndex];

      state.spells[toIndex] = sourceSpell;
      state.spells[fromIndex] = null;
    },
    swapSpells: (
      state,
      action: PayloadAction<{ fromIndex: number; toIndex: number }>,
    ) => {
      const { fromIndex, toIndex } = action.payload;
      const sourceSpell = state.spells[fromIndex];
      const targetSpell = state.spells[toIndex];

      state.spells[toIndex] = sourceSpell;
      state.spells[fromIndex] = targetSpell;
    },
  },
});

export const { setWand, setSpells, setSpellAtIndex, moveSpell, swapSpells } =
  wandSlice.actions;

export const selectWand = (state: RootState): WandState => state.wand.present;

export default wandSlice.reducer;
