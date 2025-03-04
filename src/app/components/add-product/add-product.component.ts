import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
  Product,
  Cider,
  Beer,
  Snack,
  SnackOptions,
} from '../../core/models/product.model';
import { ProductService } from '../../core/services/product/product.service';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatTableModule } from '@angular/material/table';
import { ProductEditorComponent } from '../product-editor/product-editor.component';

@Component({
  selector: 'app-add-product',
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
    ProductEditorComponent,
  ],
  templateUrl: './add-product.component.html',
  styleUrls: ['./add-product.component.scss'],
})
export class AddProductComponent {
  @Input() newProductId: number = 0;
  @Output() cancel = new EventEmitter<void>();
  constructor(private productService: ProductService) {}

  cancelEdit(): void {
    this.cancel.emit();
  }
  @Input() selectedProduct: Product | null = {
    id: 0,
    name: '',
    description: '',
    options: [
      {
        id: 0,
        price: 0,
        quantity: 0,
        volume: 0,
      },
    ],
    imageName: [],
    color: '',
    averageRating: 0,
    ratingCount: 0,
    specialOfferIds: [],
    itemType: '',
  };

  imagePreview: string | ArrayBuffer | null = null;
  selectedFile: File | null = null;

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
      console.error('Не обрано продукт');
      return;
    }

    let formData: Partial<Product> = {
      description: this.selectedProduct.description,
      options: this.selectedProduct.options.map((option) => ({
        quantity: option.quantity,
        price: option.price,
        volume: option.volume,
      })),
    };
    let apiPath = '';

    switch (this.selectedProduct.itemType.toLowerCase()) {
      case 'cider':
        (formData as Partial<Cider>).ciderName = this.selectedProduct.name;
        (formData as Partial<Cider>).cidreColor =
          this.selectedProduct.color?.toLocaleUpperCase();
        apiPath = 'ciders';
        break;
      case 'beer':
        (formData as Partial<Beer>).beerName = this.selectedProduct.name;
        (formData as Partial<Beer>).beerColor =
          this.selectedProduct.color?.toLocaleUpperCase();
        apiPath = 'beers';
        break;
      case 'snack':
        (formData as Partial<Snack>).snackName = this.selectedProduct.name;
        (formData as Partial<Snack>).options = this.selectedProduct.options.map(
          (option) => ({
            weight: option.measureValue,
            quantity: option.quantity,
            price: option.price,
          })
        ) as SnackOptions[];
        apiPath = 'snacks';
        break;
      default:
        console.error('Невідомий тип продукту:', this.selectedProduct);
        return;
    }

    console.log(formData);
    this.productService.createProduct(apiPath, formData).subscribe({
      next: (response) => {
        console.log('Продукт додано:', response);
        if (this.selectedFile) {
          console.log(response.id);
          this.productService
            .uploadImage(response!.id, this.selectedFile, apiPath)
            .subscribe({
              next: (imgResponse) => {
                console.log('Зображення завантажено:', imgResponse);
                if (imgResponse.imageUrl) {
                  this.selectedProduct!.imageName = [imgResponse.imageUrl];
                  this.selectedProduct!.imageName.unshift(imgResponse.imageUrl);
                  this.imagePreview = imgResponse.imageUrl;
                  this.selectedFile = null;
                }
                this.cancelEdit();
              },
              error: (error) =>
                console.error('Помилка завантаження зображення:', error),
            });
        } else {
          this.cancelEdit();
          console.error('Файл не вибрано, uploadImage не викликається');
        }
      },
      error: (error) => console.error('Помилка оновлення продукту:', error),
    });
  }

  deleteImg(id: number): void {
    if (
      this.selectedProduct &&
      this.selectedProduct.imageName &&
      this.selectedProduct.imageName[id]
    ) {
      this.productService
        .deleteImage(
          this.selectedProduct.itemType,
          this.selectedProduct.imageName[id]
        )
        .subscribe({});
    }
  }

  addOption() {
    if (!this.selectedProduct || this.selectedProduct.options.length >= 2) {
      return;
    }

    this.selectedProduct.options.push({
      id: this.selectedProduct.options.length,
      price: 0,
      quantity: 0,
      measureValue: this.selectedProduct.itemType === 'snack' ? 0 : undefined,
      volume: this.selectedProduct.itemType !== 'snack' ? 0 : undefined,
    });
  }
}
