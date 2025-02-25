import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormArray,
  ReactiveFormsModule,
} from '@angular/forms';
import { ProductService } from '../../core/services/product/product.service';
import {
  Beer,
  Cider,
  Product,
  Snack,
  SnackOptions,
} from '../../core/models/product.model';

@Component({
  selector: 'app-add-product',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './add-product.component.html',
  styleUrl: './add-product.component.scss',
})
export class AddProductComponent {
  productForm: FormGroup;
  selectedFile: File | null = null; // Файл изображения
  imagePreview: string | null = null; // Предварительный просмотр изображения

  constructor(private fb: FormBuilder, private productService: ProductService) {
    this.productForm = this.fb.group({
      type: [''],
      name: [''],
      description: [''],
      options: this.fb.array([this.createOption()]),
    });
  }

  get options() {
    return this.productForm.get('options') as FormArray;
  }

  createOption(): FormGroup {
    return this.fb.group({
      price: [''],
      quantity: [''],
      weight: [''],
    });
  }

  addOption() {
    this.options.push(this.createOption());
  }

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      this.selectedFile = input.files[0];
      const reader = new FileReader();
      reader.onload = (e) => {
        this.imagePreview = e.target?.result as string;
      };
      reader.readAsDataURL(this.selectedFile);
    }
  }

  onSubmit(): void {
    if (!this.productForm.valid) {
      console.error('Форма невалидна');
      return;
    }

    const formValues = this.productForm.value;

    let formData: Partial<Product> = {
      description: formValues.description,
      options: formValues.options.map((option: any) => ({
        quantity: option.quantity,
        price: option.price,
        volume: option.volume,
      })),
    };

    let apiPath = '';

    switch (formValues.type.toLowerCase()) {
      case 'cider':
        (formData as Partial<Cider>).ciderName = formValues.name;
        apiPath = 'ciders';
        break;
      case 'beer':
        (formData as Partial<Beer>).beerName = formValues.name;
        apiPath = 'beers';
        break;
      case 'snack':
        (formData as Partial<Snack>).snackName = formValues.name;
        (formData as Partial<Snack>).description = formValues.description;
        (formData as Partial<Snack>).imageName = formValues.imageName;
        (formData as Partial<Snack>).options = formValues.options.map(
          (option: any) => ({
            weight: option.weight,
            quantity: option.quantity,
            price: option.price,
          })
        ) as SnackOptions[];
        apiPath = 'snacks';
        break;
      default:
        console.error('Unknown product type:', formValues.type);
        return;
    }
    console.log(formData);

    // this.productService.createProduct(formData, apiPath).subscribe({
    //   next: (response) => {
    //     console.log('Продукт додано:', response);
    //     this.onCancel(); // Очищаем форму

    //     if (this.selectedFile) {
    //       this.productService
    //         .uploadImage(response.id, this.selectedFile, apiPath)
    //         .subscribe({
    //           next: (imgResponse) => {
    //             console.log('Зображення успішно завантажено:', imgResponse);
    //             if (imgResponse.imageUrl) {
    //               this.imagePreview = imgResponse.imageUrl;
    //               this.selectedFile = null;
    //             }
    //           },
    //           error: (error) =>
    //             console.error('Помилка завантаження зображення:', error),
    //         });
    //     }
    //   },
    //   error: (error) => console.error('Помилка додавання продукту:', error),
    // });
  }

  onCancel() {
    this.productForm.reset();
    this.imagePreview = null;
  }
}
