import { Component, OnInit } from '@angular/core';
import { CartService } from '../../service/cart.service';

@Component({
  selector: 'app-cart-status',
  templateUrl: './cart-status.component.html',
  styleUrls: ['./cart-status.component.css'],
})
export class CartStatusComponent implements OnInit {
  totalPrice = 0;
  totalQuantity = 0;

  constructor(private cartService: CartService) {}

  ngOnInit(): void {
    this.totalPrice = this.cartService.totalPrice;
    this.totalQuantity = this.cartService.totalQuantity;
    this.updateCartStatus();
  }

  updateCartStatus(): void {
    this.cartService.totalPriceChange.subscribe(
      (data) => (this.totalPrice = data)
    );

    this.cartService.totalQuantityChange.subscribe(
      (data) => (this.totalQuantity = data)
    );
  }
}
