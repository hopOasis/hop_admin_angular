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
    MatIconModule,
  ],
})
export class LoginComponent {
  loginForm: FormGroup;
  hidePassword = true;
  failedAttempts = 0;
  readonly maxFailedAttempts = 5;

  showError = false;
  failData = false;

  constructor(
    private authService: AuthService,
    private tokenService: TokenService,
    private router: Router
  ) {
    this.loginForm = new FormGroup({
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', [
        Validators.required,
        Validators.minLength(8),
      ]),
    });
  }

  login(): void {
    if (this.loginForm.invalid) return;

    const { email, password } = this.loginForm.value;
    
    this.authService.login(email, password).subscribe({
      next: (response) => this.handleSuccess(response),
      error: () => this.handleError(),
    });
  }

  private handleSuccess(response: any): void {
    this.tokenService.saveToken(response.access_token);
    this.router.navigate(['/layout']);
    this.failData = false;
    this.failedAttempts = 0; 
  }

  private handleError(): void {
    this.failData = true;
    this.failedAttempts++;

    if (this.failedAttempts >= this.maxFailedAttempts) {
      this.showError = true;
      this.failData = false;
      this.loginForm.reset();

      setTimeout(() => {
        this.showError = false;
      }, 4500);
    }
  }

  hideError(): void {
    this.showError = false;
  }
}
