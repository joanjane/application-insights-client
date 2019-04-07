import { searchActionTypes } from '.';

export function loadingAction(loading, source) {
  return { type: searchActionTypes.LOADING, payload: { loading, source } };
}