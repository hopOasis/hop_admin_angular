import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { TokenService } from './token/token.service';
import { environment } from '../../../environments/environments';

@Injectable({
  providedIn: 'root',
})
export class BaseService {
  protected apiBase = environment.apiBase;

  constructor(
    protected http: HttpClient,
    protected tokenService: TokenService
  ) {}

  protected getHeaders(): HttpHeaders {
    return new HttpHeaders({
      Authorization: `Bearer ${this.tokenService.getToken()}`,
      'Content-Type': 'application/json',
    });
  }
}
