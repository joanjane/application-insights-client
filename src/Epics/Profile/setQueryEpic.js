import { Observable } from 'rxjs/Observable';
import { SET_QUERY } from '../../Actions/Logs';
import { emptyAction } from '../../Actions';

export const setQueryEpic = (action$, store, { profileRepository }) =>
    action$.ofType(SET_QUERY)
        .switchMap(q => {
            profileRepository.storeQuery(q.payload.query);
            return Observable.of(emptyAction());
        });