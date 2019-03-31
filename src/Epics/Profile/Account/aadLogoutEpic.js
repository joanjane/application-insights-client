import { map } from 'rxjs/operators';
import { ofType } from 'redux-observable';
import { AAD_LOGOUT } from 'Actions/Profile/Account';
import { emptyAction } from 'Actions';

export const aadLogoutEpic = (action$, state$, { inject }) => {
  const aadAuthService = inject('AadAuthService');

  return action$
    .pipe(
      ofType(AAD_LOGOUT),
      map(() => {
        aadAuthService.logout();
        return emptyAction();
      })
    )
  ;
}