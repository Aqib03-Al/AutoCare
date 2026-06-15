import { Injectable, inject } from '@angular/core';
import { ApiService } from './api.service';
import { User } from '../models/user.model';

@Injectable({ providedIn: 'root' })
export class UserService {
  private readonly api = inject(ApiService);

  getUsers(role?: string) {
    const query = role ? `?role=${role}` : '';
    return this.api.get<User[]>(`/users${query}`);
  }

  createStaff(data: { name: string; email: string; password: string; phone?: string }) {
    return this.api.post<User>('/users/staff', data);
  }

  update(id: string, data: Partial<User>) {
    return this.api.put<User>(`/users/${id}`, data);
  }

  deactivate(id: string) {
    return this.api.patch<User>(`/users/${id}/deactivate`, {});
  }
}
