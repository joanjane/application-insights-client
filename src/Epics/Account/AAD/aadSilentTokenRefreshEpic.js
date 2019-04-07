import { mergeMap, map, filter } from 'rxjs/operators';
import { ofType } from 'redux-observable';
import { emptyAction } from 'Actions';
import { aadAccountActionTypes } from 'Actions/Account/AAD';
import AuthenticationType from 'Models/AuthenticationType';

export const aadSilentTokenRefreshEpic = (action$, state$, { inject }) => {
  const aadAuthService = inject('AadAuthService');

  return action$
    .pipe(
      ofType(aadAccountActionTypes.AAD_SILENT_REFRESH),
      filter(action => {
        const state = state$.value;
        return state.account.authenticationType === AuthenticationType.aad;
      }),
      mergeMap((action) => {
        return aadAuthService.silentTokenRefresh()
          .pipe(
            map(result => {
              if (!result.success) {
                alert(`An error has occurred while refreshing token silently: ${result.errorMessage}`);
              }
              const retryAction = action.payload.retryAction;
              return retryAction ? retryAction : emptyAction();
            })
          );
      })
    )
  ;
}