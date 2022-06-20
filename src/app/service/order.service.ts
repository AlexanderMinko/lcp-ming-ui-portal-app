import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import {
  OrderItemResponseDto,
  OrderRequestDto,
  OrderResponseDto,
} from '../model/models';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class OrderService {
  private readonly baseUrl = 'http://localhost:8091/orders';

  constructor(private http: HttpClient) {}

  makeOrder(orderRequestDto: OrderRequestDto): Observable<string> {
    return this.http.post(`${this.baseUrl}/make`, orderRequestDto, {
      responseType: 'text'
    });
  }

  getOrdersByEmail(email: string | undefined): Observable<OrderResponseDto[]> {
    return this.http.get<OrderResponseDto[]>(`${this.baseUrl}?email=${email}`);
  }

  getOrderItemByOrderId(id: number): Observable<OrderItemResponseDto[]> {
    return this.http.get<OrderItemResponseDto[]>(`${this.baseUrl}/${id}/items`);
  }
}
