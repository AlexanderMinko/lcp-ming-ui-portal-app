import { Component, OnInit } from '@angular/core';
import { CartService } from './service/cart.service';
import { Environment } from '../environments/environment';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  constructor(private cartService: CartService) {}
  testUrl = Environment.keycloakUrl;

  ngOnInit(): void {
    this.cartService.checkStorage('cartItems');
  }
}
