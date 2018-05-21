export const SET_CREDENTIALS = 'SET_CREDENTIALS';
export function setCredentials(credentials) {
    return { type: SET_CREDENTIALS, payload: credentials };
}