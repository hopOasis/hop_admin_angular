import { Component, Input } from '@angular/core';
import { Beer, Cider, Product, Snack, SnackOptions } from '../../core/models/product.model';
import { ProductService } from '../../core/services/product/product.service';
import { FormsModule } from '@angular/forms';
import { MatSelectModule } from '@angular/material/select';
import { MatCardModule } from '@angular/material/card';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';


@Component({
  selector: 'app-product-editor',
  templateUrl: './product-editor.component.html',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    FormsModule,
    MatIconModule,
    MatInputModule,
    MatButtonModule,
    MatSelectModule,
    MatFormFieldModule,
    MatCardModule,
    ProductEditorComponent
  ],
  styleUrls: ['./product-editor.component.scss']
})
export class ProductEditorComponent {
  @Input() selectedProduct: Product | null = null;
  imagePreview: string | ArrayBuffer | null = null;
  selectedFile: File | null = null;

  constructor(private productService: ProductService) {}

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.selectedFile = input.files[0];
      const reader = new FileReader();
      reader.onload = () => {
        this.imagePreview = reader.result as string;
      };
      reader.readAsDataURL(this.selectedFile);
    }
  }

  saveProduct(): void {
    if (!this.selectedProduct) {
      console.error('Нет выбранного продукта');
      return;
    }

    let formData: Partial<Product> = {
      description: this.selectedProduct.description,
      options: this.selectedProduct.options.map(option => ({
        id: option.id,
        quantity: option.quantity,
        price: option.price,
        volume: option.volume
      }))
    };

    let apiPath = ''; 

    switch (this.selectedProduct.itemType.toLowerCase()) {
    case 'cider':
      (formData as Partial<Cider>).ciderName = this.selectedProduct.name;
      apiPath = 'ciders';
      break;
    case 'beer':
      (formData as Partial<Beer>).beerName = this.selectedProduct.name;
      apiPath = 'beers';
      break;
    case 'snack':
      (formData as Partial<Snack>).snackName = this.selectedProduct.name;
      (formData as Partial<Snack>).description = this.selectedProduct.description;
      (formData as Partial<Snack>).imageName = this.selectedProduct.imageName; // Не забудьте обновить
      (formData as Partial<Snack>).options = this.selectedProduct.options.map(option => ({
        id: option.id,
        weight: option.measureValue,
        quantity: option.quantity,
        price: option.price,
      })) as SnackOptions[];
      apiPath = 'snacks';
      break;
    default:
      console.error('Unknown product type:', this.selectedProduct.itemType);
      return;
    }

    this.productService.updateProduct(apiPath, this.selectedProduct.id, formData).subscribe({
      next: (response) => {
        console.log('Продукт обновлен:', response);
        this.cancelEdit();
            
        // Загружаем изображение только если есть файл
        if (this.selectedProduct && this.selectedFile) {
          this.productService.uploadImage(this.selectedProduct.id, this.selectedFile, apiPath).subscribe({
            next: (imgResponse) => {
              console.log('Изображение загружено:', imgResponse);
              if (imgResponse.imageUrl) {
                            // Замените старое изображение новым
                            this.selectedProduct!.imageName = [imgResponse.imageUrl]; // Замените массив
                            this.imagePreview = imgResponse.imageUrl; // Обновите предварительный просмотр
                            this.selectedFile = null; // Очистите выбранный файл
              }
            },
            error: (error) => console.error('Ошибка загрузки изображения:', error)
          });
        } else {
          console.error('Продукт или файл не выбран');
        }
      },
      error: (error) => console.error('Ошибка обновления продукта:', error)
    });
    this.cancelEdit();
  }

  deleteImg(id: number): void {
    if (this.selectedProduct && this.selectedProduct.imageName && this.selectedProduct.imageName[id]) {
      this.productService.deleteImage(this.selectedProduct.itemType, this.selectedProduct.imageName[id]).subscribe({
      });
    } 
  }

  cancelEdit(): void {
    this.selectedProduct = null;
  }
}
