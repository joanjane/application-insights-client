import { of } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { ofType } from 'redux-observable';
import { searchActionTypes } from 'Modules/Search/Actions';
import { emptyAction } from 'Modules/Shared/Actions';

export const setQueryEpic = (action$, store, { inject }) => {
  const profileRepository = inject('ProfileRepository');
  return action$
    .pipe(
      ofType(searchActionTypes.SET_QUERY),
      switchMap(q => {
        profileRepository.storeQuery(q.payload.query);
        return of(emptyAction());
      })
    );
}