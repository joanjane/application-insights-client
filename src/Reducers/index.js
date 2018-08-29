import {
  getLogsReducer,
  setAutoRefreshReducer,
  setLogsReducer,
  setQueryReducer,
  setSearchPeriodReducer
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
  setSearchPeriodReducer,
  setLogsReducer,
  getLogsReducer,
  errorReducer
], initialState());