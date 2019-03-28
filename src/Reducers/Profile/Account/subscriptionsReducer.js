import { PROFILE_LOADED, AVAILABLE_APPS_LOADED } from 'Actions/Profile/Account';

export function aadSubscriptionsReducer(state, action) {
  if (action.type !== PROFILE_LOADED && action.type !== AVAILABLE_APPS_LOADED) return;
  const loadedProps = {};
  if (action.payload.subscriptions) {
    loadedProps.subscriptions = action.subscriptions;
  }
  return { ...state, ...{ aad: {...loadedProps } } };
}