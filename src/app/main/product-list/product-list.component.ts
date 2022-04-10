import { Component, OnInit } from '@angular/core';
import { CartItem, Product } from '../../model/models';
import { ProductResponse, ProductService } from '../../service/product.service';
import { ActivatedRoute } from '@angular/router';
import { CartService } from '../../service/cart.service';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.css'],
})
export class ProductListComponent implements OnInit {
  products: Product[] = [];
  page = 0;
  size = 12;
  totalElements = 0;
  isPageFullLoaded = false;
  isSearchMode = false;
  isLoggedChange = false;
  currentCategoryId: string;
  previousCategoryId: string;
  searchWord: string;
  previousSortedParam: string;

  constructor(
    private productService: ProductService,
    private activatedRoute: ActivatedRoute,
    private cartService: CartService
  ) {}

  ngOnInit(): void {
    this.activatedRoute.params.subscribe(() => {
      this.showListProducts();
    });
  }

  showListProducts(): void {
    const hasSearch: boolean =
      this.activatedRoute.snapshot.paramMap.has('name');
    const hasCategoryId: boolean =
      this.activatedRoute.snapshot.paramMap.has('id');
    const sortedParam = this.activatedRoute.snapshot.params.type;
    if (hasCategoryId) {
      this.showListProductsByCategory();
    } else if (hasSearch) {
      this.showListProductsBySearch();
    } else if (sortedParam) {
      this.showListProductsBySort();
    } else {
      this.showAllListProducts();
    }
  }

  showListProductsBySort(): void {
    const sortedParam = this.activatedRoute.snapshot.params.type;
    if (sortedParam !== this.previousSortedParam) {
      this.size = 12;
      this.isPageFullLoaded = false;
    }
    this.previousSortedParam = sortedParam;
    this.productService
      .getProductsSorted(this.page, this.size, sortedParam)
      .subscribe(this.proceedResult());
  }

  showListProductsBySearch(): void {
    this.searchWord = this.activatedRoute.snapshot.params.name;
    this.productService
      .searchProducts(this.page, this.size, this.searchWord)
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
      .getProductsByCategory(this.page, this.size, this.currentCategoryId)
      .subscribe(this.proceedResult());
  }

  showAllListProducts(): void {
    this.productService
      .getProducts(this.page, this.size)
      .subscribe(this.proceedResult());
  }

  onAddToCart(product: Product): void {
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
