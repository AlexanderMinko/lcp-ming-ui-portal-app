import { AfterViewInit, Component, OnInit } from '@angular/core';
import { CartService } from './service/cart.service';
import { Router } from '@angular/router';

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
