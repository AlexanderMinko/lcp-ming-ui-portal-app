import { Component, OnInit } from '@angular/core';
import {
  CartItem,
  OrderItemRequestDto,
  OrderRequestDto,
} from '../../model/models';
import { CartService } from '../../service/cart.service';
import { OrderService } from '../../service/order.service';
import { Router } from '@angular/router';
import { AuthService } from '../../service/auth.service';

@Component({
  selector: 'app-cart-details',
  templateUrl: './cart-details.component.html',
  styleUrls: ['./cart-details.component.css'],
})
export class CartDetailsComponent implements OnInit {
  isLogged = false;
  cartItems: CartItem[] = [];
  totalPrice = 0;
  totalQuantity = 0;

  imageBaseUrl = 'http://localhost:9000/ming';

  constructor(
    private cartService: CartService,
    private authService: AuthService,
    private orderService: OrderService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.authService
      .isLoggedIn()
      .subscribe((isLogged) => (this.isLogged = isLogged));
    this.cartItems = this.cartService.cartItems;
    this.totalPrice = this.cartService.totalPrice;
    this.totalQuantity = this.cartService.totalQuantity;
    this.updateCartStatus();
  }

  onMakeOrder(): void {
    const cartItems = this.cartItems.map((el) => new OrderItemRequestDto(el));
    const orderRequestDto = {
      orderItemRequestsDto: cartItems,
    } as OrderRequestDto;
    this.orderService.makeOrder(orderRequestDto).subscribe((data) => {
      this.cartService.clearStorage('cartItems');
      this.router.navigate(['/order-details', data]);
    });
  }

  onIncrease(cartItem: CartItem): void {
    this.cartService.addToCart(cartItem);
  }

  onDecrease(cartItem: CartItem): void {
    this.cartService.decreaseQuantity(cartItem);
  }

  onRemove(cartItem: CartItem): void {
    this.cartService.removeFromCart(cartItem);
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
