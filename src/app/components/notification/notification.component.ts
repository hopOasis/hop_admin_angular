// notification.component.ts
import { Component, Inject } from '@angular/core';
import {
  MAT_SNACK_BAR_DATA,
  MatSnackBarRef,
} from '@angular/material/snack-bar';

@Component({
  selector: 'app-notification',
  template: `
    <div class="notification-content">
      {{ data.message }}
      <button mat-button (click)="snackBarRef.dismiss()">
        {{ data.action }}
      </button>
    </div>
  `,
  styles: [
    `
      :host {
        display: block;
      }
      .notification-content {
        display: flex;
        align-items: center;
        justify-content: space-between;
      }
    `,
  ],
})
export class NotificationComponent {
  constructor(
    public snackBarRef: MatSnackBarRef<NotificationComponent>,
    @Inject(MAT_SNACK_BAR_DATA) public data: any
  ) {}
}
