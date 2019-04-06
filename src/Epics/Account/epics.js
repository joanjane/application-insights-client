import {
  clearDataEpic,
  loadProfileEpic,
  setAuthenticationTypeEpic
} from '.';

import {
  loadSubscriptionsEpic,
  loadSubscriptionsAppsEpic,
  aadLoginEpic,
  aadLogoutEpic,
  aadSilentTokenRefreshEpic,
  setAADSubscriptionEpic
} from './AAD';

import {
  findApiKeyCredentialsCandidateEpic,
  setApiKeyCredentialsEpic
} from './ApiKey';

export const epics = [
  clearDataEpic,
  loadProfileEpic,
  setAuthenticationTypeEpic,

  loadSubscriptionsEpic,
  loadSubscriptionsAppsEpic,
  aadLoginEpic,
  aadLogoutEpic,
  aadSilentTokenRefreshEpic,
  setAADSubscriptionEpic,

  findApiKeyCredentialsCandidateEpic,
  setApiKeyCredentialsEpic
];