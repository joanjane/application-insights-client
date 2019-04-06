import { of } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { ofType } from 'redux-observable';
import { emptyAction } from 'Actions';
import { SET_AUTH_TYPE } from 'Actions/Account';

export const setAuthenticationTypeEpic = (action$, store, { inject }) => {
  const profileRepository = inject('ProfileRepository');
  return action$
    .pipe(
      ofType(SET_AUTH_TYPE),
      switchMap(q => {
        const { authenticationType } = q.payload;
        profileRepository.setAuthenticationType(authenticationType);
        return of(emptyAction());
      })
    );
}


