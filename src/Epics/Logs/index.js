import { Observable } from 'rxjs/Observable';
import {
    GET_LOGS,
    SET_AUTOREFRESH,
    PROFILE_LOADED
} from '../../Actions/Types';

import {
    setLogs,
    setCredentials,
    refreshLogs,
    error,
    AUTOREFRESH_GET_LOGS_SOURCE
} from '../../Actions';
const refreshTimeThreshold = 30000;

export const getLogsEpic = (action$, store, {applicationInsightsClient, DomUtils}) =>
    action$.ofType(GET_LOGS, PROFILE_LOADED)
        .filter(action => {
            const state = store.getState();
            return anyCredentials(state.credentials) &&
                !(action.payload === AUTOREFRESH_GET_LOGS_SOURCE && state.error);
        })
        .switchMap(q => {
            const forceScrollEnd = DomUtils.isScrollEnd('.ait-body');
            const state = store.getState();

            return applicationInsightsClient.getLogs(state.credentials, state.query)
                .flatMap(logs => Observable.of(
                    setLogs(logs),
                    setCredentials({ ...store.getState().credentials, appName: logs.appName }))
                )
                .catch(err => {
                    let reason = null;
                    if (err.response && err.response.error) {
                        reason = err.response.error.message || err.message;
                    }
                    return Observable.of(error(reason || 'Error when getting logs'));
                })
                .do(() => {
                    if (forceScrollEnd) {
                        DomUtils.scrollBottom('.ait-body');
                    }
                });
        });

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


function anyCredentials(credentials) {
    return credentials && credentials.appId && credentials.apiKey;
}