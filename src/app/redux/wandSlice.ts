import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from './store';
import { ActionLocation, Wand } from '../types';
import { defaultWand } from './presets';
import { generateWandStateFromSearch } from './util';
import { fixArraySize } from '../util/util';

export const MAX_PERMANENT_SPELLS = 4;

export interface WandState {
  wand: Wand;
  permanentSpells: (string | null)[];
  spells: (string | null)[];
}

const stateFromUrl = generateWandStateFromSearch(window.location.search);

const initialState: WandState = {
  wand: {
    ...defaultWand,
    ...stateFromUrl.wand,
  },
  permanentSpells:
    stateFromUrl.permanentSpells || Array(MAX_PERMANENT_SPELLS).fill(null),
  spells: stateFromUrl.spells || Array(defaultWand.deck_capacity).fill(null),
};

export const wandSlice = createSlice({
  name: 'wand',
  initialState,
  reducers: {
    setWand: (
      state,
      action: PayloadAction<{
        wand: Wand;
        permanentSpells?: string[];
        spells?: string[];
      }>,
    ) => {
      const { wand, spells, permanentSpells } = action.payload;
      state.wand = wand;

      if (spells) {
        state.spells = spells;
      }

      if (permanentSpells) {
        state.permanentSpells = permanentSpells;
      }

      state.spells = fixArraySize(state.spells, wand.deck_capacity);
      state.permanentSpells = fixArraySize(state.spells, MAX_PERMANENT_SPELLS);
    },
    setSpells: (state, action: PayloadAction<string[]>) => {
      state.spells = action.payload;

      state.spells = fixArraySize(state.spells, state.wand.deck_capacity);
    },
    setPermanentSpells: (state, action: PayloadAction<string[]>) => {
      state.permanentSpells = action.payload;

      state.permanentSpells = fixArraySize(state.spells, MAX_PERMANENT_SPELLS);
    },
    setSpellAtLocation: (
      state,
      action: PayloadAction<{ spell: string | null; location: ActionLocation }>,
    ) => {
      const { spell, location } = action.payload;
      state[location.list][location.index] = spell;
    },
    moveSpell: (
      state,
      action: PayloadAction<{ from: ActionLocation; to: ActionLocation }>,
    ) => {
      const { from, to } = action.payload;
      const sourceSpell = state[from.list][from.index];

      state[to.list][to.index] = sourceSpell;
      state[from.list][from.index] = null;
    },
    swapSpells: (
      state,
      action: PayloadAction<{ from: ActionLocation; to: ActionLocation }>,
    ) => {
      const { from, to } = action.payload;
      const sourceSpell = state[from.list][from.index];
      const targetSpell = state[to.list][to.index];

      state[to.list][to.index] = sourceSpell;
      state[from.list][from.index] = targetSpell;
    },
  },
});

export const { setWand, setSpells, setSpellAtLocation, moveSpell, swapSpells } =
  wandSlice.actions;

export const selectWand = (state: RootState): WandState => state.wand.present;

export default wandSlice.reducer;
