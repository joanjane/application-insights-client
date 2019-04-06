export const SET_AAD_RESOURCE = 'SET_AAD_RESOURCE';

export function setAADResourceAction(resourceId, appId) {
  resourceId = resourceId || '';
  appId = appId || '';
  return { type: SET_AAD_RESOURCE, payload: { resourceId, appId }};
}