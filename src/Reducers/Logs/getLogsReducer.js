import { GET_LOGS, AUTOREFRESH_GET_LOGS_SOURCE } from '../../Actions/Logs';

export function getLogsReducer(state, action) {
    if (action.type !== GET_LOGS) return;
    const skipLoading = action.payload.source === AUTOREFRESH_GET_LOGS_SOURCE && state.error;
    return { ...state, loading: skipLoading ? false : true };
}
