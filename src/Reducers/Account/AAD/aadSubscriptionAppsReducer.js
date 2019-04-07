import { aadAccountActionTypes } from 'Actions/Account/AAD';

export function aadSubscriptionAppsReducer(state, action) {
  if (action.type !== aadAccountActionTypes.AI_APPS_LOADED) return;

  const { subscriptionId, apps } = action.payload;
  const subscriptionsApps = { ...state.account.appVaults.aad.subscriptionsApps }
  subscriptionsApps[subscriptionId] = apps;
  state.account.appVaults.aad.subscriptionsApps = subscriptionsApps;

  return { ...state };
}