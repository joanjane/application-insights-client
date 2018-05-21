import { Observable } from 'rxjs/Observable';
import { SET_CREDENTIALS, availableAppsLoaded } from '../../Actions/Profile';

export const setCredentialsEpic = (action$, store, { profileRepository }) =>
    action$.ofType(SET_CREDENTIALS)
        .switchMap(q => {
            profileRepository.storeCredentials(q.payload);
            const availableApps = profileRepository.getStoredAppNamesCredentials();
            return Observable.of(availableAppsLoaded(availableApps));
        });
