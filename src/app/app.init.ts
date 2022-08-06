import { KeycloakService } from 'keycloak-angular';
import { Environment } from '../environments/environment';

export function initializeKeycloak(
  keycloak: KeycloakService
): () => Promise<boolean> {
  console.log(Environment.keycloakUrl);
  return () =>
    keycloak.init({
      config: {
        url: Environment.keycloakUrl,
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
