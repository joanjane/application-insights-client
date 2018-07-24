import { initialState } from '../initialState';
import { CLEAR_DATA } from '../../Actions/Profile';

export function clearDataReducer(state, action) {
  if (action.type !== CLEAR_DATA) return;
  return { ...initialState() };
}
