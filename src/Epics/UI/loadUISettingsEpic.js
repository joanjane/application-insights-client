import { of } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { ofType } from 'redux-observable';
import { emptyAction} from 'Actions';
import { accountActionTypes } from 'Actions/Account';
import { changeThemeAction} from 'Actions/UI';

export const loadUISettingsEpic = (action$, store, { inject }) => {
  const profileRepository = inject('ProfileRepository');
  return action$.pipe(
    ofType(accountActionTypes.LOAD_PROFILE),
    switchMap(q => {
      const theme = profileRepository.getUITheme();
      if (theme) {
          return of(changeThemeAction(theme));
      }
      return of(emptyAction());
    })
  );
}