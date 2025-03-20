// notification.service.ts
import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { NotificationComponent } from '../../../components/notification/notification.component';

@Injectable({
  providedIn: 'root',
})
export class NotificationService {
  constructor(private snackBar: MatSnackBar) {}

  show(message: string, action: string = 'OK', duration: number = 3000) {
    this.snackBar.openFromComponent(NotificationComponent, {
      duration: duration,
      data: { message, action },
      panelClass: ['custom-notification'],
    });
  }
}
