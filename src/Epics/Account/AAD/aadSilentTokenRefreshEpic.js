import { mergeMap, filter } from 'rxjs/operators';
import { ofType } from 'redux-observable';
import { emptyAction, errorAction } from 'Actions';
import { aadAccountActionTypes, aadAuthenticatedAction } from 'Actions/Account/AAD';
import AuthenticationType from 'Models/AuthenticationType';
import { of } from 'rxjs';

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
            mergeMap(result => {
              if (!result.success) {
                return of(
                  aadAuthenticatedAction(false),
                  errorAction(`An error has occurred while refreshing token silently: ${result.errorMessage}. Login again.`)
                );
              }

              const retryAction = action.payload.retryAction;
              const nextAction = retryAction ? retryAction : emptyAction();
              return of(aadAuthenticatedAction(true), nextAction);
            })
          );
      })
    )
  ;
}