import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { from, Observable, ObservedValueOf, of } from 'rxjs';
import { KeycloakService } from 'keycloak-angular';
import Keycloak from 'keycloak-js';
import { Account, RegistrationRequest } from '../model/models';
import { filter, switchMap } from 'rxjs/operators';
import { LCP_ADMIN } from '../constants';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly baseUrl = 'http://localhost:8094/accounts';
  constructor(private http: HttpClient, private keycloak: KeycloakService) {}

  isLcpAdmin(): boolean {
    return this.keycloak.isUserInRole(LCP_ADMIN);
  }

  isLoggedIn(): Observable<boolean> {
    return from(this.keycloak.isLoggedIn());
  }

  login(): Observable<void> {
    return from(this.keycloak.login());
  }

  async logOut(): Promise<void> {
    await this.keycloak.logout('http://localhost:4200');
  }

  loadUserProfile(): Observable<Keycloak.KeycloakProfile> {
    return from(this.keycloak.loadUserProfile());
  }

  customRegistrationAccount(registrationRequest: RegistrationRequest): Observable<void> {
    return this.http.post<void>(`${this.baseUrl}/register`, registrationRequest);
  }

  getAccount(id: string | undefined): Observable<Account> {
    return this.http.get<Account>(`${this.baseUrl}/${id}`);
  }

  getCurrentUserProfile(): Observable<Keycloak.KeycloakProfile> {
    return this.isLoggedIn().pipe(
      filter((isLogged: boolean) => isLogged),
      switchMap(() => this.loadUserProfile())
    );
  }

  isUserExist(field: string, value: string): Observable<boolean> {
    return this.http.get<boolean>(`${this.baseUrl}/check/${field}/${value}`);
  }
}
