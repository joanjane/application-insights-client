import { SET_CREDENTIALS } from '../../Actions/Profile';

export function setCredentialsReducer(state, action) {
  if (action.type !== SET_CREDENTIALS) return;
  return { ...state, credentials: action.payload.credentials };
}