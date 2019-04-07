import { aadAccountActionTypes } from '.';

export function setAADSubscriptionAction(subscriptionId) {
  return { type: aadAccountActionTypes.SET_AAD_SUBSCRIPTION, payload: { subscriptionId }};
}