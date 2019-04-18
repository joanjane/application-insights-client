import { aadAccountActionTypes } from '.';

export function tenantsLoadedAction(tenants) {
  return { type: aadAccountActionTypes.AAD_TENANTS_LOADED, payload: { tenants }};
}