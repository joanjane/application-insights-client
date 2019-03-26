import { of } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { ofType } from 'redux-observable';
import { profileLoadedAction, LOAD_PROFILE } from 'Actions/Profile';

export const loadProfileEpic = (action$, store, { inject }) => {
  const profileRepository = inject('ProfileRepository');
  const consoleDoc = inject('ConsoleDoc');
  return action$.pipe(
    ofType(LOAD_PROFILE),
    switchMap(q => {
      consoleDoc.printHelpOnConsole();
      const credentials = profileRepository.getCredentials();
      const availableApps = profileRepository.getStoredAppNamesCredentials();
      const query = profileRepository.getQuery();
      return of(profileLoadedAction(credentials, query, availableApps));
    })
  );
}