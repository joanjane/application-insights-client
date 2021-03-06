import { of } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { ofType } from 'redux-observable';
import { searchActionTypes } from 'Modules/Search/Actions';
import { emptyAction } from 'Modules/Shared/Actions';

export const setSearchPeriodEpic = (action$, store, { inject }) => {
  const profileRepository = inject('ProfileRepository');
  return action$
    .pipe(
      ofType(searchActionTypes.SET_SEARCH_PERIOD),
      switchMap(q => {
        profileRepository.storeSearchPeriod(q.payload.searchPeriod);
        return of(emptyAction());
      })
    );
}