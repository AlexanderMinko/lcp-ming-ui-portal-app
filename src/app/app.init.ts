import { KeycloakService } from 'keycloak-angular';

export function initializeKeycloak(
  keycloak: KeycloakService
): () => Promise<boolean> {
  return () =>
    keycloak.init({
      config: {
        url: 'http://localhost:8080/auth',
        realm: 'LCPRealm',
        clientId: 'angular-app',
      },
      initOptions: {
        onLoad: 'check-sso',
      },
      loadUserProfileAtStartUp: true,
      bearerExcludedUrls: [],
    });
}
