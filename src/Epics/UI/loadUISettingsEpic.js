import { of } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { ofType } from 'redux-observable';
import { emptyAction} from 'Actions';
import { LOAD_PROFILE } from 'Actions/Profile';
import { changeThemeAction} from 'Actions/UI';

export const loadUISettingsEpic = (action$, store, { profileRepository, ConsoleDoc }) =>
  action$.pipe(
    ofType(LOAD_PROFILE),
    switchMap(q => {
      const theme = profileRepository.getUITheme();
      if (theme) {
          return of(changeThemeAction(theme));
      }
      return of(emptyAction());
    })
  );