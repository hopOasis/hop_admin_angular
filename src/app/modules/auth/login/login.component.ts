import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';

import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { AuthService } from '../../../core/services/auth/auth.service';
import { TokenService } from '../../../core/services/token/token.service';
import { Router } from '@angular/router';

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
      // Validators.pattern(/^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/)
    ])
  });

  hidePassword = true;
  failedAttempts = 0;
  maxFailedAttempts = 5;
  showError = false;

  constructor(private authService: AuthService, private tokenService: TokenService, private router: Router) {}

  login() {
    const { email, password } = this.loginForm.value; 
    if (this.loginForm.invalid) {
      this.failedAttempts++;
      console.log(this.failedAttempts);

      if (this.failedAttempts >= this.maxFailedAttempts) {
        this.showError = true;
        setTimeout(() => {
          this.showError = false;
        }, 4500);
      }
      return;
    }

    if (email && password) {
      this.authService.login(email, password).subscribe({
        next: (response) => {
          console.log('ВІдповідь сервера', response); 
          console.log('Токен:', response?.access_token); 
    
          this.tokenService.saveToken(response.access_token); 
          this.router.navigate(['/layout']);
        },
      });
    }
  }

  hideError() {
    this.showError = false;
  }
}
