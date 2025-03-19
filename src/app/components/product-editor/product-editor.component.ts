import { Component, Input, OnDestroy } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import {
  Beer,
  Cider,
  Product,
  Snack,
  SnackOptions,
  Option,
} from '../../core/models/product.model';
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
import { NgIf } from '@angular/common';

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
    MatSelectModule,
    MatCardModule,
    NgIf,
  ],
  styleUrls: ['./product-editor.component.scss'],
})
export class ProductEditorComponent implements OnDestroy {
  @Input() selectedProduct: Product | null = null;
  imagePreview: string | ArrayBuffer | null = null;
  selectedFile: File | null = null;
  private destroy$ = new Subject<void>();

  constructor(private productService: ProductService) {}

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files?.length) {
      this.selectedFile = input.files[0];
      const reader = new FileReader();
      reader.onload = () => {
        this.imagePreview = reader.result;
      };
      reader.readAsDataURL(this.selectedFile);
    }
  }

  saveProduct(): void {
    if (!this.selectedProduct?.id) {
      console.error('Продукт не вибрано або відсутній ID');
      return;
    }

    let formData: Partial<Product>;
    const apiPath = this.getApiPath(this.selectedProduct.itemType);

    try {
      formData = this.buildFormData();
    } catch (error) {
      console.error(error);
      return;
    }

    this.productService
      .updateProduct(apiPath, this.selectedProduct.id, formData)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          console.log(formData);
          console.log('Продукт оновлено:', response);
          this.handleImageUpload(apiPath);
        },
        error: (error) => console.error('Помилка оновлення продукту:', error),
      });
  }

  private buildFormData(): Partial<Product> {
    if (!this.selectedProduct) throw new Error('Продукт не вибрано');

    const baseFormData: Partial<Product> = {
      description: this.selectedProduct.description,
      options: this.selectedProduct.options.map((option) => ({
        id: option.id,
        quantity: Math.max(0, option.quantity),
        price: Math.max(0, option.price),
        volume: option.volume ? Math.max(0, option.volume) : undefined,
      })),
    };

    switch (this.selectedProduct.itemType.toLowerCase()) {
      case 'cider':
        return {
          ...baseFormData,
          name: this.selectedProduct.name,
          ciderImageName: this.selectedProduct.imageName[0],
        } as Partial<Cider>;

      case 'beer':
        return {
          ...baseFormData,
          name: this.selectedProduct.name,
          beerImageName: this.selectedProduct.imageName[0],
        } as Partial<Beer>;

      case 'snack':
        return {
          ...baseFormData,
          name: this.selectedProduct.name,
          snackImageName: this.selectedProduct.imageName[0],
          options: this.selectedProduct.options.map((option) => ({
            id: option.id,
            weight: Math.max(0, option.measureValue ?? 0),
            quantity: Math.max(0, option.quantity),
            price: Math.max(0, option.price),
          })) as SnackOptions[],
        } as Partial<Snack>;

      default:
        throw new Error('Невідомий тип продукту');
    }
  }

  private handleImageUpload(apiPath: string): void {
    if (!this.selectedFile || !this.selectedProduct?.id) {
      console.log('Файл не вибрано');
      this.cancelEdit();
      return;
    }

    this.productService
      .uploadImage(this.selectedProduct.id, this.selectedFile, apiPath)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (imgResponse) => {
          if (!this.selectedProduct) return;

          this.selectedProduct.imageName = this.selectedProduct.imageName || [];
          this.selectedProduct.imageName.unshift(imgResponse.imageUrl);
          this.imagePreview = imgResponse.imageUrl;
          this.selectedFile = null;
          this.cancelEdit();
        },
        error: (error) =>
          console.error('Помилка завантаження зображення:', error),
      });
  }

  deleteImg(index: number): void {
    if (!this.selectedProduct?.imageName?.[index] || !this.selectedProduct.id)
      return;

    const apiPath = this.getApiPath(this.selectedProduct.itemType);
    const imageUrl = this.selectedProduct.imageName[index];

    this.productService
      .deleteImage(apiPath, imageUrl)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => {
          if (this.selectedProduct) {
            this.selectedProduct.imageName.splice(index, 1);
          }
        },
        error: (error) => console.error('Помилка видалення зображення:', error),
      });
  }

  addOption(): void {
    if (!this.selectedProduct || this.selectedProduct.options.length >= 2)
      return;

    const newOption: Option = {
      id: this.selectedProduct.options.length,
      price: 0,
      quantity: 0,
    };

    if (this.selectedProduct.itemType === 'snack') {
      newOption.measureValue = 0;
    } else {
      newOption.volume = 0;
    }

    this.selectedProduct.options.push(newOption);
  }

  cancelEdit(): void {
    this.selectedProduct = null;
    this.imagePreview = null;
    this.selectedFile = null;
  }

  private getApiPath(itemType: string): string {
    switch (itemType.toLowerCase()) {
      case 'cider':
        return 'ciders';
      case 'beer':
        return 'beers';
      case 'snack':
        return 'snacks';
      default:
        throw new Error('Невідомий тип продукту');
    }
  }
}
