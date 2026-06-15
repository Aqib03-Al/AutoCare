import { Injectable, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { tap } from 'rxjs';
import { ApiService } from './api.service';
import { AuthResponse, LoginRequest, RegisterRequest, User, UserRole } from '../models/user.model';

const TOKEN_KEY = 'token';
const USER_KEY = 'user';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly api = inject(ApiService);
  private readonly router = inject(Router);

  readonly currentUser = signal<User | null>(this.loadUser());

  register(data: RegisterRequest) {
    return this.api.post<AuthResponse>('/auth/register', data).pipe(
      tap((res) => this.setSession(res))
    );
  }

  login(data: LoginRequest) {
    return this.api.post<AuthResponse>('/auth/login', data).pipe(
      tap((res) => this.setSession(res))
    );
  }

  getMe() {
    return this.api.get<User>('/auth/me').pipe(
      tap((user) => {
        localStorage.setItem(USER_KEY, JSON.stringify(user));
        this.currentUser.set(user);
      })
    );
  }

  logout() {
    this.clearSession();
    this.router.navigate(['/']);
  }

  clearSession() {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    this.currentUser.set(null);
  }

  getToken(): string | null {
    return localStorage.getItem(TOKEN_KEY);
  }

  isLoggedIn(): boolean {
    return !!this.getToken();
  }

  getRole(): UserRole | null {
    return this.currentUser()?.role ?? null;
  }

  redirectByRole() {
    const role = this.getRole();
    const routes: Record<UserRole, string> = {
      customer: '/customer/dashboard',
      staff: '/staff/dashboard',
      admin: '/admin/dashboard',
    };
    if (role) {
      this.router.navigate([routes[role]]);
    }
  }

  private setSession(res: AuthResponse) {
    localStorage.setItem(TOKEN_KEY, res.token);
    localStorage.setItem(USER_KEY, JSON.stringify(res.user));
    this.currentUser.set(res.user);
  }

  private loadUser(): User | null {
    const raw = localStorage.getItem(USER_KEY);
    return raw ? JSON.parse(raw) : null;
  }
}
