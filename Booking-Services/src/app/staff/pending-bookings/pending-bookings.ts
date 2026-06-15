import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { BookingService } from '../../core/services/booking.service';
import { Booking } from '../../core/models/booking.model';
import { BookingTable } from '../../shared/booking-table/booking-table';
import { FieldError } from '../../shared/field-error/field-error';
import { getApiErrorMessage, isFieldInvalid, markFormGroupTouched } from '../../shared/utils/form.utils';

@Component({
  selector: 'app-pending-bookings',
  imports: [BookingTable, ReactiveFormsModule, FieldError],
  templateUrl: './pending-bookings.html',
  styleUrl: './pending-bookings.css',
})
export class PendingBookings implements OnInit {
  private readonly bookingService = inject(BookingService);
  private readonly fb = inject(FormBuilder);

  bookings: Booking[] = [];
  loading = true;
  error = '';
  message = '';

  selectedBooking: Booking | null = null;
  modalType: 'approve' | 'reject' | null = null;
  approveSubmitted = false;
  rejectSubmitted = false;
  approveLoading = false;
  rejectLoading = false;
  modalError = '';

  approveForm = this.fb.group({
    assignedDate: ['', Validators.required],
    assignedTime: ['', Validators.required],
  });

  rejectForm = this.fb.group({
    rejectionReason: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(500)]],
  });

  ngOnInit() {
    this.loadBookings();
  }

  invalidApprove(field: string): boolean {
    return isFieldInvalid(this.approveForm.get(field), this.approveSubmitted);
  }

  invalidReject(field: string): boolean {
    return isFieldInvalid(this.rejectForm.get(field), this.rejectSubmitted);
  }

  loadBookings() {
    this.loading = true;
    this.bookingService.getAll('pending').subscribe({
      next: (data) => {
        this.bookings = data;
        this.loading = false;
      },
      error: (err) => {
        this.error = getApiErrorMessage(err, 'Failed to load pending bookings.');
        this.loading = false;
      },
    });
  }

  openApprove(booking: Booking) {
    this.selectedBooking = booking;
    this.modalType = 'approve';
    this.approveSubmitted = false;
    this.modalError = '';
    this.approveForm.reset();
  }

  openReject(booking: Booking) {
    this.selectedBooking = booking;
    this.modalType = 'reject';
    this.rejectSubmitted = false;
    this.modalError = '';
    this.rejectForm.reset();
  }

  closeModal() {
    this.modalType = null;
    this.selectedBooking = null;
    this.approveSubmitted = false;
    this.rejectSubmitted = false;
    this.modalError = '';
    this.approveLoading = false;
    this.rejectLoading = false;
  }

  confirmApprove() {
    this.approveSubmitted = true;
    this.modalError = '';
    markFormGroupTouched(this.approveForm);

    if (!this.selectedBooking || this.approveForm.invalid) return;

    this.approveLoading = true;
    const { assignedDate, assignedTime } = this.approveForm.getRawValue();
    this.bookingService
      .approve(this.selectedBooking._id, assignedDate!, assignedTime!)
      .subscribe({
        next: () => {
          this.message = 'Booking approved successfully.';
          this.closeModal();
          this.loadBookings();
        },
        error: (err) => {
          this.approveLoading = false;
          this.modalError = getApiErrorMessage(err, 'Failed to approve booking.');
        },
      });
  }

  confirmReject() {
    this.rejectSubmitted = true;
    this.modalError = '';
    markFormGroupTouched(this.rejectForm);

    if (!this.selectedBooking || this.rejectForm.invalid) return;

    this.rejectLoading = true;
    this.bookingService
      .reject(this.selectedBooking._id, this.rejectForm.value.rejectionReason!)
      .subscribe({
        next: () => {
          this.message = 'Booking rejected successfully.';
          this.closeModal();
          this.loadBookings();
        },
        error: (err) => {
          this.rejectLoading = false;
          this.modalError = getApiErrorMessage(err, 'Failed to reject booking.');
        },
      });
  }
}
