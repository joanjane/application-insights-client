import { searchActionTypes } from 'Actions/Search';

export function setAutoRefreshReducer(state, action) {
  if (action.type !== searchActionTypes.SET_AUTOREFRESH) return;

  state.search.autoRefresh = action.payload.enabled;

  return { ...state };
}