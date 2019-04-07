import { aadAccountActionTypes } from '.';

export function aadAuthenticatedAction(authenticated) {
  return { type: aadAccountActionTypes.AAD_AUTHENTICATED, payload: { authenticated } };
}