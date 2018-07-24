import { Observable } from 'rxjs/Observable';
import { SET_CREDENTIALS, availableAppsLoadedAction } from '../../Actions/Profile';

export const setCredentialsEpic = (action$, store, { profileRepository }) =>
  action$.ofType(SET_CREDENTIALS)
    .switchMap(q => {
      profileRepository.storeCredentials(q.payload.credentials);
      const availableApps = profileRepository.getStoredAppNamesCredentials();
      return Observable.of(availableAppsLoadedAction(availableApps));
    });
