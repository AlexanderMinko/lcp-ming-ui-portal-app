import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../service/auth.service';
import { KeycloakService } from 'keycloak-angular';
import Keycloak from 'keycloak-js';
import { filter, switchMap } from 'rxjs/operators';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { LoginComponent } from '../login/login.component';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
})
export class HeaderComponent implements OnInit {
  isLogged = false;
  userProfile: Keycloak.KeycloakProfile;
  isLcpAdmin: boolean;

  constructor(
    private keycloak: KeycloakService,
    private authService: AuthService,
    private modalService: NgbModal
  ) {}

  ngOnInit(): void {
    this.authService
      .isLoggedIn()
      .pipe(
        filter((isLogged: boolean) => isLogged),
        switchMap((isLogged: boolean) => {
          this.isLogged = isLogged;
          return this.authService.loadUserProfile();
        })
      )
      .subscribe((profile) => {
        this.userProfile = profile;
      });
    this.isLcpAdmin = this.authService.isLcpAdmin();
  }

  onSignIn(): void {
    this.keycloak.login();
  }

  onSignOut(): void {
    this.keycloak.logout('http://localhost:4200');
  }

  onSignUp(): void {
    this.modalService.open(LoginComponent, {
      size: 'lg',
      windowClass: 'modal-holder',
    });
  }
}
