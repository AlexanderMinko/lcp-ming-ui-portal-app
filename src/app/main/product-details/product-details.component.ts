import { Component, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormControl,
  FormGroup,
} from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import {
  CartItem,
  Product,
  Review,
  ReviewRequestDto,
} from '../../model/models';
import { ProductService } from '../../service/product.service';
import { CartService } from '../../service/cart.service';
import { KeycloakService } from 'keycloak-angular';
import { AuthService } from '../../service/auth.service';
import Keycloak from 'keycloak-js';
import { filter, switchMap } from 'rxjs/operators';
import { ReviewService } from '../../service/review.service';

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

  constructor(
    private productService: ProductService,
    private activatedRoute: ActivatedRoute,
    private formBuilder: FormBuilder,
    private cartService: CartService,
    private keycloakService: KeycloakService,
    private authService: AuthService,
    private reviewService: ReviewService
  ) {}

  ngOnInit(): void {
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

    this.activatedRoute.params.subscribe(() => {
      this.productId = this.activatedRoute.snapshot.params.id;
      this.getProduct();
      this.getReviews();
    });
    this.reviewFormGroup = this.formBuilder.group({
      review: new FormControl(''),
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
    console.log(`Reply: ${reply}, id: ${id}`);
  }

  onViewReplies(id: string): void {
    if (this.currentViewReplies.includes(id)) {
      this.currentViewReplies = this.currentViewReplies.filter(
        (el) => el !== id
      );
    } else {
      this.currentViewReplies.push(id);
    }
    console.log(this.currentViewReplies);
  }

  onReplies(id: string): void {
    if (this.currentReplies.includes(id)) {
      this.currentReplies = this.currentReplies.filter((reply) => reply !== id);
    } else {
      this.currentReplies.push(id);
    }
    console.log(this.currentReplies);
  }

  getProduct(): void {
    this.productService.getProductById(this.productId).subscribe((product) => {
      this.product = product;
    });
  }

  getReviews(): void {
    this.reviewService
      .getReviewsByProductId(this.productId)
      .subscribe((reviews) => {
        this.reviews = reviews;
        console.log(reviews);
        reviews.forEach(el => console.log(!!el.childrenReviews));
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
}
