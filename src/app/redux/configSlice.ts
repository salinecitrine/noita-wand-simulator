import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../store';

// Define a type for the slice state
export interface ConfigState {
  config: {
    condenseShots: boolean;
    unlimitedSpells: boolean;
    infiniteSpells: boolean;
    showDivides: boolean;
    showDirectActionCalls: boolean;
    showDeckIndexes: boolean;
    showProxies: boolean;
    showSources: boolean;
  };
}

// Define the initial state using that type
const initialState: ConfigState = {
  config: {
    condenseShots: true,
    unlimitedSpells: true,
    infiniteSpells: false,
    showDivides: false,
    showDirectActionCalls: true,
    showDeckIndexes: true,
    showProxies: true,
    showSources: true,
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
