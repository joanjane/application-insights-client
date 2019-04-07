import { searchActionTypes } from '.';

export function setLogsAction(logs) {
  return { type: searchActionTypes.SET_LOGS, payload: logs };
}
