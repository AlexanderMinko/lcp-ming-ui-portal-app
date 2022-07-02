import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../service/auth.service';
import Keycloak from 'keycloak-js';
import { filter, switchMap } from 'rxjs/operators';
import { Account, OrderResponseDto } from '../../model/models';
import { OrderService } from '../../service/order.service';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-account-details',
  templateUrl: './account-details.component.html',
  styleUrls: ['./account-details.component.css'],
})
export class AccountDetailsComponent implements OnInit {
  isLogged = false;
  userProfile: Keycloak.KeycloakProfile;
  account: Account;
  orders: OrderResponseDto[] = [];

  constructor(private authService: AuthService, private orderService: OrderService) {}

  ngOnInit(): void {
    this.loadFullAccountInfo();
  }

  loadFullAccountInfo(): void {
    this.authService
      .loadUserProfile()
      .pipe(
        switchMap((profile) => {
          this.userProfile = profile;
          return forkJoin([
            this.orderService.getOrdersByAccountId(profile.id),
            this.authService.getAccount(profile.id),
          ]);
        })
      )
      .subscribe(([orders, account]) => {
        this.orders = orders;
        this.account = account;
      });
  }
}
