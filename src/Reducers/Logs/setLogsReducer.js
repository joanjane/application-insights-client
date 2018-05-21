import { SET_LOGS } from '../../Actions/Logs';

export function setLogsReducer(state, action) {
    if (action.type !== SET_LOGS) return;
    return {
        ...state,
        logs: action.payload.logs,
        appName: action.payload.appName,
        fetchTime: action.payload.fetchTime,
        loading: false,
        error: null
    };
}