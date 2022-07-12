import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { from, Observable, ObservedValueOf, of } from 'rxjs';
import { KeycloakService } from 'keycloak-angular';
import Keycloak from 'keycloak-js';
import { Account, CreateAccountParam } from '../model/models';
import { filter, switchMap } from 'rxjs/operators';
import { LCP_ADMIN } from '../constants';

const FORM_DATA_JSON = 'application/json';

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

  customRegistrationAccount(createAccountParam: CreateAccountParam, image: File): Observable<void> {
    const formData = new FormData();
    formData.append('createParamJson', new Blob([JSON.stringify(createAccountParam)], { type: FORM_DATA_JSON }));
    if (image) {
      formData.append('imageFile', image, image.name);
    }
    return this.http.post<void>(`${this.baseUrl}/register`, formData);
  }

  getAccount(id: string | undefined): Observable<Account> {
    return this.http.get<Account>(`${this.baseUrl}/${id}`);
  }

  getAccountPhotoUrl(id: string | undefined): Observable<PhotoResponse> {
    return this.http.get<PhotoResponse>(`${this.baseUrl}/${id}/photo`);
  }

  updateAccountPhoto(id: string | undefined, image: File): Observable<void> {
    const formData = new FormData();
    if (image) {
      formData.append('imageFile', image, image.name);
    }
    return this.http.post<void>(`${this.baseUrl}/${id}/photo`, formData);
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

export interface PhotoResponse {
  photo: string;
}
