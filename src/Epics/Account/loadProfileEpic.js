import { of } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { ofType } from 'redux-observable';
import AuthenticationType from 'Models/AuthenticationType';
import {
  LOAD_PROFILE,
  setAuthenticationTypeAction
} from 'Actions/Account';
import {
  setQueryAction,
  setSearchPeriodAction
} from 'Actions/Search';
import {
  setApiKeyAppsAction,
  setApiKeyCredentialsAction
} from 'Actions/Account/ApiKey';
import {
  setAADSubscriptionAction,
  setAADResourceAction,
  aadAuthenticatedAction
} from 'Actions/Account/AAD';

export const loadProfileEpic = (action$, state$, { inject }) => {
  const profileRepository = inject('ProfileRepository');
  const consoleDoc = inject('ConsoleDoc');
  const aadAuthService = inject('AadAuthService');

  return action$.pipe(
    ofType(LOAD_PROFILE),
    switchMap(q => {
      profileRepository.runMigrations();

      consoleDoc.printHelpOnConsole();
      const query = profileRepository.getQuery();
      const searchPeriod = profileRepository.getSearchPeriod();
      const apiKeyAccount = profileRepository.getApiKeyAccount();
      const availableApiKeyApps = profileRepository.getStoredAppNamesCredentials();
      const aadAccount = profileRepository.getAADAccount();
      let aadAuthenticated = aadAuthService.isAuthenticated();
      let authenticationType = profileRepository.getAuthenticationType();

      if (authenticationType !== AuthenticationType.apiKey && aadAccount && aadAccount.authenticated) {
        authenticationType = AuthenticationType.aad;
      }

      let actions = [
        setApiKeyAppsAction(availableApiKeyApps),
        aadAuthenticatedAction(aadAuthenticated)
      ];

      if (searchPeriod) {
        actions.push(setSearchPeriodAction(searchPeriod));
      }

      if (query) {
        actions.push(setQueryAction(query));
      }

      if (authenticationType != null) {
        actions.push(setAuthenticationTypeAction(authenticationType));
      }

      if (aadAccount) {
        actions = [
          ...actions,
          setAADSubscriptionAction(aadAccount.subscriptionId),
          setAADResourceAction(aadAccount.resourceId, aadAccount.appId),
        ]
      }

      if (apiKeyAccount) {
        actions.push(setApiKeyCredentialsAction(
          apiKeyAccount.appId,
          apiKeyAccount.apiKey,
          apiKeyAccount.appName
        ));
      }

      return of(...actions);
    })
  );
}