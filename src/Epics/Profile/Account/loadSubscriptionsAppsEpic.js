import { of } from 'rxjs';
import { switchMap, map, filter, catchError } from 'rxjs/operators';
import { ofType } from 'redux-observable';
import { LIST_AI_APPS, aiAppsLoadedAction } from 'Actions/Profile/Account';
import { errorAction } from 'Actions';

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
      }),
      catchError(r => {
        const details = r.response && r.response.error ? ` ${r.response.error.code}: ${r.response.error.message}` : '';
        return of(errorAction(`Error loading subscription apps => [HTTP Status ${r.status}]${details}`));
      })
    )
    ;
}