import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import {Category, CreateProductParam, Producer, Product} from '../model/models';

const FORM_DATA_JSON = 'application/json';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  private baseUrl = 'http://localhost:8090/products';

  constructor(private http: HttpClient) {}

  getProducts(page: number, size: number): Observable<ProductResponse> {
    const params = new HttpParams().set('page', page).set('size', size);
    return this.http.get<ProductResponse>(`${this.baseUrl}`, { params });
  }

  getProductsByCategory(
    page: number,
    size: number,
    categoryId: string
  ): Observable<ProductResponse> {
    const params = new HttpParams()
      .set('page', page)
      .set('size', size)
      .set('category_id', categoryId);
    return this.http.get<ProductResponse>(`${this.baseUrl}`, { params });
  }

  searchProducts(
    page: number,
    size: number,
    freeText: string
  ): Observable<ProductResponse> {
    const params = new HttpParams()
      .set('page', page)
      .set('size', size)
      .set('free_text', freeText);
    return this.http.get<ProductResponse>(`${this.baseUrl}`, { params });
  }

  getCategories(): Observable<Category[]> {
    return this.http.get<Category[]>(`${this.baseUrl}/categories`);
  }

  getProducers(): Observable<Producer[]> {
    return this.http.get<Producer[]>(`${this.baseUrl}/producers`);
  }

  getProductById(id: string): Observable<Product> {
    return this.http.get<Product>(`${this.baseUrl}/${id}`);
  }

  getProductsSorted(
    page: number,
    size: number,
    sort: string
  ): Observable<ProductResponse> {
    const params = new HttpParams()
      .set('page', page)
      .set('size', size)
      .set('sort', sort);
    return this.http.get<ProductResponse>(`${this.baseUrl}`, { params });
  }

  createProduct(
    createProductParam: CreateProductParam,
    image: any
  ): Observable<void> {
    const formData = new FormData();
    formData.append(
      'createParamJson',
      new Blob([JSON.stringify(createProductParam)], { type: FORM_DATA_JSON })
    );
    formData.append('imageFile', image, image.name);
    return this.http.post<void>(`${this.baseUrl}`, formData);
  }
}

export interface ProductResponse {
  content: Product[];
  totalElements: number;
}
