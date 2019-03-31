import { of } from 'rxjs';
import { switchMap, map, filter, catchError } from 'rxjs/operators';
import { ofType } from 'redux-observable';
import { LIST_AAD_SUBSCRIPTIONS, subscriptionsLoadedAction } from 'Actions/Profile/Account';
import { errorAction } from 'Actions';

export const loadSubscriptionsEpic = (action$, state$, { inject }) => {
  const applicationInsightsClient = inject('ApplicationInsightsClient');

  return action$
    .pipe(
      ofType(LIST_AAD_SUBSCRIPTIONS),
      filter(action => {
        const { aad } = state$.value.credentials;
        return aad.authenticated;
      }),
      switchMap(() => {
        return applicationInsightsClient.listSubscriptions()
          .pipe(map(subscriptions => subscriptionsLoadedAction(subscriptions)));
      }),
      catchError(r => {
        const details = r.response && r.response.error ? ` ${r.response.error.code}: ${r.response.error.message}` : '';
        return of(errorAction(`Error loading subscriptions => [HTTP Status ${r.status}]${details}`));
      })
    )
  ;
}