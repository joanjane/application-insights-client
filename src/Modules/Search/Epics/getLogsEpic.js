import { of } from 'rxjs';
import { filter, switchMap, mergeMap, catchError, tap } from 'rxjs/operators';
import { ofType } from 'redux-observable';
import { anyCredentials } from 'Modules/Account/Epics/accountUtils';
import { errorAction, emptyAction } from 'Modules/Shared/Actions';
import { accountActionTypes } from 'Modules/Account/Actions';
import { retryExceeded } from 'Modules/Shared/retryExceeded';
import {
  setLogsAction,
  searchActionTypes,
  loadingAction,
  AUTOREFRESH_GET_LOGS_SOURCE
} from 'Modules/Search/Actions';
import {
  aadSilentTokenRefreshAction
} from 'Modules/Account/Actions/AAD';
import { AuthenticationType } from 'Modules/Account/Models';
import { setApiKeyCredentialsAction } from 'Modules/Account/Actions/ApiKey';

export const getLogsEpic = (action$, state$, { inject }) => {
  const applicationInsightsClient = inject('ApplicationInsightsClient');
  const domUtils = inject('DomUtils');

  return action$
    .pipe(
      ofType(searchActionTypes.GET_LOGS, accountActionTypes.PROFILE_LOADED),
      filter(action => getLogsFilter(state$, action)),
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
                  errorAction('Error on app insights query 401 - Unauthorized')
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

export const loadingEpic = (action$, state$, { inject }) => {
  return action$
    .pipe(
      ofType(searchActionTypes.GET_LOGS, accountActionTypes.PROFILE_LOADED),
      filter(action => getLogsFilter(state$, action)),
      switchMap(action => {
        return of(loadingAction(true, action.payload.source));
      })
    )
  ;
}

function getLogsFilter(state$, action) {
  const state = state$.value;

  return anyCredentials(state.account) &&
    !(action.payload.source === AUTOREFRESH_GET_LOGS_SOURCE && state.error);
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
