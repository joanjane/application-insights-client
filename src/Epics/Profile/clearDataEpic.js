import { of } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { ofType } from 'redux-observable';
import { CLEAR_DATA } from 'Actions/Profile';
import { emptyAction } from 'Actions';

export const clearDataEpic = (action$, store, { profileRepository }) =>
  action$
    .pipe(
      ofType(CLEAR_DATA),
      switchMap(q => {
        profileRepository.clearData();
        return of(emptyAction());
      })
    );
