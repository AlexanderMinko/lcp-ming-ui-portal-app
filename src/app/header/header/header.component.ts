import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { AuthService } from '../../service/auth.service';
import { Router } from '@angular/router';
import { Observable, Subject } from 'rxjs';
import { KeycloakService } from 'keycloak-angular';
import { AuthGuard } from '../../guard/auth.guard';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
})
export class HeaderComponent implements OnInit {
  isLogged = false;
  username: string | undefined;
  subj: Subject<any> = new Subject<any>();
  account: Observable<boolean>;

  constructor(
    private keycloak: KeycloakService,
    private guard: AuthGuard,
    // private modalService: NgbModal,
    private authService: AuthService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}

  async ngOnInit(): Promise<void> {
    // this.isLogged = JSON.parse(localStorage.getItem('isLogg') || '');
    this.isLogged = await this.keycloak.isLoggedIn();
    if (this.isLogged) {
      const userProfile = await this.keycloak.loadUserProfile();
      this.username = userProfile.username;
    }

    // this.authService.accountChange.subscribe(
    //   data => this.account = data
    // );
    // this.authService.isLoggedChange.subscribe(
    //   data => this.isLogged = data
    // );
    // this.account = this.authService.getAccount();
    // this.isLogged = !!this.account;
  }

  open(): void {
    console.log(this.isLogged);
    this.keycloak.login();
    // localStorage.setItem('isLogg', JSON.stringify(true));
    // this.subj.next();
    // this.cdr.detectChanges();
    console.log(this.isLogged);
    // this.modalService.open(LoginComponent,
    //   { size: 'lg', windowClass: 'modal-holder' });
  }

  signOut(): void {
    // this.authService.logout();
    // this.router.navigate(['/']);
    console.log(this.isLogged);
    this.keycloak.logout('http://localhost:4200');
    // localStorage.setItem('isLogg', JSON.stringify(false));
    this.subj.next();
    // this.cdr.detectChanges();
    console.log(this.isLogged);
  }
}
