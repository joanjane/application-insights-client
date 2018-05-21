import { Observable } from 'rxjs/Observable';
import { CLEAR_DATA } from '../../Actions/Profile';
import { empty } from '../../Actions';

export const clearDataEpic = (action$, store, { profileRepository }) =>
    action$.ofType(CLEAR_DATA)
        .switchMap(q => {
            profileRepository.clearData();
            return Observable.of(empty());
        });
