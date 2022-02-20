import { Component, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { CartItem, Product, Review } from '../../model/models';
import { ProductService } from '../../service/product.service';
import { CartService } from '../../service/cart.service';
import { KeycloakService } from 'keycloak-angular';

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
  isSubReviewsPresent = false;
  currentReplies: number[] = [];
  currentViewReplies: number[] = [];

  constructor(
    private productService: ProductService,
    private activatedRoute: ActivatedRoute,
    private formBuilder: FormBuilder,
    private cartService: CartService,
    private keycloakService: KeycloakService
  ) // private reviewService: ReviewService
  {}

  async ngOnInit(): Promise<void> {
    this.isLogged = await this.keycloakService.isLoggedIn();
    this.activatedRoute.params.subscribe(() => {
      this.productId = this.activatedRoute.snapshot.params.id;
      this.getProduct();
      // this.getReviews();
    });
    this.reviewFormGroup = this.formBuilder.group({
      review: new FormControl(''),
    });
  }

  get review() {
    return this.reviewFormGroup.get('review');
  }

  // onSubmitReply(reply: string, id: number) {
  //   const subReviewRequestDto: SubReviewRequestDto = new SubReviewRequestDto();
  //   subReviewRequestDto.email = this.authService.getAccount().email;
  //   subReviewRequestDto.subReview = reply;
  //   subReviewRequestDto.reviewId = id;
  //   this.reviewService.postSubReview(subReviewRequestDto)
  //     .subscribe(data => {
  //       console.log(data);
  //     }, error => {
  //       console.log(error);
  //     }, () => {
  //       this.getReviews();
  //     });
  // }

  onViewReplies(id: number) {
    if (this.currentViewReplies.includes(id)) {
      this.currentViewReplies = this.currentViewReplies.filter(
        (el) => el !== id
      );
    } else {
      this.currentViewReplies.push(id);
    }
    console.log(this.currentViewReplies);
  }

  onReplies(id: number) {
    if (this.currentReplies.includes(id)) {
      this.currentReplies = this.currentReplies.filter((el) => el !== id);
    } else {
      this.currentReplies.push(id);
    }
    console.log(this.currentReplies);
  }

  getProduct() {
    this.productService
      .getProductById(this.productId)
      .subscribe((data: Product) => {
        this.product = data;
      });
  }

  // getReviews() {
  //   this.reviewService.getReviewsByProductId(this.productId)
  //     .subscribe((data: Review[]) => {
  //       this.reviews = data;
  //     });
  // }

  onSubmit() {
    // const reviewRequestDto: ReviewRequestDto = new ReviewRequestDto();
    // reviewRequestDto.review = this.review.value;
    // reviewRequestDto.email = this.authService.getAccount().email;
    // reviewRequestDto.productId = this.productId;
    // this.reviewService.postReview(reviewRequestDto)
    //   .subscribe(data => {
    //     console.log(data);
    //     this.reviewFormGroup.reset();
    //   }, error => {
    //     console.log(error);
    //   }, () => {
    //     this.getReviews();
    //   });
  }

  onAddToCart() {
    const cartItem: CartItem = new CartItem(this.product);
    this.cartService.addToCart(cartItem);
  }
}
