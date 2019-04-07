import { aadAccountActionTypes } from '.';

export function aiAppsLoadedAction(subscriptionId, apps) {
  return { type: aadAccountActionTypes.AI_APPS_LOADED, payload: { subscriptionId, apps }};
}