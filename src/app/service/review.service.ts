import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Review, ReviewRequestDto } from '../model/models';
import { Observable } from 'rxjs';
import { Environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ReviewService {
  private readonly apiUrl = Environment.production ? Environment.apiUrl : Environment.productServiceUrl;
  private baseUrl = this.apiUrl + '/product-service/reviews';

  constructor(private http: HttpClient) {}

  postReview(reviewRequestDto: ReviewRequestDto): Observable<string> {
    return this.http.post(`${this.baseUrl}`, reviewRequestDto, {
      responseType: 'text',
    });
  }

  getReviewsByProductId(id: string): Observable<Review[]> {
    return this.http.get<Review[]>(`${this.baseUrl}/product/${id}`);
  }
}
