export const SET_AUTOREFRESH = 'SET_AUTOREFRESH';
export function setAutoRefreshAction(enabled) {
    return { type: SET_AUTOREFRESH, payload: { enabled } };
}