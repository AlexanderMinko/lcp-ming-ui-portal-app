import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { OrderItemResponseDto, CreateOrderParam, Order } from '../model/models';
import { Observable } from 'rxjs';
import { Environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class OrderService {
  private readonly apiUrl = Environment.production ? Environment.apiUrl : Environment.orderServiceUrl;
  private readonly baseUrl = this.apiUrl + '/order-service/orders';
  constructor(private http: HttpClient) {}

  makeOrder(orderRequestDto: CreateOrderParam): Observable<string> {
    return this.http.post(`${this.baseUrl}/make`, orderRequestDto, {
      responseType: 'text',
    });
  }

  getOrdersByAccountId(accountId: string | undefined): Observable<Order[]> {
    return this.http.get<Order[]>(`${this.baseUrl}?account_id=${accountId}`);
  }

  getOrderItemByOrderId(id: number): Observable<OrderItemResponseDto[]> {
    return this.http.get<OrderItemResponseDto[]>(`${this.baseUrl}/${id}/items`);
  }
}
