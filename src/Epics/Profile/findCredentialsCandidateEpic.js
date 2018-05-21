import { Observable } from 'rxjs/Observable';
import { empty } from '../../Actions';
import { TRY_FIND_CREDENTIALS, setCredentials } from '../../Actions/Profile';

export const findCredentialsCandidateEpic = (action$, store, { profileRepository }) =>
    action$.ofType(TRY_FIND_CREDENTIALS)
        .switchMap(q => {
            return Observable
                .of(profileRepository.findCredentialsCanditate(q.payload))
                .filter(credentials => credentials !== null)
                .map(credentials => {
                    return credentials ? setCredentials(credentials) : empty();
                });
        });

