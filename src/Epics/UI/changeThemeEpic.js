import { of } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { ofType } from 'redux-observable';
import { emptyAction } from 'Actions';
import { CHANGE_UI_THEME } from 'Actions/UI';

export const changeThemeEpic = (action$, $state, { profileRepository }) =>
  action$
    .pipe(
      ofType(CHANGE_UI_THEME),
      switchMap(q => {
        profileRepository.setUITheme(q.payload.theme);
        return of(emptyAction());
      })
    );

