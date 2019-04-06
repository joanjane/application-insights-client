export const SET_QUERY = 'SET_QUERY';
export function setQueryAction(query) {
  return { type: SET_QUERY, payload: { query } };
}