import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from './store';
import { loadState } from '../localStorage';
import _ from 'lodash';

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
    showRecursion: boolean;
    showProxies: boolean;
    showSources: boolean;
    showDontDraw: boolean;
    swapOnMove: boolean;
    showActionTree: boolean;
    showSpellsInCategories: boolean;
    unlocks: {
      [key: string]: boolean;
    };
    requirements: {
      enemies: boolean;
      projectiles: boolean;
      hp: boolean;
      half: boolean;
    };
  };
}

// Define the initial state using that type
export const initialState: ConfigState = {
  config: {
    condenseShots: true,
    unlimitedSpells: true,
    infiniteSpells: false,
    showDivides: true,
    showGreekSpells: true,
    showDirectActionCalls: true,
    showDeckIndexes: true,
    showRecursion: true,
    showProxies: true,
    showSources: true,
    showDontDraw: true,
    swapOnMove: true,
    showActionTree: true,
    showSpellsInCategories: false,
    unlocks: {
      card_unlocked_black_hole: false,
      card_unlocked_everything: false,
      card_unlocked_exploding_deer: false,
      card_unlocked_tentacle: false,
      card_unlocked_spiral_shot: false,
      card_unlocked_funky: false,
      card_unlocked_bomb_holy: false,
      card_unlocked_bomb_holy_giga: false,
      card_unlocked_crumbling_earth: false,
      card_unlocked_material_cement: false,
      card_unlocked_nuke: false,
      card_unlocked_nukegiga: false,
      card_unlocked_firework: false,
      card_unlocked_destruction: false,
      card_unlocked_musicbox: false,
      card_unlocked_pyramid: false,
      card_unlocked_maths: false,
      card_unlocked_mestari: false,
      card_unlocked_necromancy: false,
      card_unlocked_sea_lava: false,
      card_unlocked_cloud_thunder: false,
      card_unlocked_dragon: false,
      card_unlocked_ocarina: false,
      card_unlocked_kantele: false,
      card_unlocked_alchemy: false,
      card_unlocked_duplicate: false,
      card_unlocked_divide: false,
      card_unlocked_rain: false,
      card_unlocked_paint: false,
      card_unlocked_rainbow_trail: false,
    },
    requirements: {
      enemies: false,
      projectiles: false,
      hp: false,
      half: false,
    },
  },
};

const loadedInitialState = loadState();

export const configSlice = createSlice({
  name: 'config',
  initialState: _.merge(initialState, loadedInitialState || {}),
  reducers: {
    updateConfig: (
      state,
      action: PayloadAction<Partial<ConfigState['config']>>,
    ) => {
      state.config = { ...state.config, ...action.payload };
    },
  },
});

export const { updateConfig } = configSlice.actions;

export const selectConfig = (state: RootState): ConfigState => state.config;

export default configSlice.reducer;
