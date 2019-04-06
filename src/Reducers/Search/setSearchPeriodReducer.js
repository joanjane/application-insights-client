import { SET_SEARCH_PERIOD } from 'Actions/Search';

export function setSearchPeriodReducer(state, action) {
  if (action.type !== SET_SEARCH_PERIOD) return;

  state.search.searchPeriod = action.payload.searchPeriod || '';

  return { ...state };
}
