import { PROFILE_LOADED, AVAILABLE_APPS_LOADED } from 'Actions/Profile';

export function availableAppsReducer(state, action) {
  if (action.type !== PROFILE_LOADED && action.type !== AVAILABLE_APPS_LOADED) return;
  const loadedProps = {};
  if (action.payload.availableApps) {
    loadedProps.availableApps = action.payload.availableApps;
  }
  return { ...state, ...loadedProps };
}