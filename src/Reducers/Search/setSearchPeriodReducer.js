import { searchActionTypes } from 'Actions/Search';

export function setSearchPeriodReducer(state, action) {
  if (action.type !== searchActionTypes.SET_SEARCH_PERIOD) return;

  state.search.searchPeriod = action.payload.searchPeriod || '';

  return { ...state };
}
