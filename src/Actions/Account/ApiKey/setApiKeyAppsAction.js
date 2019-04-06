export const SET_APIKEY_APPS = 'SET_APIKEY_APPS';
export function setApiKeyAppsAction(availableApps) {
  return {
    type: SET_APIKEY_APPS,
    payload: {
      availableApps
    }
  };
}