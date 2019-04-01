import { of } from 'rxjs';
import { switchMap, map } from 'rxjs/operators';
import { ofType } from 'redux-observable';
import { emptyAction } from 'Actions';
import { TRY_FIND_CREDENTIALS, setCredentialsAction } from 'Actions/Profile';

export const findCredentialsCandidateEpic = (action$, store, { inject }) => {
  const profileRepository = inject('ProfileRepository');
  return action$
    .pipe(
      ofType(TRY_FIND_CREDENTIALS),
      switchMap(q => {
        return of(profileRepository.findCredentialsCanditate(q.payload.appName))
          .pipe(
            map(credentials => {
              return credentials ? setCredentialsAction(credentials) : emptyAction();
            })
          )
      })
    );
}