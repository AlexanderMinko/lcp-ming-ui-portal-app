import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Category, Product } from '../model/models';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  private baseUrl = 'http://localhost:8090/products';

  constructor(private http: HttpClient) {}

  getProductBySearch(
    name: string | undefined,
    page: number,
    size: number
  ): Observable<ProductResponse> {
    return this.http.get<ProductResponse>(
      `${this.baseUrl}/search?name=${name}&page=${page}&size=${size}`
    );
  }

  getProducts(page: number, size: number): Observable<ProductResponse> {
    const params = new HttpParams().set('page', page).set('size', size);
    return this.http.get<ProductResponse>(`${this.baseUrl}`, { params });
  }

  getCategories(): Observable<Category[]> {
    return this.http.get<Category[]>(`${this.baseUrl}/categories`);
  }

  getProductsByCategory(
    id: number | undefined,
    page: number,
    size: number
  ): Observable<ProductResponse> {
    return this.http.get<ProductResponse>(
      `${this.baseUrl}/by-category?id=${id}&page=${page}&size=${size}`
    );
  }

  getProductById(id: string): Observable<Product> {
    return this.http.get<Product>(`${this.baseUrl}/${id}`);
  }

  getProductsSorterByPriceAsc(
    page: number,
    size: number
  ): Observable<ProductResponse> {
    return this.http.get<ProductResponse>(
      `${this.baseUrl}/by-price-asc?page=${page}&size=${size}`
    );
  }

  getProductsSorterByPriceDesc(
    page: number,
    size: number
  ): Observable<ProductResponse> {
    return this.http.get<ProductResponse>(
      `${this.baseUrl}/by-price-desc?page=${page}&size=${size}`
    );
  }

  getProductsSorterByName(
    page: number,
    size: number
  ): Observable<ProductResponse> {
    return this.http.get<ProductResponse>(
      `${this.baseUrl}/by-name?page=${page}&size=${size}`
    );
  }
}

export interface ProductResponse {
  content: Product[];
  totalElements: number;
}
