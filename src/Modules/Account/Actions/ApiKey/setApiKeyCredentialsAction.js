import { apiKeyAccountActionTypes } from '.';

export function setApiKeyCredentialsAction(appId, apiKey, appName) {
  if (!appId || !apiKey) {
    throw new Error('AppId and APIKey are required');
  }
  var payload = { appId, apiKey };
  if (appName) {
    payload.appName = appName;
  }
  return { type: apiKeyAccountActionTypes.SET_APIKEY_CREDENTIALS, payload };
}