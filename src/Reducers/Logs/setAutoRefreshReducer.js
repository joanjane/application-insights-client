import { SET_AUTOREFRESH } from 'Actions/Logs';

export function setAutoRefreshReducer(state, action) {
  if (action.type !== SET_AUTOREFRESH) return;
  return { ...state, autoRefresh: action.payload.enabled };
}