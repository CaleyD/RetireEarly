'use strict';
import React from 'react';
import { Provider } from 'react-redux';
import store from './store.js';
import Routes from './Routes.js';

export default const App = () => (
  <Provider store={store}>
    <Routes />
  </Provider>
);
