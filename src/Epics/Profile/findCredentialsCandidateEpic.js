import { Observable } from 'rxjs/Observable';
import { emptyAction } from '../../Actions';
import { TRY_FIND_CREDENTIALS, setCredentialsAction } from '../../Actions/Profile';

export const findCredentialsCandidateEpic = (action$, store, { profileRepository }) =>
  action$.ofType(TRY_FIND_CREDENTIALS)
    .switchMap(q => {
      return Observable
        .of(profileRepository.findCredentialsCanditate(q.payload.appName))
        .filter(credentials => credentials !== null)
        .map(credentials => {
          return credentials ? setCredentialsAction(credentials) : emptyAction();
        });
    });

