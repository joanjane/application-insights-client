import { initialState } from 'Store/initialState';
import { accountActionTypes } from 'Modules/Account/Actions';

export function clearDataReducer(state, action) {
  if (action.type !== accountActionTypes.CLEAR_DATA) return;

  return { ...initialState() };
}
