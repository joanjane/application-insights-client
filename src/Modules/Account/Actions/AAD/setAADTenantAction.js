import { aadAccountActionTypes } from '.';

export function setAADTenantAction(tenantId) {
  tenantId = tenantId || '';
  return { type: aadAccountActionTypes.SET_AAD_TENANT, payload: { tenantId }};
}