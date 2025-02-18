import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiResponse } from '../../../core/models/product.model';  
@Injectable({
  providedIn: 'root',
})
export class ProductService {
  private apiUrl = 'https://hopoasis.onrender.com/all-products'; 

  constructor(private http: HttpClient) {}

  getProducts(page: number, size: number): Observable<ApiResponse> {
    return this.http.get<ApiResponse>(`${this.apiUrl}?page=${page}&size=${size}`);
  }  
}
