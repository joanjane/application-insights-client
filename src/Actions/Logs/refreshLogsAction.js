export const AUTOREFRESH_GET_LOGS_SOURCE = 'AUTOREFRESH';
export const GET_LOGS = 'GET_LOGS';

export function refreshLogsAction() {
    return { type: GET_LOGS, payload: { source: AUTOREFRESH_GET_LOGS_SOURCE } };
}