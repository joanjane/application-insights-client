import { aadAccountActionTypes } from '.';

export function setAADResourceAction(resourceId, appId) {
  resourceId = resourceId || '';
  appId = appId || '';
  return { type: aadAccountActionTypes.SET_AAD_RESOURCE, payload: { resourceId, appId }};
}