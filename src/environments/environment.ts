// This file can be replaced during build by using the `fileReplacements` array.
// `ng build` replaces `environment.ts` with `environment.docker.ts`.
// The list of file replacements can be found in `angular.json`.

export class Environment {
  static production = false;
  static appUrl = 'http://localhost:4200';
  static accountServiceUrl = 'http://localhost:8094';
  static productServiceUrl = 'http://localhost:8090';
  static orderServiceUrl = 'http://localhost:8091';
  static messageServiceUrl = 'http://localhost:8099';
  static keycloakUrl = 'http://localhost:8080/auth';
  static minioUrl = 'http://localhost:9000';
  static apiUrl = '';
}

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.
