import { switchMap, map, filter } from 'rxjs/operators';
import { ofType } from 'redux-observable';
import { LIST_AI_APPS, aiAppsLoadedAction } from 'Actions/Profile/Account';

export const loadSubscriptionsAppsEpic = (action$, state$, { inject }) => {
  const applicationInsightsClient = inject('ApplicationInsightsClient');

  return action$
    .pipe(
      ofType(LIST_AI_APPS),
      filter(action => {
        const { aad } = state$.value.credentials;
        return aad.authenticated;
      }),
      switchMap((q) => {
        const subscriptionId = q.payload.subscriptionId;
        return applicationInsightsClient.listAppInsightsAccounts(subscriptionId)
          .pipe(map(apps => aiAppsLoadedAction(subscriptionId, apps)));
      })
    )
  ;
}