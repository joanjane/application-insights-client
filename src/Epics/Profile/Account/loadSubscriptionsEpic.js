import { switchMap } from 'rxjs/operators';
import { ofType } from 'redux-observable';
import { LIST_AAD_SUBSCRIPTIONS } from 'Actions/Profile/Account';

export const loadSubscriptionsEpic = (action$, state$, { inject }) => {
  const applicationInsightsClient = inject('ApplicationInsightsClient');

  return action$
    .pipe(
      ofType(LIST_AAD_SUBSCRIPTIONS),
      switchMap(() => {
        return applicationInsightsClient.listSubscriptions();
      })
    )
  ;
}