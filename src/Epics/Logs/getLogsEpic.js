import { Observable } from 'rxjs/Observable';
import { anyCredentials } from './utils';
import { errorAction } from '../../Actions';
import {
  setCredentialsAction,
  PROFILE_LOADED
} from '../../Actions/Profile';
import {
  setLogsAction,
  GET_LOGS,
  AUTOREFRESH_GET_LOGS_SOURCE
} from '../../Actions/Logs';

export const getLogsEpic = (action$, store, { applicationInsightsClient, DomUtils }) =>
  action$.ofType(GET_LOGS, PROFILE_LOADED)
    .filter(action => {
      const state = store.getState();
      return anyCredentials(state.credentials) &&
        !(action.payload.source === AUTOREFRESH_GET_LOGS_SOURCE && state.error);
    })
    .switchMap(action => {
      // force scroll search is done by user or it is already at the end of scroll
      const forceScrollEnd = hasToScroll(action, DomUtils);

      const state = store.getState();
      return applicationInsightsClient.getLogs(state.credentials, state.query)
        .flatMap(logs => Observable.of(
          setLogsAction(logs),
          setCredentialsAction({ ...store.getState().credentials, appName: logs.appName }))
        )
        .catch(err => {
          let reason = null;
          if (err.response && err.response.error) {
            reason = err.response.error.message || err.message;
          }
          return Observable.of(errorAction(reason || 'Error when getting logs'));
        })
        .do(() => {
          if (forceScrollEnd) {
            DomUtils.scrollBottom('.ail-body');
          }
        });
    });

function hasToScroll(action, DomUtils) {
  return action.payload.source !== AUTOREFRESH_GET_LOGS_SOURCE ||
    DomUtils.isScrollEnd('.ail-body');
}
