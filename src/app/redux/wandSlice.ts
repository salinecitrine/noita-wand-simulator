import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from './store';
import { Wand } from '../types';
import { defaultWand } from './presets';
import { generateWandStateFromSearch } from './util';
import { fixArraySize } from '../util/util';

export interface WandState {
  wand: Wand;
  spells: (string | null)[];
  messages: string[];
}

const stateFromUrl = generateWandStateFromSearch(window.location.search);

// TODO these could be surfaced in the UI for debugging wand urls
console.debug(stateFromUrl.messages);

const initialState: WandState = {
  wand: {
    ...defaultWand,
    ...stateFromUrl.wand,
  },
  spells: fixArraySize(stateFromUrl.spells, stateFromUrl.wand.deck_capacity ?? defaultWand.deck_capacity),
  messages: stateFromUrl.messages || [],
};

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
