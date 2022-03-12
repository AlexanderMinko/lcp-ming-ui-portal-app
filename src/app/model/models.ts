export interface Product {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
  price: number;
  category: Category;
  producer: Producer;
}

export interface Category {
  id: string;
  name: string;
  count: number;
}

export interface Producer {
  id: string;
  name: string;
}

export class CartItem {
  id: string;
  name: string;
  imageUrl: string;
  description: string;
  price: number;
  quantity: number;

  constructor(product: Product) {
    this.id = product.id;
    this.name = product.name;
    this.imageUrl = product.imageUrl;
    this.description = product.description;
    this.price = product.price;
    this.quantity = 1;
  }
}

export interface ReviewRequestDto {
  content: string;
  accountId: string;
  productId: string;
  parentId: string | null;
}

export interface Review {
  id: string;
  content: string;
  duration: string;
  reviewerFirstName: string;
  reviewerLastName: string;
  reviewerPhotoUrl: string;
  childrenReviews: ChildrenReview[];
}

export interface ChildrenReview {
  id: string;
  content: string;
  duration: string;
  reviewerFirstName: string;
  reviewerLastName: string;
  reviewerPhotoUrl: string;
}

export class OrderItemRequestDto {
  count: number;
  productId: string;

  constructor(cartItem: CartItem) {
    this.count = cartItem.quantity;
    this.productId = cartItem.id;
  }
}

export interface OrderItemResponseDto {
  productId: number;
  name: string;
  imageUrl: string;
  description: string;
  price: number;
  count: number;
}

export interface OrderRequestDto {
  orderItemRequestsDto: OrderItemRequestDto[];
}

export interface OrderResponseDto {
  id: string;
  createdDate: Date;
}

export interface RegistrationRequest {
  username: string;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}
