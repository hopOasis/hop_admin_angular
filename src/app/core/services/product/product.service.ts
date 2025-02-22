import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiResponse, Product } from '../../../core/models/product.model';  
import { TokenService } from '../token/token.service';
import { environment } from '../../../../environments/environments';


@Injectable({
  providedIn: 'root',
})
export class ProductService {
  private readonly apiBase = environment.apiBase;

  constructor(private http: HttpClient, private tokenService: TokenService) {}

  private getAuthHeaders(): HttpHeaders {
    return new HttpHeaders({
      Authorization: `Bearer ${this.tokenService.getToken()}`,
      'Content-Type': 'application/json',
    });
  }

  getProducts(page: number, size: number): Observable<ApiResponse> {
    return this.http.get<ApiResponse>(`${this.apiBase}/all-products?page=${page}&size=${size}`);
  }  

  createProduct(product: Product): Observable<Product> {
    return this.http.post<Product>(`${this.apiBase}/all-products`, product, {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
    });
  }

  updateProduct(apiPath: string, productId: number, data: Partial<Product>): Observable<Product> {
    return this.http.put<Product>(`${this.apiBase}/${apiPath}/${productId}`, data, {
      headers: this.getAuthHeaders(),
    });
  }

  deleteProduct(productType: string, id: number): Observable<void> {
    const itemType = productType.toLowerCase();
    return this.http.delete<void>(`${this.apiBase}/${itemType}s/${id}`, {
      headers: this.getAuthHeaders(),
    });
  }

  uploadImage(productId: number, file: File, apiPath: string): Observable<{ imageUrl: string }> {
    const formData = new FormData();
    formData.append('image', file);
    return this.http.post<{ imageUrl: string }>(
      `${this.apiBase}/${apiPath}/${productId}/images`,
      formData,
      { headers: new HttpHeaders({ Authorization: `Bearer ${this.tokenService.getToken()}` }) }
    );
  }

  deleteImage(productType: string, fileName: string): Observable<void> {
    const itemType = productType.toLowerCase();
    console.log(itemType, fileName);
    return this.http.delete<void>(`${this.apiBase}/${itemType}s/images`, {
      body: { name: fileName },
      headers: this.getAuthHeaders(),
    });
  }
}
