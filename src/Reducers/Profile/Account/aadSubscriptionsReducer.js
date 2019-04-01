import { AAD_SUBSCRIPTIONS_LOADED } from 'Actions/Profile/Account';

export function aadSubscriptionsReducer(state, action) {
  if (action.type !== AAD_SUBSCRIPTIONS_LOADED) return;

  const { subscriptions } = action.payload;
  const aad = { ...state.aad, subscriptions }
  return { ...state, aad };
}