import {
    SET_CREDENTIALS,
    CLEAR_DATA,
    TRY_FIND_CREDENTIALS,
    SET_AUTOREFRESH,
    SET_QUERY,
    SET_LOGS,
    GET_LOGS,
    ERROR
} from './Types';

export function setCredentials(credentials) {
    return { type: SET_CREDENTIALS, payload: credentials };
}

export function query(query) {
    return { type: SET_QUERY, payload: query };
}

export function tryFindCredentials(appName) {
    return { type: TRY_FIND_CREDENTIALS, payload: appName };
}

export function clearData() {
    return { type: CLEAR_DATA, payload: null };
}

export function setAutoRefresh(enabled) {
    return { type: SET_AUTOREFRESH, payload: enabled };
}

export function setQuery(query) {
    return { type: SET_QUERY, payload: query };
}

export function setLogs(logs) {
    return { type: SET_LOGS, payload: logs };
}

export function getLogs() {
    return { type: GET_LOGS };
}

export const AUTOREFRESH_GET_LOGS_SOURCE = 'AUTOREFRESH';
export function refreshLogs() {
    return { type: GET_LOGS, payload: AUTOREFRESH_GET_LOGS_SOURCE };
}

export function empty() {
    return { type: 'never' };
}

export function error(reason) {
    return { type: ERROR, payload: reason };
}