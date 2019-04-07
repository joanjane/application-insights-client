import { initialState } from 'Reducers/initialState';
import { accountActionTypes } from 'Actions/Account';

export function clearDataReducer(state, action) {
  if (action.type !== accountActionTypes.CLEAR_DATA) return;

  return { ...initialState() };
}
