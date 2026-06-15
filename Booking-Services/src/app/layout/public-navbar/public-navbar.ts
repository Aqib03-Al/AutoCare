import { Component, inject } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-public-navbar',
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './public-navbar.html',
  styleUrl: './public-navbar.css',
})
export class PublicNavbar {
  protected readonly auth = inject(AuthService);

  logout() {
    this.auth.logout();
  }

  dashboardLink(): string {
    const role = this.auth.getRole();
    const routes = {
      customer: '/customer/dashboard',
      staff: '/staff/dashboard',
      admin: '/admin/dashboard',
    };
    return role ? routes[role] : '/login';
  }
}
