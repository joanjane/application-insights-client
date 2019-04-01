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
import { changeThemeReducer } from './UI';
import { initialState } from './initialState';
import { errorReducer } from './errorReducer';
import { combineActiveReducers } from './combineActiveReducers';
import { aadSubscriptionsReducer, aadSubscriptionAppsReducer } from './Profile/Account';

export const rootReducer = combineActiveReducers([
  clearDataReducer,
  profileLoadedReducer,
  availableAppsReducer,
  setCredentialsReducer,

  aadSubscriptionsReducer,
  aadSubscriptionAppsReducer,

  setAutoRefreshReducer,
  setQueryReducer,
  setSearchPeriodReducer,
  setLogsReducer,
  getLogsReducer,

  changeThemeReducer,
  errorReducer
], initialState());