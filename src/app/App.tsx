import React from 'react';
import { WandSimulator } from './components/WandSimulator';
import { Provider } from 'react-redux';
import { store } from './store';

function App() {
  return (
    <Provider store={store}>
      <WandSimulator />
    </Provider>
  );
}

export default App;
