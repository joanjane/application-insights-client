import { createStore, applyMiddleware } from 'redux';
import { createEpicMiddleware } from 'redux-observable';
import { rootReducer } from 'Reducers';
import { rootEpic } from 'Epics';
import { resolveDepenency } from './container';

const epicMiddleware = createEpicMiddleware({
  dependencies: {
    inject: resolveDepenency
  }
});

const store = createStore(
  rootReducer,
  applyMiddleware(epicMiddleware)
);

epicMiddleware.run(rootEpic);

export default store;