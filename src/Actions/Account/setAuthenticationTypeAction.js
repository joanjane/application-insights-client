export const SET_AUTH_TYPE = 'SET_AUTH_TYPE';

export function setAuthenticationTypeAction(authenticationType) {
  return { type: SET_AUTH_TYPE, payload: { authenticationType } };
}