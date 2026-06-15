import { Injectable, inject } from '@angular/core';
import { ApiService } from './api.service';
import { Booking, BookingRequest } from '../models/booking.model';

@Injectable({ providedIn: 'root' })
export class BookingService {
  private readonly api = inject(ApiService);

  create(data: BookingRequest) {
    return this.api.post<Booking>('/bookings', data);
  }

  getMyBookings() {
    return this.api.get<Booking[]>('/bookings/my');
  }

  getAll(status?: string) {
    const query = status ? `?status=${status}` : '';
    return this.api.get<Booking[]>(`/bookings${query}`);
  }

  getById(id: string) {
    return this.api.get<Booking>(`/bookings/${id}`);
  }

  approve(id: string, assignedDate: string, assignedTime: string) {
    return this.api.patch<Booking>(`/bookings/${id}/approve`, { assignedDate, assignedTime });
  }

  reject(id: string, rejectionReason: string) {
    return this.api.patch<Booking>(`/bookings/${id}/reject`, { rejectionReason });
  }

  updateStatus(id: string, status: 'in_progress' | 'completed') {
    return this.api.patch<Booking>(`/bookings/${id}/status`, { status });
  }

  cancel(id: string) {
    return this.api.patch<Booking>(`/bookings/${id}/cancel`, {});
  }
}
