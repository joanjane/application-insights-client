import { map } from 'rxjs/operators';
import { ofType } from 'redux-observable';
import { AAD_LOGIN } from 'Actions/Account/AAD';
import { emptyAction } from 'Actions';

export const aadLoginEpic = (action$, state$, { inject }) => {
  const aadAuthService = inject('AadAuthService');

  return action$
    .pipe(
      ofType(AAD_LOGIN),
      map(() => {
        aadAuthService.loginRedirect();
        return emptyAction();
      })
    )
  ;
}