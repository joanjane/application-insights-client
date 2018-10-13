import { of } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { ofType } from 'redux-observable';
import { profileLoadedAction, LOAD_PROFILE } from '../../Actions/Profile';

export const loadProfileEpic = (action$, store, { profileRepository, ConsoleDoc }) =>
  action$.pipe(
    ofType(LOAD_PROFILE),
    switchMap(q => {
      ConsoleDoc.printHelpOnConsole();
      const credentials = profileRepository.getCredentials();
      const availableApps = profileRepository.getStoredAppNamesCredentials();
      const query = profileRepository.getQuery();
      return of(profileLoadedAction(credentials, query, availableApps));
    })
  );