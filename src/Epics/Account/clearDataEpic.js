import { of } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { ofType } from 'redux-observable';
import { accountActionTypes } from 'Actions/Account';
import { emptyAction } from 'Actions';

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
