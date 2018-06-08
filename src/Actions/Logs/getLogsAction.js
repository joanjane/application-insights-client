export const GET_LOGS = 'GET_LOGS';
export const USER_SEARCH_GET_LOGS_SOURCE = 'USER_SEARCH';

export function getLogsAction() {
    return { type: GET_LOGS, payload: { source: USER_SEARCH_GET_LOGS_SOURCE } };
}