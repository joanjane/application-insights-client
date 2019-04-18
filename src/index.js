import './index.css';
import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import registerServiceWorker from './registerServiceWorker';
import store from 'Store';
import { inject } from 'Store/container';
import App from 'Components/App';

const domUtils = inject('DomUtils');

render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('root'));

registerServiceWorker();

domUtils.listenViewHeightChanges();