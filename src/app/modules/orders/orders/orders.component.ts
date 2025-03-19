import { CommonModule } from '@angular/common';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { MatSelectModule } from '@angular/material/select';
import { OrdersService } from '../../../core/services/orders/orders.service';
import { ConfirmDeleteDialogComponent } from '../../../components/confirm-delete-dialog/confirm-delete-dialog.component';
import { MatInputModule } from '@angular/material/input';
import { Order } from '../../../core/models/order.model';
import { MatDialog } from '@angular/material/dialog';
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
  ],
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.scss'],
})
export class OrdersComponent implements OnInit {
  orders: any[] = [];
  filteredOrders: any[] = [];
  selectedStatus: string = 'all';
  displayedColumns = [
    'id',
    'user',
    'contacts',
    'items',
    'totalPrice',
    'deliveryStatus',
    'actions',
  ];
  selectedOrderId: string = '';
  @ViewChild('input') inputRef!: ElementRef;
  orderStatuses = [
    { value: 'all', label: 'All' },
    { value: 'processing', label: 'Processing' },
    { value: 'accepted', label: 'Accepted' },
    { value: 'in_progress', label: 'In Progress' },
    { value: 'delivered', label: 'Delivered' },
    { value: 'completed', label: 'Completed' },
  ];
  getRowClass(status: string): string {
    switch (status) {
      case 'PROCESSING':
        return 'processing-row';
      case 'ACCEPTED':
        return 'accepted-row';
      case 'IN_PROGRESS':
        return 'in-progress-row';
      case 'DELIVERED':
        return 'delivered-row';
      case 'COMPLETED':
        return 'completed-row';
      default:
        return '';
    }
  }

  constructor(
    private ordersService: OrdersService,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.getAllOrders();
  }

  getAllOrders() {
    this.ordersService.getOrders().subscribe(
      (data) => {
        this.orders = data;
        this.filteredOrders = [...data];
      },
      (error) => console.error('Error fetching orders:', error)
    );
  }

  applyFilters(query: string): void {
    this.filteredOrders = this.orders.filter((order) => {
      const matchesStatus =
        this.selectedStatus === 'all' ||
        order.deliveryStatus?.toLowerCase() ===
          this.selectedStatus.toLowerCase();
      const matchesQuery =
        query === '' ||
        order.id.toString().toLowerCase().includes(query.toLowerCase());
      return matchesStatus && matchesQuery;
    });
  }

  onStatusChange(status: string): void {
    this.selectedStatus = status;
    const query = this.inputRef.nativeElement.value.trim().toLowerCase();
    this.applyFilters(query);
  }

  Filter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value
      .trim()
      .toLowerCase();
    this.applyFilters(filterValue);
  }

  deleteOrder(orderId: number): void {
    const dialogRef = this.dialog.open(ConfirmDeleteDialogComponent, {
      data: {
        text: 'Ви дійсно хочете скасувати цей заказ? Після підтвердження ви не зможете редагувати та змінювати цей заказ',
      },
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.deleteOrder(orderId);
      }
    });
  }
  editStatus(order: any, status: string): void {
    order.pendingStatus = status;
  }

  changeStatus(order: Order, newStatus: string): void {
    const orderData: Omit<Order, 'id' | 'pendingStatus'> = {
      customerPhoneNumber: order.customerPhoneNumber,
      paymentType: order.paymentType,
      deliveryMethod: order.deliveryMethod,
      deliveryAddress: order.deliveryAddress,
      deliveryStatus: newStatus.toLocaleUpperCase(),
    };

    this.ordersService.changeOrderStatus(order.id, orderData).subscribe(
      () => {
        order.pendingStatus = null;
        console.log('Статус успішно оновлено');
        this.ngOnInit();
      },
      (error) => console.error('Помилка оновлення статусу', error)
    );
  }
}
