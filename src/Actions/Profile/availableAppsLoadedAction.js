export const AVAILABLE_APPS_LOADED = 'AVAILABLE_APPS_LOADED';
export function availableAppsLoadedAction(availableApps) {
    return {
        type: AVAILABLE_APPS_LOADED, 
        payload: {
            availableApps
        }
    };
}