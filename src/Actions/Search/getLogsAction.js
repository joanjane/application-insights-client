import { searchActionTypes } from '.';

export const USER_SEARCH_GET_LOGS_SOURCE = 'USER_SEARCH';

export function getLogsAction() {
  return { type: searchActionTypes.GET_LOGS, payload: { source: USER_SEARCH_GET_LOGS_SOURCE } };
}