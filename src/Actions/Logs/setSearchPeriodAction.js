export const SET_SEARCH_PERIOD = 'SET_SEARCH_PERIOD';
export function setSearchPeriodAction(searchPeriod) {
  return { type: SET_SEARCH_PERIOD, payload: { searchPeriod } };
}