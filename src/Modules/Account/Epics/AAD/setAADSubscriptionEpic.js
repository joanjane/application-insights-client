import { map } from 'rxjs/operators';
import { ofType } from 'redux-observable';
import { aadAccountActionTypes } from 'Modules/Account/Actions/AAD';
import { authenticationChangedAction } from 'Modules/Account/Actions';

export const setAADSubscriptionEpic = (action$, state$, { inject }) => {
  const profileRepository = inject('ProfileRepository');

  return action$
    .pipe(
      ofType(
        aadAccountActionTypes.SET_AAD_TENANT,
        aadAccountActionTypes.SET_AAD_SUBSCRIPTION,
        aadAccountActionTypes.SET_AAD_RESOURCE,
      ),
      map(() => {
        profileRepository.setAADAccount(state$.value.account.aad);
        return authenticationChangedAction();
      })
    )
  ;
}