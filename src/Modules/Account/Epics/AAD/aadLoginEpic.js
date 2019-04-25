import { map } from 'rxjs/operators';
import { ofType } from 'redux-observable';
import { aadAccountActionTypes } from 'Modules/Account/Actions/AAD';
import { emptyAction } from 'Modules/Shared/Actions';

export const aadLoginEpic = (action$, state$, { inject }) => {
  const aadAuthService = inject('AadAuthService');
  const profileRepository = inject('ProfileRepository');

  return action$
    .pipe(
      ofType(aadAccountActionTypes.AAD_LOGIN),
      map(() => {
        profileRepository.removeAADAccount();
        aadAuthService.loginRedirect(state$.value.account.aad.tenantId);
        return emptyAction();
      })
    )
  ;
}