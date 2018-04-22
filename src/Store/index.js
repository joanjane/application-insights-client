import { createStore, applyMiddleware } from 'redux';
import 'rxjs';
import { createEpicMiddleware } from 'redux-observable';
import rootReducer from '../Reducers';
import { rootEpic } from '../Epics';

const epicMiddleware = createEpicMiddleware(rootEpic);

const store = createStore(
    rootReducer,
    applyMiddleware(epicMiddleware)
);
export default store;