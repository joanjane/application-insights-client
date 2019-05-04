import { aadAccountActionTypes } from '.';

export function setAADTenantAction(tenantId) {
  if (!tenantId) {
    throw new Error('tenantId must have a value');
  }
  return { type: aadAccountActionTypes.SET_AAD_TENANT, payload: { tenantId }};
}