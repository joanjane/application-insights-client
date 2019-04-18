import { map } from 'rxjs/operators';
import { ofType } from 'redux-observable';
import { aadAccountActionTypes } from 'Modules/Account/Actions/AAD';
import { authenticationChangedAction } from 'Modules/Account/Actions';

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