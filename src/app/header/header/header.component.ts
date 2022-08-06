import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../service/auth.service';
import { KeycloakService } from 'keycloak-angular';
import Keycloak from 'keycloak-js';
import { filter, switchMap } from 'rxjs/operators';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { LoginComponent } from '../login/login.component';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
})
export class HeaderComponent implements OnInit {
  userProfile: Keycloak.KeycloakProfile;
  isLcpAdmin: boolean;
  photoUrl: string;

  constructor(
    private keycloak: KeycloakService,
    private authService: AuthService,
    private modalService: NgbModal
  ) {}

  ngOnInit(): void {
    this.authService
      .getCurrentUserProfile()
      .pipe(
        switchMap((profile) => {
          this.userProfile = profile;
          return this.authService.getAccountPhotoUrl(profile.id);
        })
      )
      .subscribe((url) => {
        this.photoUrl = url.photo;
      });
    this.isLcpAdmin = this.authService.isLcpAdmin();
  }

  onSignIn(): void {
    this.authService.login();
  }

  onSignOut(): void {
    this.authService.logOut().subscribe();
  }

  onSignUp(): void {
    this.modalService.open(LoginComponent, {
      size: 'lg',
      windowClass: 'modal-holder',
    });
  }
}
