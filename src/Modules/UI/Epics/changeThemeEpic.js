import { of } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { ofType } from 'redux-observable';
import { emptyAction } from 'Modules/Shared/Actions';
import { uiActionTypes } from 'Modules/UI/Actions';

export const changeThemeEpic = (action$, $state, { inject }) => {
  const profileRepository = inject('ProfileRepository');
  return action$
    .pipe(
      ofType(uiActionTypes.CHANGE_UI_THEME),
      switchMap(q => {
        profileRepository.setUITheme(q.payload.theme);
        return of(emptyAction());
      })
    );
}