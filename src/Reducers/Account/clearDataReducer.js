import { initialState } from 'Reducers/initialState';
import { CLEAR_DATA } from 'Actions/Account';

export function clearDataReducer(state, action) {
  if (action.type !== CLEAR_DATA) return;

  return { ...initialState() };
}
