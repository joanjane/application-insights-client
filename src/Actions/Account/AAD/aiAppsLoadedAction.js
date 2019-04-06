export const AI_APPS_LOADED = 'AI_APPS_LOADED';

export function aiAppsLoadedAction(subscriptionId, apps) {
  return { type: AI_APPS_LOADED, payload: { subscriptionId, apps }};
}