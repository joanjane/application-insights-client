import { apiKeyAccountActionTypes } from 'Actions/Account/ApiKey';

export function setApiKeyCredentialsReducer(state, action) {
  if (action.type !== apiKeyAccountActionTypes.SET_APIKEY_CREDENTIALS) return;

  state.account.apiKey.appId = action.payload.appId;
  state.account.apiKey.apiKey = action.payload.apiKey;

  return { ...state };
}
