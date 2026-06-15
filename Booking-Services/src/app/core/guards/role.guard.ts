import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { UserRole } from '../models/user.model';

export const roleGuard = (...roles: UserRole[]): CanActivateFn => {
  return () => {
    const auth = inject(AuthService);
    const router = inject(Router);
    const userRole = auth.getRole();

    if (userRole && roles.includes(userRole)) {
      return true;
    }

    if (auth.isLoggedIn()) {
      auth.redirectByRole();
    } else {
      router.navigate(['/login']);
    }
    return false;
  };
};
