import { searchActionTypes } from '.';

export function setSearchPeriodAction(searchPeriod) {
  return { type: searchActionTypes.SET_SEARCH_PERIOD, payload: { searchPeriod } };
}