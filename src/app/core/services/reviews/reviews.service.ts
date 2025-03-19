import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { BaseService } from '../base.service';
import { TokenService } from '../token/token.service';

@Injectable({
  providedIn: 'root',
})
export class ReviewsService extends BaseService {
  constructor(
    protected override http: HttpClient,
    protected override tokenService: TokenService
  ) {
    super(http, tokenService);
  }

  getAllReviews(): Observable<any> {
    return this.http.get(`${this.apiBase}/reviews`, {
      headers: this.getHeaders(),
    });
  }

  deleteReview(reviewId: number): Observable<any> {
    return this.http.delete(`${this.apiBase}/reviews/${reviewId}`, {
      headers: this.getHeaders(),
    });
  }
}
