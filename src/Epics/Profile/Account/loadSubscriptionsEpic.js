import { switchMap, map, filter } from 'rxjs/operators';
import { ofType } from 'redux-observable';
import { LIST_AAD_SUBSCRIPTIONS, subscriptionsLoadedAction } from 'Actions/Profile/Account';

export const loadSubscriptionsEpic = (action$, state$, { inject }) => {
  const applicationInsightsClient = inject('ApplicationInsightsClient');

  return action$
    .pipe(
      ofType(LIST_AAD_SUBSCRIPTIONS),
      filter(action => {
        const { aad } = state$.value.credentials;
        return aad.authenticated && aad.aadTenant;
      }),
      switchMap(() => {
        return applicationInsightsClient.listSubscriptions()
          .pipe(map(subscriptions => subscriptionsLoadedAction(subscriptions)));
      })
    )
  ;
}