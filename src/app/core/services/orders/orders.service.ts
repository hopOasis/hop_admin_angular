import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { BaseService } from '../base.service';
import { TokenService } from '../token/token.service';

@Injectable({
  providedIn: 'root',
})
export class OrdersService extends BaseService {
  constructor(
    protected override http: HttpClient,
    protected override tokenService: TokenService
  ) {
    super(http, tokenService);
  }

  getOrders(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiBase}/orders`, {
      headers: this.getHeaders(),
    });
  }

  changeOrderStatus(orderId: number, orderData: any): Observable<any> {
    return this.http.put(`${this.apiBase}/orders/${orderId}`, orderData, {
      headers: this.getHeaders(),
    });
  }

  deleteOrder(orderId: number): Observable<void> {
    return this.http.delete<void>(`${this.apiBase}/orders/${orderId}`, {
      headers: this.getHeaders(),
    });
  }
}
