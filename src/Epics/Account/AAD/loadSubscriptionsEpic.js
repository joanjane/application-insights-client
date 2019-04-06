import { of } from 'rxjs';
import { switchMap, map, filter, catchError } from 'rxjs/operators';
import { ofType } from 'redux-observable';
import { errorAction } from 'Actions';
import {
  LIST_AAD_SUBSCRIPTIONS,
  subscriptionsLoadedAction,
  aadSilentTokenRefreshAction
} from 'Actions/Account/AAD';

export const loadSubscriptionsEpic = (action$, state$, { inject }) => {
  const applicationInsightsClient = inject('ApplicationInsightsClient');

  return action$
    .pipe(
      ofType(LIST_AAD_SUBSCRIPTIONS),
      filter(action => {
        const { aad } = state$.value.account;
        return aad.authenticated && !retryExceeded(action);
      }),
      switchMap((action) => {
        return applicationInsightsClient.listSubscriptions()
          .pipe(
            map(subscriptions => subscriptionsLoadedAction(subscriptions)),
            catchError(r => {
              if (r.status === 401 && !retryExceeded(action)) {
                return of(aadSilentTokenRefreshAction(action));
              }
              const details = r.response && r.response.error ? ` ${r.response.error.code}: ${r.response.error.message}` : '';
              return of(errorAction(`Error loading subscriptions => [HTTP Status ${r.status}]${details}`));
            })
          );
      }),
    );
}

const retryExceeded = (action) => (+action.retry) > 1;