import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';

import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-login',
  standalone: true,
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule
  ]
})
export class LoginComponent {
  loginForm = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [
      Validators.required,
      Validators.minLength(8),
      Validators.pattern(/^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/)
    ])
  });

  hidePassword = true;
  failedAttempts = 0
  maxfailedAttempts = 5
  showError = false;
  login() {
    if (this.loginForm.invalid) {
      this.failedAttempts++;
      console.log(this.failedAttempts);

      if (this.failedAttempts >= this.maxfailedAttempts) {
        this.showError = true;
        setTimeout(() => {
          this.showError = false;
        }, 4500);
        return;
      }
    }
    else {
      console.log('Форма валидна', this.loginForm.value);
      this.failedAttempts = 0;
      this.loginForm.reset();
    }
  }
  hideError() {
    this.showError = false;
  }
}
