import { GET_LOGS } from './getLogsAction';
export const AUTOREFRESH_GET_LOGS_SOURCE = 'AUTOREFRESH';

export function refreshLogsAction() {
  return { type: GET_LOGS, payload: { source: AUTOREFRESH_GET_LOGS_SOURCE } };
}