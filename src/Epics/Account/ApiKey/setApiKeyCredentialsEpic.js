import { of } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { ofType } from 'redux-observable';
import { apiKeyAccountActionTypes, setApiKeyAppsAction } from 'Actions/Account/ApiKey';
import { authenticationChangedAction } from 'Actions/Account';

export const setApiKeyCredentialsEpic = (action$, store, { inject }) => {
  const profileRepository = inject('ProfileRepository');
  return action$
    .pipe(
      ofType(apiKeyAccountActionTypes.SET_APIKEY_CREDENTIALS),
      switchMap(q => {
        profileRepository.setApiKeyAccount(q.payload);
        const availableApps = profileRepository.getAllApiKeyAccounts();
        return of(setApiKeyAppsAction(availableApps), authenticationChangedAction());
      })
    );
}