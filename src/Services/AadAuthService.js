export class AadAuthService {
  constructor(storageRepository) {
    this.storageRepository = storageRepository;

    const fragmentParams = this.parseFragmentParams();
    if (!fragmentParams) {
      return;
    }
    if (fragmentParams['error']) {
      const err = `Error: ${fragmentParams['error']}\nDetails: ${fragmentParams['error_description']}`;
      alert(err);
    } else if (fragmentParams['access_token']) {
      this.storageRepository.saveSessionData('access_token', fragmentParams['access_token']);
    }
    document.location.hash = '';
  }

  getToken() {
    return this.storageRepository.getSessionData('access_token');
  }

  isAuthenticated() {
    return !!this.getToken();
  }

  getHash() {
    return document.location.hash;
  }

  logout() {
    this.storageRepository.removeSessionData('access_token');
    window.location.reload();
  }

  parseFragmentParams() {
    if (this.getHash() === '') {
      return null;
    }
    const params = this.getHash().substring(1).split('&')
      .map(p => {
        const prop = p.split('=');
        return {
          key: prop[0],
          value: decodeURIComponent(prop[1].replace(/\+/g, '%20'))
        }
      }).reduce((prev, current) => {
        prev[current.key] = current.value;
        return prev;
      }, {});

    return params;
  }

  redirectToSso() {
    const clientId = process.env.REACT_APP_CLIENT_ID;
    const audience = 'https://management.azure.com/';
    const redirectUrl = `https://login.microsoftonline.com/common/oauth2/authorize?client_id=${clientId}&response_type=token&redirect_uri=${encodeURIComponent(document.location.origin)}&resource=${encodeURIComponent(audience)}&scopes=user_impersonation`;

    document.location.href = redirectUrl;
  }
}