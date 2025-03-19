import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiResponse, Product } from '../../../core/models/product.model';
import { BaseService } from '../base.service';
import { TokenService } from '../token/token.service';

@Injectable({
  providedIn: 'root',
})
export class ProductService extends BaseService {
  constructor(
    protected override http: HttpClient,
    protected override tokenService: TokenService
  ) {
    super(http, tokenService);
  }

  getProducts(page: number, size: number): Observable<ApiResponse> {
    return this.http.get<ApiResponse>(
      `${this.apiBase}/all-products?page=${page}&size=${size}`,
      { headers: this.getHeaders() }
    );
  }

  createProduct(apiPath: string, data: Partial<Product>): Observable<Product> {
    return this.http.post<Product>(`${this.apiBase}/${apiPath}`, data, {
      headers: this.getHeaders(),
    });
  }

  updateProduct(
    apiPath: string,
    productId: number,
    data: Partial<Product>
  ): Observable<Product> {
    return this.http.put<Product>(
      `${this.apiBase}/${apiPath}/${productId}`,
      data,
      {
        headers: this.getHeaders(),
      }
    );
  }

  deleteProduct(productType: string, id: number): Observable<void> {
    const itemType = productType.toLowerCase();
    return this.http.delete<void>(`${this.apiBase}/${itemType}s/${id}`, {
      headers: this.getHeaders(),
    });
  }

  uploadImage(
    productId: number,
    file: File,
    apiPath: string
  ): Observable<{ imageUrl: string }> {
    const formData = new FormData();
    formData.append('image', file);
    return this.http.post<{ imageUrl: string }>(
      `${this.apiBase}/${apiPath}/${productId}/images`,
      formData,
      {
        headers: this.getHeaders(),
      }
    );
  }

  deleteImage(productType: string, fileName: string): Observable<void> {
    const itemType = productType.toLowerCase();
    return this.http.delete<void>(`${this.apiBase}/${itemType}s/images`, {
      body: { name: fileName },
      headers: this.getHeaders(),
    });
  }
}
