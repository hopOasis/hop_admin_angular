import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiResponse, Product } from '../../../core/models/product.model';  
import { TokenService } from '../token/token.service';
@Injectable({
  providedIn: 'root',
})
export class ProductService {
  private apiUrl = 'https://hopoasis.onrender.com/all-products';
  private apiUpdate = 'https://hopoasis.onrender.com'
  private delet ='https://hopoasis.onrender.com/ciders'

  constructor(private http: HttpClient, private tokenService: TokenService) {}

  getProducts(page: number, size: number): Observable<ApiResponse> {
    return this.http.get<ApiResponse>(`${this.apiUrl}?page=${page}&size=${size}`);
  }  
  getAllProducts(product: Product): Observable<Product> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.post<Product>(this.apiUrl, product, { headers });
  }
  updateProduct(apiPath: string, productId: number, data: Partial<Product>): Observable<Product> {
    const headers = new HttpHeaders({
          Authorization: `Bearer ${this.tokenService.getToken()}`, 'Content-Type': 'application/json'
        });
    return this.http.put<Product>(`${this.apiUpdate}/${apiPath}/${productId}`, data, {headers});
}
  deleteProduct(id: number): Observable<void> {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.tokenService.getToken()}`, 'Content-Type': 'application/json'
    });
    return this.http.delete<void>(`${this.delet}/${id}`, {headers});
  }
  uploadImage(productId: number, file: File, apiPath: string): Observable<{ imageUrl: string }> {
    const formData = new FormData();
    formData.append('image', file);

    const headers = new HttpHeaders({
        Authorization: `Bearer ${this.tokenService.getToken()}`
    });

    return this.http.post<{ imageUrl: string }>(`${this.apiUpdate}/${apiPath}/${productId}/images`, formData, { headers });
  }
  deleteImage(productType: string, fileName: string) {
    const itemType = productType.toLowerCase();
    const headers = new HttpHeaders({
        Authorization: `Bearer ${this.tokenService.getToken()}`
    });
    console.log(itemType, fileName)
    return this.http.delete(`${this.apiUpdate}/${itemType}s/images`, {
        body: { name: fileName },
        headers: headers 
      });
  }


}
