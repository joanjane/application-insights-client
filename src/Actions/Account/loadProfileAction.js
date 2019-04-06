export const LOAD_PROFILE = 'LOAD_PROFILE';
export const PROFILE_LOADED = 'PROFILE_LOADED';

export function loadProfileAction() {
  return { type: LOAD_PROFILE };
}

export function profileLoadedAction() {
  return { type: PROFILE_LOADED };
}