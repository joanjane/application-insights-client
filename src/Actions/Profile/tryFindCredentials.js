export const TRY_FIND_CREDENTIALS = 'TRY_FIND_CREDENTIALS';
export function tryFindCredentials(appName) {
    return { type: TRY_FIND_CREDENTIALS, payload: appName };
}