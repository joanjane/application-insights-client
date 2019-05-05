import { aadAccountActionTypes } from '.';

export function setAADSubscriptionAction(subscriptionId) {
  subscriptionId = subscriptionId || '';
  return { type: aadAccountActionTypes.SET_AAD_SUBSCRIPTION, payload: { subscriptionId }};
}