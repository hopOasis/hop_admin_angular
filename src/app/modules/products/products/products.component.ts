import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { ProductService } from '../../../core/services/product/product.service';
import { ApiResponse, Product } from '../../../core/models/product.model';

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
  constructor(private productService: ProductService) {}

  displayedColumns: string[] = ['name', 'description', 'imageName', 'itemType', 'options', 'actions'];

  products: Product[] = [];
  filteredProducts: Product[] = [];

  ngOnInit(): void {
    this.getProducts();
  }

  getProducts() {
    this.productService.getProducts().subscribe(
      (data: ApiResponse) => { 
        console.log(data)
        this.products = data.content; 
        this.filteredProducts = [...this.products];
      },
      (error) => {
        console.error(error);
      }
    );
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value.trim().toLowerCase(); 
    this.filteredProducts = this.products.filter(product =>
      product.name.toLowerCase().includes(filterValue)
    );
  }
  

  editProduct(product: Product) {
    console.log('Edit:', product);
  }

  deleteProduct(product: Product) {
    this.products = this.products.filter(p => p !== product);
    this.filteredProducts = [...this.products];
  }
}
