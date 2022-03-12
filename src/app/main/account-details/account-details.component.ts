import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../service/auth.service';
import Keycloak from 'keycloak-js';
import { filter, switchMap } from 'rxjs/operators';
import { OrderResponseDto } from '../../model/models';
import { OrderService } from '../../service/order.service';

@Component({
  selector: 'app-account-details',
  templateUrl: './account-details.component.html',
  styleUrls: ['./account-details.component.css'],
})
export class AccountDetailsComponent implements OnInit {
  isLogged = false;
  userProfile: Keycloak.KeycloakProfile;
  orders: OrderResponseDto[] = [];

  constructor(
    private authService: AuthService,
    private orderService: OrderService
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
        this.orderService
          .getOrdersByEmail(profile.email)
          .subscribe((orders) => (this.orders = orders));
      });
  }
}
