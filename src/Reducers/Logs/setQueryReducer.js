import { SET_QUERY } from '../../Actions/Logs';

export function setQueryReducer(state, action) {
  if (action.type !== SET_QUERY) return;
  return { ...state, query: action.payload.query };
}
