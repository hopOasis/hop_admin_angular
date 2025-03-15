import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
// import { environment } from '../../../../environments/environments';
import { TokenService } from '../token/token.service';

@Injectable({
  providedIn: 'root',
})
export class OrdersService {
  // private readonly apiBase = environment.apiBase;
  private readonly apiBase = 'https://hopoasis.onrender.com'
  constructor(private http: HttpClient, private tokenService: TokenService) {}

  getOrders(): Observable<any[]> {
    const token = this.tokenService.getToken();
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });

    return this.http.get<any[]>(`${this.apiBase}/orders`, { headers });
  }

  changeOrderStatus(orderId: number, orderData: any): Observable<any> {
    const url = `https://hopoasis.onrender.com/orders/${orderId}`;
    const updatedOrder = {
      ...orderData,
    };
    const token = this.tokenService.getToken();
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    });
  
    return this.http.put(url, updatedOrder, { headers });
  }
  
}
