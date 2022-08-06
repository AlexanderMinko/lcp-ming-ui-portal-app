import { Component, OnInit } from '@angular/core';
import {  Subject } from 'rxjs';
import { AuthService } from '../../service/auth.service';
import Keycloak from 'keycloak-js';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-product-page',
  templateUrl: './product-page.component.html',
  styleUrls: ['./product-page.component.css'],
})
export class ProductPageComponent implements OnInit {
  isLoggedChange$: Subject<boolean>;
  userProfile: Keycloak.KeycloakProfile;

  constructor(private authService: AuthService, private http: HttpClient) {}

  ngOnInit(): void {
    this.authService.getCurrentUserProfile().subscribe((profile) => (this.userProfile = profile));
    this.authService.checkRecentLoggedIn();
    this.isLoggedChange$ = this.authService.isLoggedChange$;
  }

}
