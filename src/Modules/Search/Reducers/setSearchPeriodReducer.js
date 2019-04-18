import { searchActionTypes } from 'Modules/Search/Actions';

export function setSearchPeriodReducer(state, action) {
  if (action.type !== searchActionTypes.SET_SEARCH_PERIOD) return;

  state.search.searchPeriod = action.payload.searchPeriod || '';

  return { ...state };
}
