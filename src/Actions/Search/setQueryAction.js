import { searchActionTypes } from '.';

export function setQueryAction(query) {
  return { type: searchActionTypes.SET_QUERY, payload: { query } };
}