import { map } from 'rxjs/operators';
import { ofType } from 'redux-observable';
import { aadAccountActionTypes } from 'Actions/Account/AAD';
import { authenticationChangedAction } from 'Actions/Account';

export const setAADSubscriptionEpic = (action$, state$, { inject }) => {
  const profileRepository = inject('ProfileRepository');

  return action$
    .pipe(
      ofType(
        aadAccountActionTypes.SET_AAD_SUBSCRIPTION,
        aadAccountActionTypes.SET_AAD_RESOURCE
      ),
      map(() => {
        profileRepository.setAADAccount(state$.value.account.aad);
        return authenticationChangedAction();
      })
    )
  ;
}