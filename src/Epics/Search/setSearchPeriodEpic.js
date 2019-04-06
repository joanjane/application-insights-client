import { of } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { ofType } from 'redux-observable';
import { SET_SEARCH_PERIOD } from 'Actions/Search';
import { emptyAction } from 'Actions';

export const setSearchPeriodEpic = (action$, store, { inject }) => {
  const profileRepository = inject('ProfileRepository');
  return action$
    .pipe(
      ofType(SET_SEARCH_PERIOD),
      switchMap(q => {
        profileRepository.storeSearchPeriod(q.payload.searchPeriod);
        return of(emptyAction());
      })
    );
}