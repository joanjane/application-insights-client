import { SET_APIKEY_CREDENTIALS } from 'Actions/Account/ApiKey';

export function setApiKeyCredentialsReducer(state, action) {
  if (action.type !== SET_APIKEY_CREDENTIALS) return;

  state.account.apiKey.appId = action.payload.appId;
  state.account.apiKey.apiKey = action.payload.apiKey;

  return { ...state };
}
