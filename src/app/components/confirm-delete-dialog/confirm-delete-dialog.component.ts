import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { BrowserModule } from '@angular/platform-browser';

@Component({
  selector: 'app-confirm-delete-dialog',
  standalone: true,
  imports: [
    BrowserModule,
    MatDialogModule, // Добавьте этот модуль
    MatButtonModule, // Добавьте этот модуль
    MatIconModule, // Если нужно, добавьте и этот модуль
  ],
  templateUrl: './confirm-delete-dialog.component.html',
  styleUrls: ['./confirm-delete-dialog.component.scss'],
})
export class ConfirmDeleteDialogComponent {
  constructor(public dialogRef: MatDialogRef<ConfirmDeleteDialogComponent>) {}

  onNoClick(): void {
    this.dialogRef.close(false); // Закрытие диалога и возврат значения false
  }

  onYesClick(): void {
    this.dialogRef.close(true); // Закрытие диалога и возврат значения true
  }
}
