import { SET_CURRENT_APP_NAME } from 'Actions/Search';

export function setAppNameReducer(state, action) {
  if (action.type !== SET_CURRENT_APP_NAME) return;

  state.search.appName = action.payload.appName;

  return { ...state };
}