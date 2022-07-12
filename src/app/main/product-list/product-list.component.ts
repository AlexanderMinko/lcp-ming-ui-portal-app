import { Component, OnInit } from '@angular/core';
import { CartItem, Product } from '../../model/models';
import { ProductResponse, ProductService } from '../../service/product.service';
import { ActivatedRoute } from '@angular/router';
import { CartService } from '../../service/cart.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AddProductComponent } from './product-bar/add-product/add-product.component';
import { AddCategoryComponent } from './product-bar/add-category/add-category.component';
import { AuthService } from '../../service/auth.service';
import { AddProducerComponent } from './product-bar/add-producer/add-producer.component';

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
  currentAttributeId: string;
  previousAttributeId: string;
  searchWord: string;
  previousSortedParam: string;
  isLcpAdmin: boolean;

  imageBaseUrl = 'http://localhost:9000/ming';

  constructor(
    private productService: ProductService,
    private activatedRoute: ActivatedRoute,
    private cartService: CartService,
    private modalService: NgbModal,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.activatedRoute.params.subscribe(() => {
      this.showListProducts();
    });
    this.productService.productAddedSubject.subscribe(() => {
      this.showListProducts();
    });
    this.isLcpAdmin = this.authService.isLcpAdmin();
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
    const currentAttribute = this.activatedRoute.snapshot.params.attribute;
    this.currentAttributeId = this.activatedRoute.snapshot.params.id;
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

  onOpenAddProductModal(): void {
    const modalRef = this.modalService.open(AddProductComponent, {
      size: 'lg',
      windowClass: 'modal-holder',
    });
    modalRef.componentInstance.test = {message: 'text'};
  }

  onOpenAddCategoryModal(): void {
    this.modalService.open(AddCategoryComponent, {
      size: 'lg',
      windowClass: 'modal-holder',
    });
  }

  onOpenAddProducerModal(): void {
    this.modalService.open(AddProducerComponent, {
      size: 'lg',
      windowClass: 'modal-holder',
    });
  }
}
