import { of } from 'rxjs';
import { switchMap, map, filter, catchError } from 'rxjs/operators';
import { ofType } from 'redux-observable';
import { errorAction } from 'Modules/Shared/Actions';
import {
  aadAccountActionTypes,
  aiAppsLoadedAction,
  aadSilentTokenRefreshAction
} from 'Modules/Account/Actions/AAD';

export const loadSubscriptionsAppsEpic = (action$, state$, { inject }) => {
  const applicationInsightsClient = inject('ApplicationInsightsClient');

  return action$
    .pipe(
      ofType(aadAccountActionTypes.LIST_AI_APPS),
      filter(action => {
        const { aad } = state$.value.account;
        return aad.authenticated && !retryExceeded(action);
      }),
      switchMap((action) => {
        const subscriptionId = action.payload.subscriptionId;
        return applicationInsightsClient.listAppInsightsAccounts(subscriptionId)
          .pipe(
            map(apps => aiAppsLoadedAction(subscriptionId, apps)),
            catchError(r => {
              if (r.status === 401 && !retryExceeded(action)) {
                return of(aadSilentTokenRefreshAction(action));
              }
              const details = r.response && r.response.error ? ` ${r.response.error.code}: ${r.response.error.message}` : '';
              return of(errorAction(`Error loading subscription apps => [HTTP Status ${r.status}]${details}`));
            })
          );
      }),
    );
}

const retryExceeded = (action) => (+action.retry) > 1;