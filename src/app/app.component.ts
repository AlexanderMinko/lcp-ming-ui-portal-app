import { Component, OnInit } from '@angular/core';
import { KeycloakService } from 'keycloak-angular';
import { CartService } from './service/cart.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  constructor(private cartService: CartService) {}

  ngOnInit(): void {
    this.cartService.checkStorage('cartItems');
  }
}
