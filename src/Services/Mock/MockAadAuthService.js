import { of } from 'rxjs';

export class MockAadAuthService {
  logout() {

  }

  silentTokenRefresh() {
    return of({success: true, errorMessage: null });
  }

  loginRedirect() {

  }

  getToken() {
    return 'demo';
  }

  isAuthenticated() {
    return this.getToken() != null;
  }
}