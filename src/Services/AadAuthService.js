export class AadAuthService {
  constructor(storageRepository) {
    this.storageRepository = storageRepository;
    this.clientId = process.env.REACT_APP_CLIENT_ID;
    this.scopes = [
      'openid',
      'profile',
      'https://management.azure.com/user_impersonation',
      // 'https://api5.applicationinsights.io/Data.Read' // AAD Gives an error (AADSTS28000) if more than 1 scope. Really MSFT!?
    ];

    this.checkResponseCallback();
  }

  checkResponseCallback() {
    const fragmentParams = this.parseFragmentParams();
    if (!fragmentParams) return;

    if (fragmentParams['error']) {
      const err = `Error: ${fragmentParams['error']}\nDetails: ${fragmentParams['error_description']}`;
      alert(err);
      this.setHash('');
    } else if (fragmentParams['access_token']) {
      this.storageRepository.saveSessionData('access_token', fragmentParams['access_token']);
      this.setHash('');
    }
  }

  getToken() {
    return this.storageRepository.getSessionData('access_token');
  }

  isAuthenticated() {
    return this.getToken() == null;
  }

  getHash() {
    return document.location.hash;
  }

  setHash(hash) {
    return document.location.hash = hash;
  }

  logout() {
    this.storageRepository.removeSessionData('access_token');
  }

  parseFragmentParams() {
    if (this.getHash() === '') {
      return null;
    }
    const params = this.getHash().substring(1).split('&')
      .map(p => {
        const prop = p.split('=');
        return {
          name: prop[0],
          value: decodeURIComponent(prop[1].replace(/\+/g, '%20'))
        }
      }).reduce((prev, current) => {
        prev[current.name] = current.value;
        return prev;
      }, {});

    return params;
  }

  loginRedirect() {
    const queryParams = [
      { name: 'client_id', value: this.clientId },
      { name: 'response_type', value: 'token' },
      { name: 'redirect_uri', value: document.location.origin },
      { name: 'scope', value: this.scopes.join(' ') },
      { name: 'prompt', value: 'select_account' },
    ];
    const tenant = 'organizations';
    const redirectUrl = `https://login.microsoftonline.com/${tenant}/oauth2/v2.0/authorize?${this.formatQuery(queryParams)}`;
    document.location.href = redirectUrl;
  }

  formatQuery(queryParams) {
    const query = queryParams.map(q => `${q.name}=${encodeURIComponent(q.value)}`).join('&');
    return query;
  }
}