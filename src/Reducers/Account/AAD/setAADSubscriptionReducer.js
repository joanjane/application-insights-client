import { SET_AAD_SUBSCRIPTION } from 'Actions/Account/AAD';

export function setAADSubscriptionReducer(state, action) {
  if (action.type !== SET_AAD_SUBSCRIPTION) return;

  state.account.aad.subscriptionId = action.payload.subscriptionId;
  return { ...state };
}