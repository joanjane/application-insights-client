import { apiKeyAccountActionTypes } from '.';

export function setApiKeyAppsAction(availableApps) {
  return {
    type: apiKeyAccountActionTypes.SET_APIKEY_APPS,
    payload: {
      availableApps
    }
  };
}