import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable, Subject } from 'rxjs';
import {
  Category,
  CreateCategoryParam,
  CreateProducerParam,
  CreateProductParam,
  Producer,
  Product,
  RemoveVideoParam,
  UpdateProductParam,
} from '../model/models';
import { Environment } from '../../environments/environment';

const FORM_DATA_JSON = 'application/json';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  private readonly apiUrl = Environment.production ? Environment.apiUrl : Environment.productServiceUrl;
  private readonly baseUrl = this.apiUrl + '/product-service/products';
  private readonly categoriesBaseUrl = this.apiUrl + '/product-service/categories';
  private readonly producersBaseUrl = this.apiUrl + '/product-service/producers';

  public productAddedSubject = new Subject<Product>();
  public productEditedSubject = new Subject<Product>();
  public categoryAddedSubject = new Subject<Category>();
  public producerAddedSubject = new Subject<Producer>();
  public productCategory$ = new Subject<string>();

  constructor(private http: HttpClient) {}

  getProducts(page: number, size: number): Observable<ProductResponse> {
    const params = new HttpParams().set('page', page).set('size', size);
    return this.http.get<ProductResponse>(`${this.baseUrl}`, { params });
  }

  getProductsByAttribute(
    page: number,
    size: number,
    attributeType: string,
    attributeId: string
  ): Observable<ProductResponse> {
    const params = new HttpParams().set('page', page).set('size', size).set(attributeType, attributeId);
    return this.http.get<ProductResponse>(`${this.baseUrl}`, { params });
  }

  searchProducts(page: number, size: number, freeText: string): Observable<ProductResponse> {
    const params = new HttpParams().set('page', page).set('size', size).set('free_text', freeText);
    return this.http.get<ProductResponse>(`${this.baseUrl}`, { params });
  }

  getProductById(id: string): Observable<Product> {
    return this.http.get<Product>(`${this.baseUrl}/${id}`);
  }

  getProductsSorted(page: number, size: number, sort: string): Observable<ProductResponse> {
    const params = new HttpParams().set('page', page).set('size', size).set('sort', sort);
    return this.http.get<ProductResponse>(`${this.baseUrl}`, { params });
  }

  createProduct(createProductParam: CreateProductParam, image: File): Observable<Product> {
    const formData = new FormData();
    formData.append('createParamJson', new Blob([JSON.stringify(createProductParam)], { type: FORM_DATA_JSON }));
    formData.append('imageFile', image, image.name);
    return this.http.post<Product>(`${this.baseUrl}`, formData);
  }

  updateProduct(updateProductParam: UpdateProductParam, image: File): Observable<Product> {
    const formData = new FormData();
    formData.append('createParamJson', new Blob([JSON.stringify(updateProductParam)], { type: FORM_DATA_JSON }));
    if (image) {
      formData.append('imageFile', image, image.name);
    }
    return this.http.patch<Product>(`${this.baseUrl}`, formData);
  }

  deleteProduct(productId: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${productId}`);
  }

  uploadProductVideos(id: string, files: File[]): Observable<void> {
    const formData = new FormData();
    Array.from(files).forEach((file) => {
      formData.append('videoFile', file, file.name);
    });
    return this.http.post<void>(`${this.baseUrl}/${id}/videos`, formData);
  }

  uploadProductVideo(id: string, file: File): Observable<void> {
    const formData = new FormData();
    formData.append('videoFile', file, file.name);
    return this.http.post<void>(`${this.baseUrl}/${id}/video`, formData);
  }

  removeVideo(removeVideoParam: RemoveVideoParam): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${removeVideoParam.productId}/video/${removeVideoParam.videoName}`);
  }

  getCategories(): Observable<Category[]> {
    return this.http.get<Category[]>(`${this.categoriesBaseUrl}`);
  }

  createCategory(createCategoryParam: CreateCategoryParam): Observable<Category> {
    return this.http.post<Category>(`${this.categoriesBaseUrl}`, createCategoryParam);
  }

  getProducers(): Observable<Producer[]> {
    return this.http.get<Producer[]>(`${this.producersBaseUrl}`);
  }

  createProducer(createProducerParam: CreateProducerParam): Observable<Producer> {
    return this.http.post<Producer>(`${this.producersBaseUrl}`, createProducerParam);
  }
}

export interface ProductResponse {
  content: Product[];
  totalElements: number;
}
