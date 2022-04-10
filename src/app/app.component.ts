import { AfterViewInit, Component, OnInit } from '@angular/core';
import { CartService } from './service/cart.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit, AfterViewInit {
  isProducts = false;

  constructor(private cartService: CartService, private router: Router) {}

  ngOnInit(): void {
    const router = this.router.url;
    console.log(router);
    if (router.startsWith('products')) {
      this.isProducts = true;
      console.log(this.isProducts);
    }
    this.cartService.checkStorage('cartItems');
  }

  ngAfterViewInit(): void {
    console.log('view');
  }
}
