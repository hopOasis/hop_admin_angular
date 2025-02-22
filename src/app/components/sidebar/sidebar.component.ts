import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatButtonModule } from '@angular/material/button';
import { TokenService } from '../../core/services/token/token.service';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatSidenavModule, 
    MatListModule, 
    MatIconModule,
    MatButtonModule,
    
  ],
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent {
  constructor(
    private router: Router,
    private tokenService: TokenService,
  ) {
  }
  links = [
    { path: 'dashboard', label: 'Dashboard', icon: 'space_dashboard' },
    { path: 'products', label: 'Products', icon: 'inventory_2' },
    { path: 'orders', label: 'Orders', icon: 'fact_check' },
    { path: 'reviews', label: 'Reviews', icon: 'feedback' }
  ];
  logout() {
    this.tokenService.removeToken();
    this.router.navigate(['']);
  }

}