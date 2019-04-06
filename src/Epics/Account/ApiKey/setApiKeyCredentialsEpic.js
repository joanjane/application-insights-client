import { of } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { ofType } from 'redux-observable';
import { SET_APIKEY_CREDENTIALS, setApiKeyAppsAction } from 'Actions/Account/ApiKey';

export const setApiKeyCredentialsEpic = (action$, store, { inject }) => {
  const profileRepository = inject('ProfileRepository');
  return action$
    .pipe(
      ofType(SET_APIKEY_CREDENTIALS),
      switchMap(q => {
        profileRepository.setApiKeyAccount(q.payload);
        const availableApps = profileRepository.getStoredAppNamesCredentials();
        return of(setApiKeyAppsAction(availableApps));
      })
    );
}