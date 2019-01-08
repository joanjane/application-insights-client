import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import store from './Store';
import './index.css';
import App from './App';
import registerServiceWorker from './registerServiceWorker';
import DomUtils from 'Utils/DomUtils';

render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('root'));

registerServiceWorker();

DomUtils.listenViewHeightChanges();