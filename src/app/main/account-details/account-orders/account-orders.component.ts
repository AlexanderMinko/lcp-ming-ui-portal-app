import { Component, OnInit } from '@angular/core';
import { Order } from '../../../model/models';
import { AuthService } from '../../../service/auth.service';
import { OrderService } from '../../../service/order.service';
import Keycloak from 'keycloak-js';
import { switchMap } from 'rxjs/operators';

@Component({
  selector: 'app-account-orders',
  templateUrl: './account-orders.component.html',
  styleUrls: ['./account-orders.component.css'],
})
export class AccountOrdersComponent implements OnInit {
  orders: Order[] = [];
  userProfile: Keycloak.KeycloakProfile;

  constructor(private authService: AuthService, private orderService: OrderService) {}

  ngOnInit(): void {
    this.authService
      .loadUserProfile()
      .pipe(
        switchMap((userProfile) => {
          this.userProfile = userProfile;
          return this.orderService.getOrdersByAccountId(userProfile.id);
        })
      )
      .subscribe((orders) => (this.orders = orders));
  }
}
