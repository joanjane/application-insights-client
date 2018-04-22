import {
  SET_CREDENTIALS,
  CLEAR_DATA,
  SET_AUTOREFRESH,
  SET_QUERY,
  GET_LOGS,
  SET_LOGS,
  ERROR
} from '../Actions/Types';
import ProfileRepository from '../Services/ProfileRepository';
import { AUTOREFRESH_GET_LOGS_SOURCE } from '../Actions';

const profileRepository = new ProfileRepository();
const storedCredentials = profileRepository.getCredentials();
const availableApps = profileRepository.getStoredAppNamesCredentials();
const query = profileRepository.getQuery();

const initialState = (useStartupValues) => {
  return {
    logs: [],
    credentials: useStartupValues && storedCredentials ?
      storedCredentials :
      {
        appId: '',
        apiKey: ''
      },
    query: useStartupValues && query ? query : 'traces | sort by timestamp desc | limit 50',
    autoRefresh: true,
    refreshInterval: null,
    appName: null,
    fetchTime: null,
    error: null,
    availableApps: useStartupValues && availableApps ? availableApps : []
  }
};
const defaultState = initialState(true);

const rootReducer = (state = defaultState, action) => {
  switch (action.type) {
    case SET_CREDENTIALS:
      return setCredentialsReducer(state, action);
    case CLEAR_DATA:
      return clearDataReducer(state, action);
    case SET_AUTOREFRESH:
      return setAutoRefreshReducer(state, action);
    case SET_LOGS:
      return setLogsReducer(state, action);
    case GET_LOGS:
      return getLogsReducer(state, action);
    case SET_QUERY:
      return setQueryReducer(state, action);
    case ERROR:
      return errorReducer(state, action);
    default:
      return state;
  }
};
export default rootReducer;

function setCredentialsReducer(state, action) {
  return { ...state, credentials: action.payload };
}

function clearDataReducer(state, action) {
  return { ...initialState() };
}

function setAutoRefreshReducer(state, action) {
  return { ...state, autoRefresh: action.payload };
}

function setLogsReducer(state, action) {
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
  const skipLoading = action.payload === AUTOREFRESH_GET_LOGS_SOURCE && state.error;
  return { ...state, loading: skipLoading ? false : true };
}

function setQueryReducer(state, action) {
  return { ...state, query: action.payload };
}

function errorReducer(state, action) {
  return { ...state, error: action.payload, loading: false };
}