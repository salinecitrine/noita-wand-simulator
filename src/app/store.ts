import { configureStore } from '@reduxjs/toolkit';
import { default as wandReducer } from './redux/wandSlice';
import { default as presetsReducer } from './redux/presetsSlice';
import { default as configReducer, selectConfig } from './redux/configSlice';
import undoable from 'redux-undo';
import { saveState } from './localStorage';

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
