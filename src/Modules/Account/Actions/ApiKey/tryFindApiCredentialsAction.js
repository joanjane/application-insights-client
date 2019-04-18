import { apiKeyAccountActionTypes } from '.';

export function tryFindApiCredentialsAction(appName) {
  return { type: apiKeyAccountActionTypes.TRY_FIND_CREDENTIALS, payload: { appName } };
}