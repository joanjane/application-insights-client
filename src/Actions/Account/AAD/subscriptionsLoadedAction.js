import { aadAccountActionTypes } from '.';

export function subscriptionsLoadedAction(subscriptions) {
  return { type: aadAccountActionTypes.AAD_SUBSCRIPTIONS_LOADED, payload: { subscriptions }};
}