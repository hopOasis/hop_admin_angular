import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, map, of } from 'rxjs';
import { TokenService } from '../token/token.service';
import { environment } from '../../../../environments/environments';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly apiBase = environment.apiBase;

  constructor(private http: HttpClient, private tokenService: TokenService) {}

  login(email: string, password: string): Observable<{ access_token: string }> {
    return this.http.post<{ access_token: string }>(this.apiBase, { email, password });
  }

  validateToken(): Observable<boolean> {
    const token = this.tokenService.getToken();
    if (!token) {
      return of(false); 
    }

    return this.http.get(`${this.apiBase}/validate-token`).pipe(
      map(() => true), 
      catchError(() => of(false)) 
    );
  }
  
}

