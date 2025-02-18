import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { ProductService } from '../../../core/services/product/product.service';
import { ApiResponse, Product } from '../../../core/models/product.model';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-product',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
  ],
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.scss']
})
export class ProductsComponent implements OnInit {
  resultsLength = 0;  
  itemsPerPage = 10;  
  currentPage = 0;   

  displayedColumns: string[] = ['name', 'description', 'imageName', 'itemType', 'options', 'actions'];

  products: Product[] = [];
  filteredProducts: Product[] = [];

  constructor(private productService: ProductService) {}

  ngOnInit(): void {
    this.getAllProducts();  
  }

  getAllProducts(): void {
    this.productService.getProducts(0, 10).subscribe((data: ApiResponse) => {
      const totalPages = data.totalPages;
      const requests = [];
  
      for (let i = 0; i < totalPages; i++) {
        requests.push(this.productService.getProducts(i, 10));
      }
  
      forkJoin(requests).subscribe((responses) => {
        this.products = responses.flatMap(res => res.content);
        this.filteredProducts = [...this.products];
      });
    });
  }


  Filter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value.trim().toLowerCase();  
    this.filteredProducts = this.products.filter(product =>
      product.name.toLowerCase().includes(filterValue)  
    );
  }

  editProduct(product: Product): void {
    console.log('Edit:', product);
  }

  deleteProduct(product: Product): void {
    this.products = this.products.filter(p => p !== product);
    this.filteredProducts = [...this.products];
  }
}
