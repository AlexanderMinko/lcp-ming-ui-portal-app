import { Component, OnInit } from '@angular/core';
import { CartItem, Product } from '../../model/models';
import {ProductResponse, ProductService} from '../../service/product.service';
import { ActivatedRoute } from '@angular/router';
import { CartService } from '../../service/cart.service';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.css'],
})
export class ProductListComponent implements OnInit {
  products: Product[] = [];
  page = 1;
  size = 12;
  totalElements = 0;
  isPageFullLoaded = false;
  isSearchMode = false;
  isLoggedChange = false;

  currentCategoryId: number;
  previousCategoryId: number;

  searchWord: string;

  previousSortedParam: string;

  constructor(
    private productService: ProductService,
    private activatedRoute: ActivatedRoute,
    private cartService: CartService
  ) {}

  ngOnInit(): void {
    // this.authService.isLoggedChange.subscribe((data: boolean) => {
    //   this.isLoggedChange = data;
    // });
    this.activatedRoute.params.subscribe(() => {
      this.showListProducts();
    });
  }

  // tslint:disable-next-line:typedef
  showListProducts() {
    const hasSearch: boolean =
      this.activatedRoute.snapshot.paramMap.has('name');
    const hasCategoryId: boolean =
      this.activatedRoute.snapshot.paramMap.has('id');
    if (hasCategoryId) {
      this.showListProductsByCategory();
    } else if (hasSearch) {
      this.showListProductsBySearch();
    } else {
      this.showListProductsBySort();
    }
  }

  showListProductsBySort(): void {
    const sortedParam = this.activatedRoute.snapshot.params.type;
    if (sortedParam !== this.previousSortedParam) {
      this.size = 12;
      this.isPageFullLoaded = false;
    }
    this.previousSortedParam = sortedParam;
    switch (sortedParam) {
      case 'from-cheap-to-expensive':
        this.productService
          .getProductsSorterByPriceAsc(this.page, this.size)
          .subscribe(this.proceedResult());
        break;
      case 'from-expensive-to-cheap':
        this.productService
          .getProductsSorterByPriceDesc(this.page, this.size)
          .subscribe(this.proceedResult());
        break;
      case 'by-name':
        this.productService
          .getProductsSorterByName(this.page, this.size)
          .subscribe(this.proceedResult());
        break;
      default:
        this.showAllListProducts();
    }
  }

  showListProductsBySearch(): void {
    this.searchWord = this.activatedRoute.snapshot.params.name;
    this.productService
      .getProductBySearch(this.searchWord, this.page, this.size)
      .subscribe(this.proceedResult());
  }

  showListProductsByCategory(): void {
    this.currentCategoryId = this.activatedRoute.snapshot.params.id;
    if (this.currentCategoryId !== this.previousCategoryId) {
      this.size = 12;
      this.isPageFullLoaded = false;
    }
    this.previousCategoryId = this.currentCategoryId;
    this.productService
      .getProductsByCategory(this.currentCategoryId, this.page, this.size)
      .subscribe(this.proceedResult());
  }

  showAllListProducts(): void {
    this.productService
      .getProducts(this.page, this.size)
      .subscribe(this.proceedResult());
  }

  onAddToCart(product: Product): void {
    console.log(product);
    const cartItem: CartItem = new CartItem(product);
    this.cartService.addToCart(cartItem);
  }

  loadMore(): void {
    if (this.totalElements > this.size) {
      this.size += 12;
      this.showListProducts();
      if (this.totalElements < this.size) {
        this.isPageFullLoaded = true;
      }
    }
  }

  private proceedResult(): (data: ProductResponse) => void {
    return (data: ProductResponse) => {
      this.products = data.content;
      this.totalElements = data.totalElements;
    };
  }
}
