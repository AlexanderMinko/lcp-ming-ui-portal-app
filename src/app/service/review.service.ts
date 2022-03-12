import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Review, ReviewRequestDto } from '../model/models';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ReviewService {
  private baseUrl = 'http://localhost:8090/reviews';

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
