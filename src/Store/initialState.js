import { initialState as accountInitialState } from 'Modules/Account/Store';
import { initialState as searchInitialState } from 'Modules/Search/Store';
import { initialState as uiInitialState } from 'Modules/UI/Store';
import { initialState as sharedInitialState } from 'Modules/Shared/Store';

export const initialState = () => {
  let state = { };

  state = accountInitialState(state);
  state = searchInitialState(state);
  state = uiInitialState(state);
  state = sharedInitialState(state);

  return state;
}