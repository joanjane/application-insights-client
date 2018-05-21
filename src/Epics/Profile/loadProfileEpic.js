import { Observable } from 'rxjs/Observable';
import { profileLoaded, LOAD_PROFILE } from '../../Actions/Profile';

export const loadProfileEpic = (action$, store, { profileRepository, ConsoleDoc }) =>
    action$.ofType(LOAD_PROFILE)
        .switchMap(q => {
            ConsoleDoc.printHelpOnConsole();
            const credentials = profileRepository.getCredentials();
            const availableApps = profileRepository.getStoredAppNamesCredentials();
            const query = profileRepository.getQuery();
            return Observable.of(profileLoaded(credentials, query, availableApps));
        });