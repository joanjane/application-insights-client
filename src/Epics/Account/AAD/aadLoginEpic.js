import { map } from 'rxjs/operators';
import { ofType } from 'redux-observable';
import { aadAccountActionTypes } from 'Actions/Account/AAD';
import { emptyAction } from 'Actions';

export const aadLoginEpic = (action$, state$, { inject }) => {
  const aadAuthService = inject('AadAuthService');

  return action$
    .pipe(
      ofType(aadAccountActionTypes.AAD_LOGIN),
      map(() => {
        aadAuthService.loginRedirect();
        return emptyAction();
      })
    )
  ;
}