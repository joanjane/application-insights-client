import { ERROR } from 'Actions';

export function errorReducer(state, action) {
  if (action.type !== ERROR) return;
  return { ...state, error: action.payload, loading: false };
}