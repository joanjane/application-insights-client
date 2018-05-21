export const PROFILE_LOADED = 'PROFILE_LOADED';
export function profileLoaded(credentials, query, availableApps) {
    return {
        type: PROFILE_LOADED, 
        payload: {
            credentials,
            query,
            availableApps
        }
    };
}