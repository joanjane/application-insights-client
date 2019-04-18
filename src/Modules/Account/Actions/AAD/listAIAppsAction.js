import { aadAccountActionTypes } from '.';

export function listAIAppsAction(subscriptionId) {
  return { type: aadAccountActionTypes.LIST_AI_APPS, payload: { subscriptionId }, retry: 0 };
}