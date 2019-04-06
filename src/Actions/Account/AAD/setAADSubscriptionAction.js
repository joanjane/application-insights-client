export const SET_AAD_SUBSCRIPTION = 'SET_AAD_SUBSCRIPTION';

export function setAADSubscriptionAction(subscriptionId) {
  return { type: SET_AAD_SUBSCRIPTION, payload: { subscriptionId }};
}