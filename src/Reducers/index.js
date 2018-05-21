import {
  getLogsReducer,
  setAutoRefreshReducer,
  setLogsReducer,
  setQueryReducer
} from './Logs';
import {
  clearDataReducer,
  profileLoadedReducer,
  setCredentialsReducer,
  availableAppsReducer
} from './Profile';
import { initialState } from './initialState';
import { errorReducer } from './errorReducer';
import { combineActiveReducers } from './combineActiveReducers';

export const rootReducer = combineActiveReducers([
  clearDataReducer,
  profileLoadedReducer,
  availableAppsReducer,
  setCredentialsReducer,
  setAutoRefreshReducer,
  setQueryReducer,
  setLogsReducer,
  getLogsReducer,
  errorReducer
], initialState());