import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../store';

// Define a type for the slice state
export interface ConfigState {
  config: {
    condenseShots: boolean;
    hideDivides: boolean;
    hideDirectActionCalls: boolean;
    unlimitedSpells: boolean;
    infiniteSpells: boolean;
  };
}

// Define the initial state using that type
const initialState: ConfigState = {
  config: {
    condenseShots: true,
    hideDivides: true,
    hideDirectActionCalls: false,
    unlimitedSpells: true,
    infiniteSpells: false,
  },
};

export const configSlice = createSlice({
  name: 'presets',
  initialState,
  reducers: {
    updateConfig: (
      state,
      action: PayloadAction<Partial<ConfigState['config']>>
    ) => {
      state.config = { ...state.config, ...action.payload };
    },
  },
});

export const { updateConfig } = configSlice.actions;

export const selectConfig = (state: RootState): ConfigState => state.config;

export default configSlice.reducer;
