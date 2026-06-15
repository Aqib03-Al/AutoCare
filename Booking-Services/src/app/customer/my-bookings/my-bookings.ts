import { Component, inject, OnInit } from '@angular/core';
import { BookingService } from '../../core/services/booking.service';
import { Booking } from '../../core/models/booking.model';
import { BookingTable } from '../../shared/booking-table/booking-table';
import { getApiErrorMessage } from '../../shared/utils/form.utils';

@Component({
  selector: 'app-my-bookings',
  imports: [BookingTable],
  templateUrl: './my-bookings.html',
  styleUrl: './my-bookings.css',
})
export class MyBookings implements OnInit {
  private readonly bookingService = inject(BookingService);

  bookings: Booking[] = [];
  loading = true;
  error = '';
  message = '';

  ngOnInit() {
    this.loadBookings();
  }

  loadBookings() {
    this.loading = true;
    this.bookingService.getMyBookings().subscribe({
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

  cancelBooking(id: string) {
    if (!confirm('Are you sure you want to cancel this booking?')) return;
    this.bookingService.cancel(id).subscribe({
      next: () => {
        this.message = 'Booking cancelled successfully.';
        this.loadBookings();
      },
      error: (err) => {
        this.error = getApiErrorMessage(err, 'Failed to cancel booking.');
      },
    });
  }
}
