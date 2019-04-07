import { map } from 'rxjs/operators';
import { ofType } from 'redux-observable';
import { aadAccountActionTypes } from 'Actions/Account/AAD';
import { authenticationChangedAction } from 'Actions/Account';

export const aadLogoutEpic = (action$, state$, { inject }) => {
  const aadAuthService = inject('AadAuthService');

  return action$
    .pipe(
      ofType(aadAccountActionTypes.AAD_LOGOUT),
      map(() => {
        aadAuthService.logout();
        return authenticationChangedAction();
      })
    )
  ;
}