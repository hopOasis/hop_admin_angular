import { Component } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { AuthService } from './core/services/auth/auth.service';
import { TokenService } from './core/services/token/token.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './app.component.html'
})
export class AppComponent {
  title = 'hop-fr-angular';

  constructor(
    private tokenService: TokenService,
    private router: Router
  ) {}
  
  ngOnInit() {
    if (!this.tokenService.isTokenValid()) {
      this.router.navigate(['/login']); 
    }
  }
}
