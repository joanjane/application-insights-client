import { searchActionTypes } from '.';

export function setAutoRefreshAction(enabled) {
  return { type: searchActionTypes.SET_AUTOREFRESH, payload: { enabled } };
}