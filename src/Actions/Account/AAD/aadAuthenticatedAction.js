export const AAD_AUTHENTICATED = 'AAD_AUTHENTICATED';

export function aadAuthenticatedAction(authenticated) {
  return { type: AAD_AUTHENTICATED, payload: { authenticated } };
}