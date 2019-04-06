import { map } from 'rxjs/operators';
import { ofType } from 'redux-observable';
import { SET_AAD_SUBSCRIPTION, SET_AAD_RESOURCE } from 'Actions/Account/AAD';
import { emptyAction } from 'Actions';

export const setAADSubscriptionEpic = (action$, state$, { inject }) => {
  const profileRepository = inject('ProfileRepository');

  return action$
    .pipe(
      ofType(
        SET_AAD_SUBSCRIPTION,
        SET_AAD_RESOURCE
      ),
      map(() => {
        profileRepository.setAADAccount(state$.value.account.aad);
        return emptyAction();
      })
    )
  ;
}