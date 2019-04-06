import { SET_AUTOREFRESH } from 'Actions/Search';

export function setAutoRefreshReducer(state, action) {
  if (action.type !== SET_AUTOREFRESH) return;

  state.search.autoRefresh = action.payload.enabled;

  return { ...state };
}