import { Observable } from 'rxjs/Observable';
import { anyCredentials } from './utils';
import { refreshLogs, SET_AUTOREFRESH } from '../../Actions/Logs';
import { PROFILE_LOADED } from '../../Actions/Profile';
const refreshTimeThreshold = 30000;

export const autoRefreshEpic = (action$, store) =>
    action$
        .filter(q =>
            (q.type === SET_AUTOREFRESH && q.payload) ||
            // set auto refresh on startup
            (q.type === PROFILE_LOADED && anyCredentials(q.payload.credentials))
        )
        .switchMap(q => {
            return Observable
                .interval(refreshTimeThreshold)
                .takeUntil(
                    action$
                        .ofType(SET_AUTOREFRESH)
                        .filter(q => !q.payload)
                )
                .map(logs => refreshLogs());
        });