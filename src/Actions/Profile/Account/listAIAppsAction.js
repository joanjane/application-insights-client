export const LIST_AI_APPS = 'LIST_AI_APPS';

export function listAIAppsAction(subscriptionId) {
  return { type: LIST_AI_APPS, payload: { subscriptionId } };
}