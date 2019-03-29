import { AI_APPS_LOADED } from 'Actions/Profile/Account';

export function aadSubscriptionAppsReducer(state, action) {
  if (action.type !== AI_APPS_LOADED) return;

  const { subscriptionId, apps } = action.payload;
  const subscriptionsApps = { ...state.aad.subscriptionsApps }
  subscriptionsApps[subscriptionId] = apps;
  return { ...state, aad: { ...state.aad, subscriptionsApps} };
}