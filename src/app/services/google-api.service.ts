import { Injectable } from '@angular/core';
import { AuthConfig, OAuthService } from 'angular-oauth2-oidc';
import { JwksValidationHandler } from 'angular-oauth2-oidc-jwks';

const oAuthConfig: AuthConfig = {
  issuer: 'https://accounts.google.com',
  redirectUri: window.location.origin,
  clientId: '98605083147-p6lchdpldb2acjpr0ngng67rh17essto.apps.googleusercontent.com',
  scope: 'openid profile email',
  strictDiscoveryDocumentValidation: false,
}

@Injectable({
  providedIn: 'root'
})
export class GoogleApiService {

  constructor(private oAuthService: OAuthService) {
  }

 googleLogin(): void {
    this.oAuthService.initLoginFlow()
    this.oAuthService.configure(oAuthConfig)
    this.oAuthService.loadDiscoveryDocumentAndTryLogin()
    const c = this.oAuthService.getIdentityClaims();
    console.log(c)
  }
}
