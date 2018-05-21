import { Observable } from 'rxjs/Observable';
import { anyCredentials } from './utils';
import { error } from '../../Actions';
import { 
    setCredentials,
    PROFILE_LOADED
 } from '../../Actions/Profile';
import {
    setLogs,
    GET_LOGS,
    AUTOREFRESH_GET_LOGS_SOURCE
} from '../../Actions/Logs';

export const getLogsEpic = (action$, store, { applicationInsightsClient, DomUtils }) =>
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