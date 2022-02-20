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

export class OrderItemRequestDto {
  count: number;
  productId: string;

  constructor(cartItem: CartItem) {
    this.count = cartItem.quantity;
    this.productId = cartItem.id;
  }
}

export interface Review {
  id: string;
  review: string;
  duration: string;
  countOfSubReview: number;
  reviewerFirstName: string;
  reviewerLastName: string;
  reviewerPhotoUrl: string;
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
  id: number;
  createdDate: Date;
}
