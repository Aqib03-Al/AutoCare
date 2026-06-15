import { Component, inject, OnInit } from '@angular/core';
import { BookingService } from '../../core/services/booking.service';
import { Booking } from '../../core/models/booking.model';
import { BookingTable } from '../../shared/booking-table/booking-table';
import { getApiErrorMessage } from '../../shared/utils/form.utils';

@Component({
  selector: 'app-all-bookings',
  imports: [BookingTable],
  templateUrl: './all-bookings.html',
  styleUrl: './all-bookings.css',
})
export class AllBookings implements OnInit {
  private readonly bookingService = inject(BookingService);

  bookings: Booking[] = [];
  loading = true;
  error = '';
  message = '';
  statusFilter = '';

  ngOnInit() {
    this.loadBookings();
  }

  loadBookings() {
    this.loading = true;
    this.bookingService.getAll(this.statusFilter || undefined).subscribe({
      next: (data) => {
        this.bookings = data;
        this.loading = false;
      },
      error: (err) => {
        this.error = getApiErrorMessage(err, 'Failed to load bookings.');
        this.loading = false;
      },
    });
  }

  onFilterChange(status: string) {
    this.statusFilter = status;
    this.loadBookings();
  }

  startProgress(id: string) {
    this.bookingService.updateStatus(id, 'in_progress').subscribe({
      next: () => {
        this.message = 'Booking status updated to In Progress.';
        this.loadBookings();
      },
      error: (err) => {
        this.error = getApiErrorMessage(err, 'Failed to update booking status.');
      },
    });
  }

  complete(id: string) {
    this.bookingService.updateStatus(id, 'completed').subscribe({
      next: () => {
        this.message = 'Booking marked as completed.';
        this.loadBookings();
      },
      error: (err) => {
        this.error = getApiErrorMessage(err, 'Failed to update booking status.');
      },
    });
  }
}
