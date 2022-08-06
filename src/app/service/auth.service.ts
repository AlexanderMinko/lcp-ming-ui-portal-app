import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { from, Observable, Subject } from 'rxjs';
import { KeycloakService } from 'keycloak-angular';
import Keycloak from 'keycloak-js';
import { Account, CreateAccountParam } from '../model/models';
import { filter, switchMap, tap } from 'rxjs/operators';
import { LCP_ADMIN } from '../constants';
import { Environment } from '../../environments/environment';

const FORM_DATA_JSON = 'application/json';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly apiUrl = Environment.production ? Environment.apiUrl : Environment.accountServiceUrl;
  private readonly baseUrl = this.apiUrl + '/account-service/accounts';
  isLoggedChange$ = new Subject<boolean>();
  isLogged: boolean = false;

  constructor(private http: HttpClient, private keycloak: KeycloakService) {}

  isLcpAdmin(): boolean {
    return this.keycloak.isUserInRole(LCP_ADMIN);
  }

  checkRecentLoggedIn(): void {
    this.isLoggedIn()
      .pipe(
        tap((value) => {
          this.isLoggedChange$.next(value !== this.isLogged);
          this.isLogged = value;
        })
      )
      .subscribe();
  }

  isLoggedIn(): Observable<boolean> {
    return from(this.keycloak.isLoggedIn());
  }

  login(): Observable<void> {
    return from(this.keycloak.login());
  }

  logOut(): Observable<void> {
    return from(this.keycloak.logout(Environment.appUrl));
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

  getAccounts(page: number, size: number, freeText: string): Observable<AccountResponse> {
    let params = new HttpParams().set('page', page).set('size', size);
    if (freeText) {
      params = params.set('free_text', freeText);
    }
    return this.http.get<AccountResponse>(`${this.baseUrl}`, { params });
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

  getToken(): Observable<string> {
    return from(this.keycloak.getToken());
  }
}

export interface PhotoResponse {
  photo: string;
}

export interface AccountResponse {
  content: Account[];
  totalElements: number;
}
