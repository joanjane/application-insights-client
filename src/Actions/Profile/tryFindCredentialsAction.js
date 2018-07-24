export const TRY_FIND_CREDENTIALS = 'TRY_FIND_CREDENTIALS';
export function tryFindCredentialsAction(appName) {
  return { type: TRY_FIND_CREDENTIALS, payload: { appName } };
}