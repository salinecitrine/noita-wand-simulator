import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { observeStore, RootState, store } from '../store';
import { loadState, saveState } from '../localStorage';

// Define a type for the slice state
export interface ConfigState {
  config: {
    condenseShots: boolean;
    unlimitedSpells: boolean;
    infiniteSpells: boolean;
    showDivides: boolean;
    showGreekSpells: boolean;
    showDirectActionCalls: boolean;
    showDeckIndexes: boolean;
    showProxies: boolean;
    showSources: boolean;
    swapOnMove: boolean;
  };
}

// Define the initial state using that type
const initialState: ConfigState = {
  config: {
    condenseShots: true,
    unlimitedSpells: true,
    infiniteSpells: false,
    showDivides: false,
    showGreekSpells: true,
    showDirectActionCalls: true,
    showDeckIndexes: true,
    showProxies: true,
    showSources: true,
    swapOnMove: true,
  },
};

const loadedInitialState = loadState();

export const configSlice = createSlice({
  name: 'config',
  initialState: {
    ...initialState,
    ...(loadedInitialState || {}),
  },
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
