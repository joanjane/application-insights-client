import { of } from 'rxjs';
import { filter, switchMap, mergeMap, catchError, tap } from 'rxjs/operators';
import { ofType } from 'redux-observable';
import { anyCredentials } from 'Modules/Account/Epics/accountUtils';
import { emptyAction } from 'Modules/Shared/Actions';
import { accountActionTypes } from 'Modules/Account/Actions';
import {
  setLogsAction,
  searchActionTypes,
  loadingAction,
  AUTOREFRESH_GET_LOGS_SOURCE
} from 'Modules/Search/Actions';
import { AuthenticationType } from 'Modules/Account/Models';
import { setApiKeyCredentialsAction } from 'Modules/Account/Actions/ApiKey';
import { handleError } from 'Modules/Shared/Epics/handleError';

export const getLogsEpic = (action$, state$, { inject }) => {
  const applicationInsightsClient = inject('ApplicationInsightsClient');
  const domUtils = inject('DomUtils');

  return action$
    .pipe(
      ofType(searchActionTypes.GET_LOGS, accountActionTypes.PROFILE_LOADED),
      filter(action => getLogsFilter(state$)),
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
              let reason = (typeof (err) === 'string' ? err : err.message) || 'Error when getting logs';
              return handleError(err, action, reason, state);
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

export const loadingEpic = (action$, state$) => {
  return action$
    .pipe(
      ofType(searchActionTypes.GET_LOGS, accountActionTypes.PROFILE_LOADED),
      filter(action => getLogsFilter(state$)),
      switchMap(action => {
        return of(loadingAction(true, action.payload.source));
      })
    )
  ;
}

function getLogsFilter(state$) {
  const state = state$.value;

  return anyCredentials(state.account);
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