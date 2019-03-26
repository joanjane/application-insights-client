import { of } from 'rxjs';
import { filter, switchMap, mergeMap, catchError, tap } from 'rxjs/operators';
import { ofType } from 'redux-observable';
import { anyCredentials } from './utils';
import { errorAction } from 'Actions';
import {
  setCredentialsAction,
  PROFILE_LOADED
} from 'Actions/Profile';
import {
  setLogsAction,
  GET_LOGS,
  AUTOREFRESH_GET_LOGS_SOURCE
} from 'Actions/Logs';

export const getLogsEpic = (action$, state$, { inject }) => {
  const applicationInsightsClient = inject('ApplicationInsightsClient');
  const domUtils = inject('DomUtils');

  return action$
    .pipe(
      ofType(GET_LOGS, PROFILE_LOADED),
      filter(action => {
        const state = state$.value;
        return anyCredentials(state.credentials) &&
          !(action.payload.source === AUTOREFRESH_GET_LOGS_SOURCE && state.error);
      }),
      switchMap(action => {
        // force scroll search is done by user or it is already at the end of scroll
        const forceScrollEnd = hasToScroll(action, domUtils);

        const state = state$.value;
        return applicationInsightsClient.getLogs(state.credentials, state.query, state.searchPeriod)
          .pipe(
            mergeMap(logs => of(
              setLogsAction(logs),
              setCredentialsAction({ ...state$.value.credentials, appName: logs.appName }))
            ),
            catchError(err => {
              let reason = typeof (err) === 'string' ? err : err.message
              return of(errorAction(reason || 'Error when getting logs'));
            }),
            tap(() => {
              if (forceScrollEnd) {
                domUtils.scrollBottom('.ail-body');
              }
            })
          );
      })
    )
  ;
}

function hasToScroll(action, domUtils) {
  return action.payload.source !== AUTOREFRESH_GET_LOGS_SOURCE ||
    domUtils.isScrollEnd('.ail-body');
}
