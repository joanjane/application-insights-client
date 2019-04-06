import { PROFILE_LOADED } from 'Actions/Account';
import { SET_APIKEY_APPS } from 'Actions/Account/ApiKey';

export function availableApiKeyAppsReducer(state, action) {
  if (action.type !== PROFILE_LOADED && action.type !== SET_APIKEY_APPS) return;

  if (action.payload.availableApps) {
    state.account.appVaults.apiKey.availableApps = action.payload.availableApps;
  }

  return { ...state };
}