import React from 'react';
import { render, unmountComponentAtNode } from 'react-dom';
import { Provider } from 'react-redux';
import store from './Store';
import './index.css';
import App from './App';

it('renders without crashing', () => {
  const div = document.createElement('div');
  render(
    <Provider store={store}>
      <App />
    </Provider>
    , div);
  unmountComponentAtNode(div);
});