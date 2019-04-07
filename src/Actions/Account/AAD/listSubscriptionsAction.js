import { aadAccountActionTypes } from '.';

export function listSubscriptionsAction() {
  return { type: aadAccountActionTypes.LIST_AAD_SUBSCRIPTIONS, payload: { }};
}