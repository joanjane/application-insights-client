export const SET_AUTOREFRESH = 'SET_AUTOREFRESH';
export function setAutoRefresh(enabled) {
    return { type: SET_AUTOREFRESH, payload: enabled };
}