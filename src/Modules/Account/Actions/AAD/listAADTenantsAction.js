import { aadAccountActionTypes } from '.';

export function listAADTenantsAction() {
  return { type: aadAccountActionTypes.LIST_AAD_TENANTS, payload: { }};
}