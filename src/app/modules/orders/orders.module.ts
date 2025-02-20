import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { OrdersComponent } from './orders/orders.component';

const routes: Routes = [
  { path: '', component: OrdersComponent }
];

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    OrdersComponent 
  ],
  exports: [RouterModule]
})
export class OrdersModule { }
