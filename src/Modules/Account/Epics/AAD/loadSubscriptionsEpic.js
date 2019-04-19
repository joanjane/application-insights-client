import { switchMap, map, filter, catchError } from 'rxjs/operators';
import { ofType } from 'redux-observable';
import {
  aadAccountActionTypes,
  subscriptionsLoadedAction} from 'Modules/Account/Actions/AAD';
import { handleError } from 'Modules/Shared/Epics/handleError';

export const loadSubscriptionsEpic = (action$, state$, { inject }) => {
  const applicationInsightsClient = inject('ApplicationInsightsClient');

  return action$
    .pipe(
      ofType(aadAccountActionTypes.LIST_AAD_SUBSCRIPTIONS),
      filter(() => {
        const { aad } = state$.value.account;
        return aad.authenticated;
      }),
      switchMap((action) => {
        return applicationInsightsClient.listSubscriptions()
          .pipe(
            map(subscriptions => subscriptionsLoadedAction(subscriptions)),
            catchError(response => handleError(response, action, 'Error loading subscription', state$.value))
          );
      }),
    );
}