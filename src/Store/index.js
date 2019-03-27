import { createStore, applyMiddleware } from 'redux';
import { createEpicMiddleware } from 'redux-observable';
import { rootReducer } from 'Reducers';
import { rootEpic } from 'Epics';
import { inject } from './container';

const epicMiddleware = createEpicMiddleware({
  dependencies: {
    inject: inject
  }
});

const store = createStore(
  rootReducer,
  applyMiddleware(epicMiddleware)
);

epicMiddleware.run(rootEpic);

export default store;