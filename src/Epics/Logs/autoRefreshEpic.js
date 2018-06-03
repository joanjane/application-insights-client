import { Observable } from 'rxjs/Observable';
import { anyCredentials } from './utils';
import { refreshLogs, SET_AUTOREFRESH, SET_LOGS } from '../../Actions/Logs';
import { empty } from '../../Actions';
import { PROFILE_LOADED } from '../../Actions/Profile';
const refreshTimeThreshold = 30000;

export const autoRefreshEpic = (action$, store) =>
    action$
        .filter(q =>
            (q.type === SET_AUTOREFRESH && q.payload.enabled) ||
            // set auto refresh on startup and after setting logs, queue next refresh
            (isAutoRefreshEnabled(store) && ((q.type === SET_LOGS) || profileLoaded(q)))
        )
        .switchMap(q => {
            return Observable
                .timer(refreshTimeThreshold)
                .map(t => isAutoRefreshEnabled(store) ? refreshLogs() : empty());
        });

const isAutoRefreshEnabled = (store) => store.getState().autoRefresh;
const profileLoaded = (action) => action.type === PROFILE_LOADED && anyCredentials(action.payload.credentials);