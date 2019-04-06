export const SET_APIKEY_CREDENTIALS = 'SET_APIKEY_CREDENTIALS';

export function setApiKeyCredentialsAction(appId, apiKey, appName) {
  if (!appId || !apiKey) {
    throw new Error('AppId and APIKey are required');
  }
  var payload = { appId, apiKey };
  if (appName) {
    payload.appName = appName;
  }
  return { type: SET_APIKEY_CREDENTIALS, payload };
}