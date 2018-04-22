import { Observable } from 'rxjs/Observable';
import {
    TRY_FIND_CREDENTIALS,
    SET_CREDENTIALS,
    SET_QUERY,
    CLEAR_DATA
} from '../../Actions/Types';

import {
    setCredentials,
    empty
} from '../../Actions';

import ProfileRepository from '../../Services/ProfileRepository';
const profileRepository = new ProfileRepository();

export const findCredentialsCandidateEpic = (action$, store) =>
    action$.ofType(TRY_FIND_CREDENTIALS)
        .switchMap(q => {
            return Observable
                .of(profileRepository.findCredentialsCanditate(q.payload))
                .filter(credentials => credentials !== null)
                .map(credentials => {
                    return credentials ? setCredentials(credentials) : empty();
                });
        });

export const setCredentialsEpic = (action$, store) =>
    action$.ofType(SET_CREDENTIALS)
        .switchMap(q => {
            profileRepository.storeCredentials(q.payload);
            return Observable.of(empty());
        });

export const setQueryEpic = (action$, store) =>
    action$.ofType(SET_QUERY)
        .switchMap(q => {
            profileRepository.storeQuery(q.payload);
            return Observable.of(empty());
        });

export const clearDataEpic = (action$, store) =>
    action$.ofType(CLEAR_DATA)
        .switchMap(q => {
            profileRepository.clearData();
            return Observable.of(empty());
        });
