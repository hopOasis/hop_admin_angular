import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { ProductService } from '../../../core/services/product/product.service';
import { ApiResponse,  Product, } from '../../../core/models/product.model';
import { forkJoin } from 'rxjs';
import { FormsModule } from '@angular/forms';
import { MatSelectModule } from '@angular/material/select';
import { MatCardModule } from '@angular/material/card';
import { ProductEditorComponent } from '../../../components/product-editor/product-editor.component';


@Component({
  selector: 'app-product',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    FormsModule,
    MatIconModule,
    MatSelectModule,
    MatCardModule,
    ProductEditorComponent
],
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.scss']
})
export class ProductsComponent implements OnInit {
  imagePreview: string | ArrayBuffer | null = null;
  resultsLength = 0;  
  itemsPerPage = 10;  
  currentPage = 0;
  edit = false
  selectedFile: File | null = null;
  selectedProduct: Product | null = null;

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
    this.selectedProduct = { ...product };
    this.edit = true;
    console.log('Edit:', this.selectedProduct);
    this.imagePreview = product.imageName ? product.imageName[0] : null;
}



deleteProduct(productType: string, id: number): void {
  this.productService.deleteProduct(productType, id).subscribe(() => {
    console.log(`Продукт з ID ${id} типу ${productType} видалено`);
  });
}

addProduct() {
  console.log()
  }
}
