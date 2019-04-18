import { of } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { ofType } from 'redux-observable';
import { accountActionTypes } from 'Modules/Account/Actions';
import { emptyAction } from 'Modules/Shared/Actions';

export const clearDataEpic = (action$, store, { inject }) => {
  const profileRepository = inject('ProfileRepository');
  return action$
    .pipe(
      ofType(accountActionTypes.CLEAR_DATA),
      switchMap(q => {
        profileRepository.clearData();
        return of(emptyAction());
      })
    );
}
