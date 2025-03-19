import {
  Component,
  Input,
  Output,
  EventEmitter,
  OnDestroy,
} from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { Beer, Cider, Product, Snack } from '../../core/models/product.model';
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
  selector: 'app-add-product',
  templateUrl: './add-product.component.html',
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
  styleUrls: ['./add-product.component.scss'],
})
export class AddProductComponent implements OnDestroy {
  @Input() newProductId: number = 0;
  @Output() cancel = new EventEmitter<void>();
  @Input() selectedProduct: Product | null = null;
  imagePreview: string | ArrayBuffer | null = null;
  selectedFile: File | null = null;
  private destroy$ = new Subject<void>();

  constructor(private productService: ProductService) {}
  ngOnInit(): void {
    if (!this.selectedProduct) {
      this.initializeNewProduct();
    }
  }

  private initializeNewProduct(): void {
    this.selectedProduct = {
      id: this.newProductId,
      name: '',
      description: '',
      itemType: 'beer',
      options: [],
      imageName: [],
      averageRating: 0,
      ratingCount: 0,
      specialOfferIds: [],
    };
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  addOption(): void {
    if (!this.selectedProduct) return;

    const newOption: any = {
      id: undefined,
      quantity: 0,
      price: 0,
    };

    switch (this.selectedProduct.itemType.toLowerCase()) {
      case 'cider':
      case 'beer':
        newOption.volume = 0;
        break;
      case 'snack':
        newOption.measureValue = 0;
        break;
    }

    this.selectedProduct.options.push(newOption);
  }

  isFormInvalid(): boolean {
    if (!this.selectedProduct) return true;
    const optionsCountValid =
      this.selectedProduct.options.length < 1 ||
      this.selectedProduct.options.length > 2;

    if (
      !this.selectedProduct.name?.trim() ||
      !this.selectedProduct.description?.trim()
    ) {
      return true;
    }

    return (
      !this.selectedProduct.name?.trim() ||
      !this.selectedProduct.description?.trim() ||
      optionsCountValid ||
      this.selectedProduct.options.some((option) => {
        if (option.quantity <= 0 || option.price <= 0) return true;
        switch (this.selectedProduct?.itemType.toLowerCase()) {
          case 'cider':
          case 'beer':
            return (option as any).volume <= 0;
          case 'snack':
            return (option as any).measureValue <= 0;
          default:
            return true;
        }
      })
    );
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

  addProduct(): void {
    if (!this.selectedProduct) {
      console.error('Продукт не вибрано');
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
      .createProduct(apiPath, formData)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          console.log('Продукт створено:', response);
          this.handleImageUpload(apiPath, response.id);
        },
        error: (error) => console.error('Помилка додавання продукту:', error),
      });
  }

  private buildFormData(): Partial<Product> {
    if (!this.selectedProduct) throw new Error('Продукт не вибрано');

    const options = this.selectedProduct.options.map((option) => ({
      id: option.id,
      quantity: Math.max(0, option.quantity),
      price: Math.max(0, option.price),
      ...(this.selectedProduct?.itemType.toLowerCase() === 'snack'
        ? { measureValue: Math.max(0, (option as any).measureValue ?? 0) }
        : { volume: Math.max(0, (option as any).volume ?? 0) }),
    }));

    switch (this.selectedProduct.itemType.toLowerCase()) {
      case 'cider':
        return {
          name: this.selectedProduct.name,
          description: this.selectedProduct.description,
          options: options,
        } as Partial<Cider>;

      case 'beer':
        return {
          name: this.selectedProduct.name,
          description: this.selectedProduct.description,
          options: options,
        } as Partial<Beer>;

      case 'snack':
        return {
          name: this.selectedProduct.name,
          description: this.selectedProduct.description,
          options: options.map((opt) => ({
            id: opt.id,
            weight: (opt as any).measureValue, // Type assertion here
            quantity: opt.quantity,
            price: opt.price,
          })),
        } as Partial<Snack>;

      default:
        throw new Error('Невідомий тип продукту');
    }
  }

  private handleImageUpload(apiPath: string, productId: number): void {
    if (!this.selectedFile) {
      console.log('Файл не вибрано');
      this.cancelEdit();
      return;
    }

    this.productService
      .uploadImage(productId, this.selectedFile, apiPath)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (imgResponse) => {
          if (!this.selectedProduct) return;
          this.selectedProduct.imageName.unshift(imgResponse.imageUrl);
          this.imagePreview = imgResponse.imageUrl;
          this.selectedFile = null;
          this.cancelEdit();
        },
        error: (error) =>
          console.error('Помилка завантаження зображення:', error),
      });
  }

  cancelEdit(): void {
    this.cancel.emit();
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
