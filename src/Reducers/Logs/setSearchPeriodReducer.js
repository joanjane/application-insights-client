import { SET_SEARCH_PERIOD } from '../../Actions/Logs';

export function setSearchPeriodReducer(state, action) {
  if (action.type !== SET_SEARCH_PERIOD) return;
  return { ...state, searchPeriod: action.payload.searchPeriod };
}
