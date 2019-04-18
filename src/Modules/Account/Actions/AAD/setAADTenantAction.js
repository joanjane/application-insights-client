import { aadAccountActionTypes } from '.';

export function setAADTenantAction(tenantId) {
  tenantId = tenantId || 'common';
  return { type: aadAccountActionTypes.SET_AAD_TENANT, payload: { tenantId }};
}