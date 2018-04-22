import { Observable } from 'rxjs/Observable';
import {
    GET_LOGS,
    SET_AUTOREFRESH
} from '../../Actions/Types';

import {
    setLogs,
    setCredentials,
    refreshLogs,
    error,
    AUTOREFRESH_GET_LOGS_SOURCE
} from '../../Actions';

import ApplicationInsightsClient from '../../Services/ApplicationInsightsClient';
import DomUtils from '../../Utils/DomUtils';
const refreshTimeThreshold = 30000;

/* logs epics */
const client = new ApplicationInsightsClient();
export const getLogsEpic = (action$, store) =>
    action$.ofType(GET_LOGS)
        .filter(action => {
            const state = store.getState();
            const is = anyCredentials(state.credentials) &&
                !(action.payload === AUTOREFRESH_GET_LOGS_SOURCE && state.error);
            return is;
        })
        .switchMap(q => {
            const forceScrollEnd = DomUtils.isScrollEnd('.ait-body');
            const state = store.getState();

            return client.getLogs(state.credentials, state.query)
                .flatMap(logs => Observable.of(
                    setLogs(logs),
                    setCredentials({ ...store.getState().credentials, appName: logs.appName }))
                )
                .catch(err => Observable.of(error(err.message || 'Error when getting logs')))
                .do(() => {
                    if (forceScrollEnd) {
                        DomUtils.scrollBottom('.ait-body');
                    }
                });
        });

export const autoRefreshEpic = (action$, store) =>
    action$
        .ofType(SET_AUTOREFRESH)
        .filter(q => q.payload)
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
    return credentials.appId && credentials.apiKey;
}