import { Observable } from 'rxjs/Observable';
import {
    TRY_FIND_CREDENTIALS,
    SET_CREDENTIALS,
    SET_QUERY,
    CLEAR_DATA,
    LOAD_PROFILE
} from '../../Actions/Types';

import {
    profileLoaded,
    setCredentials,
    empty
} from '../../Actions';

export const findCredentialsCandidateEpic = (action$, store, { profileRepository }) =>
    action$.ofType(TRY_FIND_CREDENTIALS)
        .switchMap(q => {
            return Observable
                .of(profileRepository.findCredentialsCanditate(q.payload))
                .filter(credentials => credentials !== null)
                .map(credentials => {
                    return credentials ? setCredentials(credentials) : empty();
                });
        });

export const setCredentialsEpic = (action$, store, { profileRepository }) =>
    action$.ofType(SET_CREDENTIALS)
        .switchMap(q => {
            profileRepository.storeCredentials(q.payload);
            return Observable.of(empty());
        });

export const setQueryEpic = (action$, store, { profileRepository }) =>
    action$.ofType(SET_QUERY)
        .switchMap(q => {
            profileRepository.storeQuery(q.payload);
            return Observable.of(empty());
        });

export const clearDataEpic = (action$, store, { profileRepository }) =>
    action$.ofType(CLEAR_DATA)
        .switchMap(q => {
            profileRepository.clearData();
            return Observable.of(empty());
        });

export const loadProfileEpic = (action$, store, { profileRepository, ConsoleDoc }) =>
    action$.ofType(LOAD_PROFILE)
        .switchMap(q => {
            ConsoleDoc.printHelpOnConsole();
            const credentials = profileRepository.getCredentials();
            const availableApps = profileRepository.getStoredAppNamesCredentials();
            const query = profileRepository.getQuery();
            return Observable.of(profileLoaded(credentials, query, availableApps));
        });