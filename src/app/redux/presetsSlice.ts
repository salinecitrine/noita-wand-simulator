import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from './store';
import { Preset, PresetGroup } from '../types';
import defaultPresets from './presets';

// Define a type for the slice state
interface PresetsState {
  presets: (Preset | PresetGroup)[];
}

// Define the initial state using that type
const initialState: PresetsState = {
  presets: defaultPresets,
};

export const presetsSlice = createSlice({
  name: 'presets',
  initialState,
  reducers: {
    setPresets: (state, action: PayloadAction<Preset[]>) => {
      state.presets = action.payload;
    },
  },
});

export const { setPresets } = presetsSlice.actions;

export const selectPresets = (state: RootState): PresetsState => state.presets;

export default presetsSlice.reducer;
