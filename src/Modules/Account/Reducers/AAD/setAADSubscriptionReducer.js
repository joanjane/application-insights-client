import { aadAccountActionTypes } from 'Modules/Account/Actions/AAD';

export function setAADSubscriptionReducer(state, action) {
  if (action.type !== aadAccountActionTypes.SET_AAD_SUBSCRIPTION) return;

  state.account.aad.subscriptionId = action.payload.subscriptionId;
  return { ...state };
}