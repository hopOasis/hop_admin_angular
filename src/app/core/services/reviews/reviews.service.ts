
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { TokenService } from '../token/token.service';
// import { environment } from '../../../../environments/environments';

@Injectable({
  providedIn: 'root'
})
export class ReviewsService {
//   private readonly apiBase = environment.apiBase;
  private readonly apiBase = 'https://hopoasis.onrender.com';

  constructor(private http: HttpClient,
    private tokenService: TokenService) {}

  getAllReviews(): Observable<any> {
    const headers = new HttpHeaders({
        Authorization: `Bearer ${this.tokenService.getToken()}`,
    });

    return this.http.get(`${this.apiBase}/reviews`, { headers });
  }

  deleteReview(reviewId: number): Observable<any> {
    const headers = new HttpHeaders({
        Authorization: `Bearer ${this.tokenService.getToken()}`,
    });
        return this.http.delete(`${this.apiBase}/reviews/${reviewId}`, { headers });
    }   
}
