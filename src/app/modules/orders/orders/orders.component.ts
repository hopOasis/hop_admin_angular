import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { OrdersService } from '../../../core/services/orders/orders.service';
import { MatSelectModule } from '@angular/material/select';

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
  displayedColumns = [
    'id',
    'user',
    'contacts',
    'items',
    'totalPrice',
    'deliveryStatus',
    'actions'
  ];

  constructor(private ordersService: OrdersService) {}

  ngOnInit(): void {
    this.getAllOrders()
  }
  getAllOrders() {
    this.ordersService.getOrders().subscribe(
      (data) => {
        this.orders = data;
        this.filteredOrders = [...data];
      },
      (error) => {
        console.error('Помилка при отриманні заказів:', error);
      }
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
  newStatus: string =''
  editStatus(order: any, status: string): void {
    order.pendingStatus = status; // Записываем новый статус
    console.log(order.deliveryStatus)
    console.log(order.pendingStatus)
  }
  
  confirmStatusChange(order: any): void {
    if (confirm(`Підтвердити зміну статусу з ${order.deliveryStatus} на ${order.pendingStatus}?`)) {
      order.deliveryStatus = order.pendingStatus;
      order.pendingStatus = null; // Сбрасываем временный статус
    }
  }
  
  changeStatus(order: any) {
    console.log(order)
  }
}