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

export const wandSlice = createSlice({
  name: 'wand',
  initialState,
  reducers: {
    setWand: (state, action: PayloadAction<Wand>) => {
      state.wand = action.payload;
    },
    setSpells: (state, action: PayloadAction<string[]>) => {
      state.spells = action.payload;

      while (state.spells.length < state.wand.deck_capacity) {
        state.spells.push(null);
      }
    },
    setSpellAtIndex: (
      state,
      action: PayloadAction<{ spell: string | null; index: number }>
    ) => {
      const { spell, index } = action.payload;
      state.spells[index] = spell;
    },
    moveSpell: (
      state,
      action: PayloadAction<{ fromIndex: number; toIndex: number }>
    ) => {
      const { fromIndex, toIndex } = action.payload;
      const sourceSpell = state.spells[fromIndex];

      state.spells[toIndex] = sourceSpell;
      state.spells[fromIndex] = null;
    },
    swapSpells: (
      state,
      action: PayloadAction<{ fromIndex: number; toIndex: number }>
    ) => {
      const { fromIndex, toIndex } = action.payload;
      const sourceSpell = state.spells[fromIndex];
      const targetSpell = state.spells[toIndex];

      state.spells[toIndex] = sourceSpell;
      state.spells[fromIndex] = targetSpell;
    },
  },
});

export const { setWand, setSpells, setSpellAtIndex, moveSpell } =
  wandSlice.actions;

export const selectWand = (state: RootState) => state.wand;

export default wandSlice.reducer;
