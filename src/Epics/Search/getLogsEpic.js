import { of } from 'rxjs';
import { filter, switchMap, mergeMap, catchError, tap } from 'rxjs/operators';
import { ofType } from 'redux-observable';
import { anyCredentials } from 'Epics/accountUtils';
import { errorAction, emptyAction } from 'Actions';
import { PROFILE_LOADED } from 'Actions/Account';
import {
  setLogsAction,
  GET_LOGS,
  AUTOREFRESH_GET_LOGS_SOURCE
} from 'Actions/Search';
import {
  aadSilentTokenRefreshAction
} from 'Actions/Account/AAD';
import AuthenticationType from 'Models/AuthenticationType';
import { setApiKeyCredentialsAction } from 'Actions/Account/ApiKey';

export const getLogsEpic = (action$, state$, { inject }) => {
  const applicationInsightsClient = inject('ApplicationInsightsClient');
  const domUtils = inject('DomUtils');

  return action$
    .pipe(
      ofType(GET_LOGS, PROFILE_LOADED),
      filter(action => {
        const state = state$.value;
        return anyCredentials(state.account) &&
          !(action.payload.source === AUTOREFRESH_GET_LOGS_SOURCE && state.error)
          && !retryExceeded(action);
      }),
      switchMap(action => {
        // force scroll search is done by user or it is already at the end of scroll
        const forceScrollEnd = hasToScroll(action, domUtils);

        const state = state$.value;
        return applicationInsightsClient.getLogs(state.account, state.search.query, state.search.searchPeriod)
          .pipe(
            mergeMap(logs => of(
              setLogsAction(logs),
              setCredentialsAction(state, logs.appName))
            ),
            catchError(err => {
              if (err.status === 401) {
                return of(
                  isAadAuth(state$.value) && !retryExceeded(action) ?
                  aadSilentTokenRefreshAction(action) :
                  errorAction('Error 401 - Unauthorized')
                  );
              }
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

function setCredentialsAction(state, appName) {
  return state.account.authenticationType === AuthenticationType.apiKey ?
    setApiKeyCredentialsAction(state.account.apiKey.appId, state.account.apiKey.apiKey, appName) :
    emptyAction()
}

const isAadAuth = (state) => state.account.authenticationType === AuthenticationType.aad;
const retryExceeded = (action) => (+action.retry) > 1;