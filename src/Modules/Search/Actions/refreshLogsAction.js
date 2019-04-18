import { searchActionTypes } from '.';
export const AUTOREFRESH_GET_LOGS_SOURCE = 'AUTOREFRESH';

export function refreshLogsAction() {
  return { type: searchActionTypes.GET_LOGS, payload: { source: AUTOREFRESH_GET_LOGS_SOURCE } };
}