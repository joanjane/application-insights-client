import {
  GET_LOGS,
  SET_LOGS,
  CLEAR_DATA,
  PROFILE_LOADED,
  SET_CREDENTIALS,
  SET_AUTOREFRESH,
  SET_QUERY,
  ERROR
} from '../Actions/Types';

import { AUTOREFRESH_GET_LOGS_SOURCE } from '../Actions';
import { combineActiveReducers } from './combineActiveReducers';

const initialState = () => {
  return {
    logs: [],
    credentials: {
      appId: '',
      apiKey: ''
    },
    query: 'traces | sort by timestamp desc | limit 50',
    autoRefresh: true,
    refreshInterval: null,
    appName: null,
    fetchTime: null,
    error: null,
    availableApps: []
  }
};

export const rootReducer = combineActiveReducers([
  clearDataReducer,
  profileLoadedReducer,
  setCredentialsReducer,
  setAutoRefreshReducer,
  setQueryReducer,
  setLogsReducer,
  getLogsReducer,
  errorReducer
], initialState());

function profileLoadedReducer(state, action) {
  if (action.type !== PROFILE_LOADED) return;
  const loadedProps = {};
  if (action.payload.credentials) {
    loadedProps.credentials = action.payload.credentials;
  }
  if (action.payload.query) {
    loadedProps.query = action.payload.query;
  }
  if (action.payload.availableApps) {
    loadedProps.availableApps = action.payload.availableApps;
  }
  return { ...state, ...loadedProps };
}

function clearDataReducer(state, action) {
  if (action.type !== CLEAR_DATA) return;
  return { ...initialState() };
}

function setCredentialsReducer(state, action) {
  if (action.type !== SET_CREDENTIALS) return;
  return { ...state, credentials: action.payload };
}

function setAutoRefreshReducer(state, action) {
  if (action.type !== SET_AUTOREFRESH) return;
  return { ...state, autoRefresh: action.payload };
}

function setQueryReducer(state, action) {
  if (action.type !== SET_QUERY) return;
  return { ...state, query: action.payload };
}

function setLogsReducer(state, action) {
  if (action.type !== SET_LOGS) return;
  return {
    ...state,
    logs: action.payload.logs,
    appName: action.payload.appName,
    fetchTime: action.payload.fetchTime,
    loading: false,
    error: null
  };
}

function getLogsReducer(state, action) {
  if (action.type !== GET_LOGS) return;
  const skipLoading = action.payload === AUTOREFRESH_GET_LOGS_SOURCE && state.error;
  return { ...state, loading: skipLoading ? false : true };
}

function errorReducer(state, action) {
  if (action.type !== ERROR) return;
  return { ...state, error: action.payload, loading: false };
}