import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { OrdersService } from '../../../core/services/orders/orders.service';

@Component({
  selector: 'app-orders',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatIconModule
  ],
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.scss']
})
export class OrdersComponent implements OnInit {
  orders: any[] = []; // Массив для хранения заказов
  displayedColumns = [
    'id',
    'user',
    'contacts',
    'items',
    'totalPrice',
    'deliveryStatus',
    'actions' // Добавил колонку для кнопок управления
  ];

  constructor(private ordersService: OrdersService) {}

  ngOnInit(): void {
    // Получаем заказы при инициализации компонента
    this.ordersService.getOrders().subscribe(
      (data) => {
        this.orders = data; // Присваиваем полученные данные переменной orders
        console.log(data);
      },
      (error) => {
        console.error('Ошибка при получении заказов:', error);
      }
    );
  }

  changeStatus(order: any) {
    console.log('Смена статуса для заказа:', order);
    // Логика смены статуса
  }

  deleteOrder(orderId: number) {
    console.log('Удаление заказа с ID:', orderId);
    this.orders = this.orders.filter(order => order.id !== orderId);
  }
}
