import { of } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { ofType } from 'redux-observable';
import { apiKeyAccountActionTypes, setApiKeyAppsAction } from 'Modules/Account/Actions/ApiKey';
import { authenticationChangedAction } from 'Modules/Account/Actions';

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