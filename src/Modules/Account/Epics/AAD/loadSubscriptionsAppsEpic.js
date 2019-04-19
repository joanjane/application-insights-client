import { switchMap, map, filter, catchError } from 'rxjs/operators';
import { ofType } from 'redux-observable';
import {
  aadAccountActionTypes,
  aiAppsLoadedAction} from 'Modules/Account/Actions/AAD';
import { handleError } from 'Modules/Shared/Epics/handleError';

export const loadSubscriptionsAppsEpic = (action$, state$, { inject }) => {
  const applicationInsightsClient = inject('ApplicationInsightsClient');

  return action$
    .pipe(
      ofType(aadAccountActionTypes.LIST_AI_APPS),
      filter(action => {
        const { aad } = state$.value.account;
        return aad.authenticated;
      }),
      switchMap((action) => {
        const subscriptionId = action.payload.subscriptionId;
        return applicationInsightsClient.listAppInsightsAccounts(subscriptionId)
          .pipe(
            map(apps => aiAppsLoadedAction(subscriptionId, apps)),
            catchError(response => handleError(response, action, 'Error loading subscription apps', state$.value))
          );
      }),
    );
}