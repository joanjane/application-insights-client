import { of } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { ofType } from 'redux-observable';
import { emptyAction } from 'Actions';
import { TRY_FIND_CREDENTIALS, setApiKeyCredentialsAction } from 'Actions/Account/ApiKey';

export const findApiKeyCredentialsCandidateEpic = (action$, state$, { inject }) => {
  return action$
    .pipe(
      ofType(TRY_FIND_CREDENTIALS),
      switchMap(q => {
        const { appName } = q.payload;
        const availableApps = state$.value.account.appVaults.apiKey.availableApps;
        const apiKeyCredentials = availableApps.find(c => c.appId === appName || (c.appName && c.appName === appName));

        return apiKeyCredentials ?
          of(setApiKeyCredentialsAction(
            apiKeyCredentials.appId,
            apiKeyCredentials.apiKey,
            apiKeyCredentials.appName)) :
          of(emptyAction());
      })
    );
}