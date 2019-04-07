import { of } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { ofType } from 'redux-observable';
import { accountActionTypes, authenticationChangedAction } from 'Actions/Account';

export const setAuthenticationTypeEpic = (action$, store, { inject }) => {
  const profileRepository = inject('ProfileRepository');
  return action$
    .pipe(
      ofType(accountActionTypes.SET_AUTH_TYPE),
      switchMap(q => {
        const { authenticationType } = q.payload;
        profileRepository.setAuthenticationType(authenticationType);
        return of(authenticationChangedAction());
      })
    );
}


