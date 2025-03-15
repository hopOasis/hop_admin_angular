import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { MatSelectModule } from '@angular/material/select';
import { OrdersService } from '../../../core/services/orders/orders.service';

@Component({
  selector: 'app-orders',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatSelectModule,
    MatIconModule
  ],
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.scss']
})
export class OrdersComponent implements OnInit {
  orders: any[] = [];
  filteredOrders: any[] = [];
  selectedStatus: string = 'all';
  displayedColumns = ['id', 'user', 'contacts', 'items', 'totalPrice', 'deliveryStatus', 'actions'];
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

  onStatusChange(status: string): void {
    this.selectedStatus = status;
    this.applyFilters();
  }

  applyFilters(): void {
    this.filteredOrders = this.selectedStatus === 'all'
      ? [...this.orders]
      : this.orders.filter(order => order.deliveryStatus?.toLowerCase() === this.selectedStatus);
  }

  deleteOrder(orderId: number): void {
    this.orders = this.orders.filter(order => order.id !== orderId);
    this.applyFilters();
  }

  editStatus(order: any, status: string): void {
    order.pendingStatus = status;
  }

  changeStatus(order: any, newStatus: string): void {
    const orderData = {
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
        this.ngOnInit()
      },
      (error) => console.error('Помилка оновлення статусу', error)
    );
  }
}
