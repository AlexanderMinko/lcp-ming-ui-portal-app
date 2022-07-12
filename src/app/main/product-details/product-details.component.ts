import { Component, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { CartItem, Product, RemoveVideoParam, Review, ReviewRequestDto } from '../../model/models';
import { ProductResponse, ProductService } from '../../service/product.service';
import { CartService } from '../../service/cart.service';
import { KeycloakService } from 'keycloak-angular';
import { AuthService } from '../../service/auth.service';
import Keycloak from 'keycloak-js';
import { filter, switchMap } from 'rxjs/operators';
import { ReviewService } from '../../service/review.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { EditProductComponent } from './edit-product/edit-product.component';

@Component({
  selector: 'app-product-details',
  templateUrl: './product-details.component.html',
  styleUrls: ['./product-details.component.css'],
})
export class ProductDetailsComponent implements OnInit {
  reviews: Review[] = [];
  reviewFormGroup: FormGroup;
  product: Product;
  productId: string;
  isLogged = false;
  currentReplies: string[] = [];
  currentViewReplies: string[] = [];
  userProfile: Keycloak.KeycloakProfile;
  uploadProductVideos: FormGroup;
  imageBaseUrl = 'http://localhost:9000/ming';
  isLcpAdmin: boolean;

  products: Product[] = [];
  page = 0;
  size = 12;
  totalElements = 0;
  isPageFullLoaded = false;

  constructor(
    private productService: ProductService,
    private activatedRoute: ActivatedRoute,
    private formBuilder: FormBuilder,
    private cartService: CartService,
    private keycloakService: KeycloakService,
    public authService: AuthService,
    private reviewService: ReviewService,
    private modalService: NgbModal
  ) {}

  ngOnInit(): void {
    this.initUserProfile();
    this.initProductInfo();
    this.initReviewForm();
    this.initProductVideosForm();
    this.showAllListProducts();
    this.isLcpAdmin = this.authService.isLcpAdmin();
  }

  showAllListProducts(): void {
    this.productService.getProducts(this.page, this.size).subscribe(this.proceedResult());
  }

  private proceedResult(): (data: ProductResponse) => void {
    return (data: ProductResponse) => {
      this.products = data.content;
      this.totalElements = data.totalElements;
    };
  }

  private initProductVideosForm(): void {
    this.uploadProductVideos = this.formBuilder.group({
      videos: new FormControl(null),
    });
  }

  private initProductInfo(): void {
    this.activatedRoute.params.subscribe(() => {
      this.productId = this.activatedRoute.snapshot.params.id;
      this.getProduct();
      this.getReviews();
    });
  }

  private initReviewForm(): void {
    this.reviewFormGroup = this.formBuilder.group({
      review: new FormControl(''),
    });
  }

  private initUserProfile(): void {
    this.authService
      .isLoggedIn()
      .pipe(
        filter((isLogged: boolean) => isLogged),
        switchMap((isLogged: boolean) => {
          this.isLogged = isLogged;
          return this.authService.loadUserProfile();
        })
      )
      .subscribe((profile) => {
        this.userProfile = profile;
      });
  }

  get review(): AbstractControl {
    return this.reviewFormGroup.controls.review;
  }

  onSubmitReply(reply: string, id: string): void {
    const reviewRequestDto = {
      content: reply,
      accountId: this.userProfile.id,
      productId: this.product.id,
      parentId: id,
    } as ReviewRequestDto;
    this.reviewService.postReview(reviewRequestDto).subscribe(
      () => {
        this.reviewFormGroup.reset();
      },
      (error) => {
        console.log(error);
      },
      () => {
        this.getReviews();
      }
    );
  }

  onViewReplies(id: string): void {
    if (this.currentViewReplies.includes(id)) {
      this.currentViewReplies = this.currentViewReplies.filter((el) => el !== id);
    } else {
      this.currentViewReplies.push(id);
    }
  }

  onReplies(id: string): void {
    if (this.currentReplies.includes(id)) {
      this.currentReplies = this.currentReplies.filter((reply) => reply !== id);
    } else {
      this.currentReplies.push(id);
    }
  }

  getProduct(): void {
    this.productService.getProductById(this.productId).subscribe((product) => {
      this.product = product;
      this.product.imageUrl = this.imageBaseUrl + this.product.imageUrl;
    });
  }

  getReviews(): void {
    this.reviewService.getReviewsByProductId(this.productId).subscribe((reviews) => {
      this.reviews = reviews;
    });
  }

  onSubmit(): void {
    const reviewRequestDto = {
      content: this.review.value,
      accountId: this.userProfile.id,
      productId: this.product.id,
      parentId: null,
    } as ReviewRequestDto;
    this.reviewService.postReview(reviewRequestDto).subscribe(
      () => {
        this.reviewFormGroup.reset();
      },
      (error) => {
        console.log(error);
      },
      () => {
        this.getReviews();
      }
    );
  }

  onAddToCart(): void {
    const cartItem: CartItem = new CartItem(this.product);
    this.cartService.addToCart(cartItem);
  }

  onOpenEditProductModal(): void {
    this.modalService.open(EditProductComponent, {
      size: 'lg',
      windowClass: 'modal-holder',
    });
  }

  get videos(): AbstractControl | null {
    return this.uploadProductVideos.get('videos');
  }

  onSubmitVideosForm(): void {
    console.log(this.videos?.value);
    const files = this.videos?.value as File[];
    Array.from(files).forEach((file) => {
      this.productService.uploadProductVideo(this.productId, file).subscribe(() => {
        console.log(`file: ${file.name} uploaded`);
        this.getProduct();
      });
    });
    // this.productService.uploadProductVideos(this.productId, this.videos?.value as File[])
    //   .subscribe(() => {
    //     console.log('published');
    //   });
  }

  onFileChanged(event): void {
    const files = event.target.files;
    this.uploadProductVideos.patchValue({
      videos: files,
    });
  }

  onRemove(id: string, name: string): void {
    const removeVideoParam = {
      productId: id,
      videoName: name,
    } as RemoveVideoParam;
    this.productService.removeVideo(removeVideoParam).subscribe({ next: () => this.getProduct() });
  }

  loadMore(): void {
    if (this.totalElements > this.size) {
      this.size += 12;
      this.showAllListProducts();
      if (this.totalElements < this.size) {
        this.isPageFullLoaded = true;
      }
    }
  }
}
