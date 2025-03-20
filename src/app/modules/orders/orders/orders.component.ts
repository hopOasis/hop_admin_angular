import { CommonModule } from '@angular/common';
import {
  Component,
  ElementRef,
  OnInit,
  OnDestroy,
  ViewChild,
} from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatDialog } from '@angular/material/dialog';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar } from '@angular/material/snack-bar'; // Импортируем MatSnackBar для уведомлений
import { OrdersService } from '../../../core/services/orders/orders.service';
import { Order } from '../../../core/models/order.model';
import { ConfirmDeleteDialogComponent } from '../../../components/confirm-delete-dialog/confirm-delete-dialog.component';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-orders',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatSelectModule,
    MatInputModule,
    ConfirmDeleteDialogComponent,
    MatIconModule,
    MatProgressSpinnerModule,
  ],
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.scss'],
})
export class OrdersComponent implements OnInit, OnDestroy {
  orders: Order[] = [];
  filteredOrders: Order[] = [];
  selectedStatus: string = 'all';
  isLoading: boolean = false;

  displayedColumns = [
    'id',
    'user',
    'contacts',
    'items',
    'totalPrice',
    'deliveryStatus',
  ];

  orderStatuses = [
    { value: 'all', label: 'Всі' },
    { value: 'processing', label: 'В обробці' },
    { value: 'accepted', label: 'Прийнято' },
    { value: 'in_progress', label: 'В процесі' },
    { value: 'delivered', label: 'Доставляється' },
    { value: 'completed', label: 'Завершено' },
  ];

  @ViewChild('input') inputRef!: ElementRef<HTMLInputElement>;

  private destroy$ = new Subject<void>();

  constructor(
    private ordersService: OrdersService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar // Добавляем MatSnackBar
  ) {}

  ngOnInit(): void {
    this.loadOrders();
  }

  private loadOrders(): void {
    this.isLoading = true;
    this.ordersService
      .getOrders()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (orders) => {
          this.orders = orders;
          this.applyFilters();
          this.isLoading = false;
        },
        error: (error) => {
          console.error('Помилка завантаження замовлень:', error);
          this.isLoading = false;
        },
      });
  }

  applyFilters(): void {
    const searchQuery = this.inputRef.nativeElement.value.trim().toLowerCase();
    const statusFilter = this.selectedStatus.toLowerCase();

    this.filteredOrders = this.orders.filter((order) => {
      const matchesStatus =
        statusFilter === 'all' ||
        order.deliveryStatus.toLowerCase() === statusFilter;
      const matchesSearch = order.id.toString().includes(searchQuery);
      return matchesStatus && matchesSearch;
    });
  }

  onStatusChange(): void {
    this.applyFilters();
  }

  onSearchInput(event: Event): void {
    this.applyFilters();
  }

  updateOrderStatus(order: Order, newStatus: string): void {
    const upperStatus = newStatus.toUpperCase();

    const dialogRef = this.dialog.open(ConfirmDeleteDialogComponent, {
      data: {
        text:
          upperStatus === 'COMPLETED'
            ? 'Ви дійсно хочете закрити це замовлення? Після підтвердження ви не зможете редагувати або змінювати це замовлення.'
            : `Ви дійсно хочете змінити статус замовлення на "${newStatus}"?`,
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (!result) {
        return;
      }

      if (upperStatus === 'COMPLETED') {
        this.ordersService
          .deleteOrder(order.id)
          .pipe(takeUntil(this.destroy$))
          .subscribe({
            next: () => {
              this.orders = this.orders.filter((o) => o.id !== order.id);
              this.applyFilters();
              this.showNotification('Замовлення було видалено');
            },
            error: (error) =>
              console.error('Помилка видалення замовлення:', error),
          });
      } else {
        const updatedOrder: Order = {
          ...order,
          deliveryStatus: upperStatus,
          pendingStatus: null,
        };

        this.ordersService
          .changeOrderStatus(order.id, updatedOrder)
          .pipe(takeUntil(this.destroy$))
          .subscribe({
            next: () => {
              const index = this.orders.findIndex((o) => o.id === order.id);
              if (index > -1) {
                this.orders[index] = updatedOrder;
                this.applyFilters();
                this.showNotification(
                  `Статус замовлення змінено на "${newStatus}"`
                );
              }
            },
            error: (error) => {
              console.error('Помилка оновлення статусу:', error);
              order.pendingStatus = null;
            },
          });
      }
    });
  }

  getRowClass(status: string): string {
    const statusMap: { [key: string]: string } = {
      PROCESSING: 'processing-row',
      ACCEPTED: 'accepted-row',
      IN_PROGRESS: 'in-progress-row',
      DELIVERED: 'delivered-row',
      COMPLETED: 'completed-row',
    };

    return statusMap[status.toUpperCase()] || '';
  }

  private showNotification(message: string): void {
    this.snackBar.open(message, 'OK', { duration: 3000 });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
