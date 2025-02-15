import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, map, of } from 'rxjs';
import { TokenService } from '../token/token.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private API_URL = 'https://hopoasis.onrender.com/auth/login'; 

  constructor(private http: HttpClient, private tokenService: TokenService) {}

  login(email: string, password: string): Observable<{ access_token: string }> {
    return this.http.post<{ access_token: string }>(this.API_URL, { email, password });
  }

  validateToken(): Observable<boolean> {
    const token = this.tokenService.getToken();
    if (!token) {
      return of(false); 
    }

    return this.http.get(`${this.API_URL}/validate-token`).pipe(
      map(() => true), 
      catchError(() => of(false)) 
    );
  }
  
}

