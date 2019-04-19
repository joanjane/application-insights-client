import { of } from 'rxjs';
import { mergeMap, filter } from 'rxjs/operators';
import { ofType } from 'redux-observable';
import { emptyAction, errorAction } from 'Modules/Shared/Actions';
import { aadAccountActionTypes, aadAuthenticatedAction } from 'Modules/Account/Actions/AAD';
import { AuthenticationType } from 'Modules/Account/Models';

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
        return aadAuthService.silentTokenRefresh(state$.value.account.aad.tenantId)
          .pipe(
            mergeMap(result => {
              if (!result.success) {
                return of(
                  aadAuthenticatedAction(false),
                  errorAction(`An error has occurred while refreshing token silently: ${result.errorMessage}. Login again.`)
                );
              }

              const nextAction = getRetryAction(action);
              return of(aadAuthenticatedAction(true), nextAction);
            })
          );
      })
    )
  ;
}

function getRetryAction(action) {
  const retryAction = action.payload.retryAction;
  const nextAction = retryAction ? { ...retryAction } : emptyAction();
  nextAction.retry++;
  return nextAction;
}
