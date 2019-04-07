import { aadAccountActionTypes } from 'Actions/Account/AAD';

export function aadSubscriptionAppsReducer(state, action) {
  if (action.type !== aadAccountActionTypes.AI_APPS_LOADED) return;

  let { subscriptionId, apps } = action.payload;
  const subscriptionsApps = { ...state.account.appVaults.aad.subscriptionsApps }
  subscriptionsApps[subscriptionId] = apps;
  apps = apps.sort(sortByName);

  state.account.appVaults.aad.subscriptionsApps = subscriptionsApps;

  return { ...state };
}
function sortByName(a,b) {
  if (a.name < b.name) return -1;
  if (a.name > b.name) return 1;
  return 0;
}