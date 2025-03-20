import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { ProductService } from '../../../core/services/product/product.service';
import { ApiResponse, Product } from '../../../core/models/product.model';
import { forkJoin, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { FormsModule } from '@angular/forms';
import { MatSelectModule } from '@angular/material/select';
import { MatCardModule } from '@angular/material/card';
import { ProductEditorComponent } from '../../../components/product-editor/product-editor.component';
import { AddProductComponent } from '../../../components/add-product/add-product.component';
import { ConfirmDeleteDialogComponent } from '../../../components/confirm-delete-dialog/confirm-delete-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { NotificationService } from '../../../core/services/notification/notification.service';

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
    AddProductComponent,
    ProductEditorComponent,
    ConfirmDeleteDialogComponent,
  ],
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.scss'],
})
export class ProductsComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();

  imagePreview: string | ArrayBuffer | null = null;
  resultsLength = 0;
  itemsPerPage = 10;
  currentPage = 0;
  edit = false;
  selectedFile: File | null = null;
  selectedProduct: Product | null = null;
  isAddingProduct = false;

  displayedColumns: string[] = [
    'name',
    'description',
    'imageName',
    'itemType',
    'options',
    'actions',
  ];

  products: Product[] = [];
  filteredProducts: Product[] = [];
  selectedType: string = 'all';
  productLoading: boolean = true;

  constructor(
    private productService: ProductService,
    private dialog: MatDialog,
    private notification: NotificationService
  ) {}

  ngOnInit(): void {
    this.getAllProducts();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  getAllProducts(): void {
    this.productService
      .getProducts(0, 10)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (data: ApiResponse) => {
          const totalPages = data.totalPages;
          const requests = [];

          for (let i = 0; i < totalPages; i++) {
            requests.push(this.productService.getProducts(i, 10));
          }

          forkJoin(requests)
            .pipe(takeUntil(this.destroy$))
            .subscribe({
              next: (responses) => {
                this.products = responses.flatMap((res) => res.content);
                this.filteredProducts = [...this.products];
              },
              error: (error) => {
                this.notification.show('Помилка завантаження товарів');
                console.error(error);
              },
            });
          this.productLoading = false;
        },
        error: (error) => {
          this.notification.show('Помилка завантаження товарів');
          console.error(error);
          this.productLoading = false;
        },
      });
  }

  Filter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value
      .trim()
      .toLowerCase();
    this.applyFilters(filterValue, this.selectedType);
  }

  onTypeChange(type: string): void {
    this.selectedType = type;
    this.applyFilters('', this.selectedType);
  }

  applyFilters(query: string, type: string): void {
    this.filteredProducts = this.products.filter((product) => {
      const matchesQuery = product.name.toLowerCase().includes(query);
      const matchesType =
        type === 'all' || product.itemType.toLowerCase() === type;
      return matchesQuery && matchesType;
    });
  }

  editProduct(product: Product): void {
    this.selectedProduct = { ...product };
    this.edit = true;
    this.imagePreview = product.imageName ? product.imageName[0] : null;
  }

  deleteProduct(itemType: string, productId: number): void {
    const dialogRef = this.dialog.open(ConfirmDeleteDialogComponent, {
      data: { text: 'Ви дійсно хочете видалити цей товар?' },
    });

    dialogRef
      .afterClosed()
      .pipe(takeUntil(this.destroy$))
      .subscribe((result: boolean) => {
        if (result) {
          this.executeDeleteProduct(itemType, productId);
        }
      });
  }

  executeDeleteProduct(itemType: string, productId: number): void {
    this.productService
      .deleteProduct(itemType, productId)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => {
          this.products = this.products.filter(
            (product) => product.id !== productId
          );
          this.filteredProducts = [...this.products];
          this.notification.show('Товар успішно видалено');
        },
        error: (error) => {
          this.notification.show('Помилка видалення товару');
          console.error(error);
        },
      });
  }

  onCancelAddingProduct() {
    this.isAddingProduct = false;
  }

  startAddProduct() {
    this.isAddingProduct = true;
  }
}
