import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import store from './Store';
import './index.css';
import App from './App';
import registerServiceWorker from './registerServiceWorker';
import { inject } from './Store/container';

const domUtils = inject('DomUtils');

render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('root'));

registerServiceWorker();

domUtils.listenViewHeightChanges();