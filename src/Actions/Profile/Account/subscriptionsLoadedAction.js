export const AAD_SUBSCRIPTIONS_LOADED = 'AAD_SUBSCRIPTIONS_LOADED';

export function subscriptionsLoadedAction(subscriptions) {
  return { type: AAD_SUBSCRIPTIONS_LOADED, payload: { subscriptions }};
}