export const SET_CREDENTIALS = 'SET_CREDENTIALS';
export function setCredentialsAction(credentials) {
  return { type: SET_CREDENTIALS, payload: { credentials } };
}