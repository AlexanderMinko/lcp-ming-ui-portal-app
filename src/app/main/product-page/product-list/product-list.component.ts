import { Component, Input, OnInit } from '@angular/core';
import { CartItem, Product } from '../../../model/models';
import { ProductResponse, ProductService } from '../../../service/product.service';
import { ActivatedRoute } from '@angular/router';
import { CartService } from '../../../service/cart.service';
import { Environment } from '../../../../environments/environment';
import { IMAGE_BASE_URL } from '../../../constants';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.css'],
})
export class ProductListComponent implements OnInit {
  @Input() rawClass: string;
  selectedAttribute: string;
  selectedAttributeId: string;
  products: Product[] = [];
  page: number = 0;
  size: number = 12;
  totalElements = 0;
  isPageFullLoaded = false;
  isSearchMode = false;
  currentAttributeId: string;
  previousAttributeId: string;
  searchWord: string;
  previousSortedParam: string;
  bucketUrl = IMAGE_BASE_URL + '/ming';
  position: string;

  constructor(
    private productService: ProductService,
    private activatedRoute: ActivatedRoute,
    private cartService: CartService
  ) {
  }

  ngOnInit(): void {
    this.activatedRoute.params.subscribe(() => {
      this.showListProducts();
    });
    this.productService.productAddedSubject.subscribe(() => {
      this.showListProducts();
    });
    this.productService.productCategory$.subscribe((categoryId: string) => {
      this.selectedAttribute = 'category_id';
      this.selectedAttributeId = categoryId;
      this.showListProductsByAttribute();
    });
  }

  showListProducts(): void {
    const hasSearch: boolean = this.activatedRoute.snapshot.paramMap.has('name');
    const hasAttribute: boolean = this.activatedRoute.snapshot.paramMap.has('attribute');
    const sortedParam = this.activatedRoute.snapshot.params.type;
    if (hasAttribute) {
      this.showListProductsByAttribute();
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
    this.productService.getProductsSorted(this.page, this.size, sortedParam).subscribe(this.proceedResult());
  }

  showListProductsBySearch(): void {
    this.searchWord = this.activatedRoute.snapshot.params.name;
    this.productService.searchProducts(this.page, this.size, this.searchWord).subscribe(this.proceedResult());
  }

  showListProductsByAttribute(): void {
    let currentAttribute: string;
    if (this.selectedAttribute && this.selectedAttributeId) {
      currentAttribute = this.selectedAttribute;
      this.currentAttributeId = this.selectedAttributeId;
    } else {
      currentAttribute = this.activatedRoute.snapshot.params.attribute;
      this.currentAttributeId = this.activatedRoute.snapshot.params.id;
    }
    if (this.currentAttributeId !== this.previousAttributeId) {
      this.size = 12;
      this.isPageFullLoaded = false;
    }
    this.previousAttributeId = this.currentAttributeId;
    this.productService
      .getProductsByAttribute(this.page, this.size, currentAttribute, this.currentAttributeId)
      .subscribe(this.proceedResult());
  }

  showAllListProducts(): void {
    this.productService.getProducts(this.page, this.size).subscribe(this.proceedResult());
  }

  onAddToCart(product: Product): void {
    const cartItem: CartItem = new CartItem(product);
    this.cartService.addToCart(cartItem);
  }

  loadMore(): void {
    if (this.totalElements > this.size) {
      this.size += 12;
      this.showListProducts();
      if (this.totalElements <= this.size) {
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

  onActivate(): void {
    window.scroll({
      top: 0,
      left: 0,
      behavior: 'smooth',
    });
  }

}
