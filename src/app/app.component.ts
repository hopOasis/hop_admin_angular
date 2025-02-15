import { Component } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { LayoutComponent } from './modules/layout/layout/layout.component';
import { AuthService } from './core/services/auth/auth.service';
import { TokenService } from './core/services/token/token.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, LayoutComponent],
  templateUrl: './app.component.html'
})
export class AppComponent {
  title = 'hop-fr-angular';

  constructor(
    private authService: AuthService,
    private tokenService: TokenService,
    private router: Router
  ) {}
  
  ngOnInit() {
    this.authService.validateToken().subscribe(isValid => {
      if (!isValid) {
        this.tokenService.removeToken(); 
        this.router.navigate(['/login']);
      }
    });
  }
}
