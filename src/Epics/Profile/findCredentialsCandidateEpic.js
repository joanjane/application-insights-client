import { of } from 'rxjs';
import { switchMap, filter, map } from 'rxjs/operators';
import { ofType } from 'redux-observable';
import { emptyAction } from '../../Actions';
import { TRY_FIND_CREDENTIALS, setCredentialsAction } from '../../Actions/Profile';

export const findCredentialsCandidateEpic = (action$, store, { profileRepository }) =>
  action$
    .pipe(
      ofType(TRY_FIND_CREDENTIALS),
      switchMap(q => {
        return of(profileRepository.findCredentialsCanditate(q.payload.appName))
          .pipe(
            filter(credentials => credentials !== null),
            map(credentials => {
              return credentials ? setCredentialsAction(credentials) : emptyAction();
            })
          )
      })
    );

