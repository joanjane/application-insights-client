import { switchMap, map, filter, catchError } from 'rxjs/operators';
import { ofType } from 'redux-observable';
import {
  aadAccountActionTypes,
  tenantsLoadedAction} from 'Modules/Account/Actions/AAD';
import { handleError } from 'Modules/Shared/Epics/handleError';

export const loadTenantsEpic = (action$, state$, { inject }) => {
  const applicationInsightsClient = inject('ApplicationInsightsClient');

  return action$
    .pipe(
      ofType(aadAccountActionTypes.LIST_AAD_TENANTS),
      filter(() => {
        const { aad } = state$.value.account;
        return aad.authenticated;
      }),
      switchMap((action) => {
        return applicationInsightsClient.listTenants()
          .pipe(
            map(tenants => tenantsLoadedAction(tenants)),
            catchError(response => handleError(response, action, 'Error loading Azure AD tenants', state$.value))
          );
      }),
    );
}

