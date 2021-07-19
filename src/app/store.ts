import { configureStore } from '@reduxjs/toolkit';
import { default as wandReducer } from './redux/wandSlice';
import { default as presetsReducer } from './redux/presetsSlice';
import { default as configReducer } from './redux/configSlice';
import undoable from 'redux-undo';

export const store = configureStore({
  reducer: {
    wand: undoable(wandReducer),
    presets: presetsReducer,
    config: configReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
