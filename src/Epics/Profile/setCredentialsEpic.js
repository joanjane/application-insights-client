import { of } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { ofType } from 'redux-observable';
import { SET_CREDENTIALS, availableAppsLoadedAction } from 'Actions/Profile';

export const setCredentialsEpic = (action$, store, { profileRepository }) =>
  action$
    .pipe(
      ofType(SET_CREDENTIALS),
      switchMap(q => {
        profileRepository.storeCredentials(q.payload.credentials);
        const availableApps = profileRepository.getStoredAppNamesCredentials();
        return of(availableAppsLoadedAction(availableApps));
      })
    );
