import { Observable } from 'rxjs/Observable';
import { SET_QUERY } from '../../Actions/Logs';
import { empty } from '../../Actions';

export const setQueryEpic = (action$, store, { profileRepository }) =>
    action$.ofType(SET_QUERY)
        .switchMap(q => {
            profileRepository.storeQuery(q.payload);
            return Observable.of(empty());
        });