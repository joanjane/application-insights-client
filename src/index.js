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

if (process.env.REACT_APP_TENANT_ID && process.env.REACT_APP_CLIENT_ID) {
  sessionStorage.setItem('aad.tenant', process.env.REACT_APP_TENANT_ID);
  sessionStorage.setItem('aad.clientid', process.env.REACT_APP_CLIENT_ID);
}