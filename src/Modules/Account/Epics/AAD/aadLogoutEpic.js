import { of } from 'rxjs';
import { mergeMap } from 'rxjs/operators';
import { ofType } from 'redux-observable';
import { aadAccountActionTypes } from 'Modules/Account/Actions/AAD';
import { authenticationChangedAction } from 'Modules/Account/Actions';
import { setAADSubscriptionAction, setAADResourceAction, setAADTenantAction } from 'Modules/Account/Actions/AAD';

export const aadLogoutEpic = (action$, state$, { inject }) => {
  const aadAuthService = inject('AadAuthService');
  const profileRepository = inject('ProfileRepository');

  return action$
    .pipe(
      ofType(aadAccountActionTypes.AAD_LOGOUT),
      mergeMap(() => {
        profileRepository.removeAADAccount();
        aadAuthService.logout();
        return of(
          setAADTenantAction(''),
          setAADSubscriptionAction(''),
          setAADResourceAction('', ''),
          authenticationChangedAction()
        );
      })
    )
  ;
}