export const SET_CURRENT_APP_NAME = 'SET_CURRENT_APP_NAME';

export function setAppNameAction(state, action) {
  if (action.type !== SET_CURRENT_APP_NAME) return;

  state.search.appName = action.payload.appName;

  return { ...state };
}