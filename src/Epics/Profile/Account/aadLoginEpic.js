import { of } from 'rxjs';
import { map } from 'rxjs/operators';
import { ofType } from 'redux-observable';
import { AAD_LOGIN } from 'Actions/Profile/Account';
import { emptyAction } from 'Actions';

export const aadLoginEpic = (action$, state$, { inject }) => {
  const aadAuthService = inject('AadAuthService');

  return action$
    .pipe(
      ofType(AAD_LOGIN),
      map(() => {
        aadAuthService.loginRedirect();
        return of(emptyAction());
      })
    )
  ;
}