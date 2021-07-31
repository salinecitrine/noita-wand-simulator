import { configureStore } from '@reduxjs/toolkit';
import { default as wandReducer, selectWand } from './wandSlice';
import { default as presetsReducer } from './presetsSlice';
import { default as configReducer, selectConfig } from './configSlice';
import undoable from 'redux-undo';
import { saveState } from '../localStorage';
import { generateSearchFromWandState } from './util';

export const store = configureStore({
  reducer: {
    wand: undoable(wandReducer),
    presets: presetsReducer,
    config: configReducer,
  },
});

observeStore(selectConfig, (state) => {
  saveState(state);
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export function observeStore<T>(
  select: (rootState: RootState) => T,
  onChange: (newState: T) => void,
) {
  let currentState: T;

  function handleChange() {
    let nextState = select(store.getState());
    if (nextState !== currentState) {
      currentState = nextState;
      onChange(currentState);
    }
  }

  let unsubscribe = store.subscribe(handleChange);
  handleChange();
  return unsubscribe;
}

observeStore(selectWand, (state) => {
  const newSearch = generateSearchFromWandState(state);
  const currentSearch = window.location.search;

  if (currentSearch !== newSearch) {
    const url = new URL(window.location.href);
    url.search = newSearch;
    window.history.pushState({}, '', url.toString());
  }
});
