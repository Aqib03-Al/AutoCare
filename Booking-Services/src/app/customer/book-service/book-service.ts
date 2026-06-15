import { Component, ElementRef, inject, OnInit, viewChild } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { AbstractControl, FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ServiceService } from '../../core/services/service.service';
import { BookingService } from '../../core/services/booking.service';
import { AuthService } from '../../core/services/auth.service';
import { Service } from '../../core/models/service.model';
import { FieldError } from '../../shared/field-error/field-error';
import {
  getApiErrorMessage,
  getFormValidationSummary,
  isFieldInvalid,
  markFormGroupTouched,
} from '../../shared/utils/form.utils';

const currentYear = new Date().getFullYear();

function yearRangeValidator(control: AbstractControl) {
  const year = Number(control.value);
  if (!Number.isInteger(year) || year < 1900 || year > currentYear + 1) {
    return { yearRange: true };
  }
  return null;
}

@Component({
  selector: 'app-book-service',
  imports: [ReactiveFormsModule, RouterLink, FieldError],
  templateUrl: './book-service.html',
  styleUrl: './book-service.css',
})
export class BookService implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly serviceService = inject(ServiceService);
  private readonly bookingService = inject(BookingService);
  private readonly auth = inject(AuthService);
  private readonly fb = inject(FormBuilder);

  private readonly errorAlert = viewChild<ElementRef<HTMLElement>>('errorAlert');

  service: Service | null = null;
  loading = true;
  submitting = false;
  submitted = false;
  validationError = '';
  apiError = '';

  bookingForm = this.fb.group({
    make: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(50)]],
    model: ['', [Validators.required, Validators.minLength(1), Validators.maxLength(50)]],
    plateNumber: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(20)]],
    year: [
      String(currentYear),
      [Validators.required, Validators.pattern(/^\d{4}$/), yearRangeValidator],
    ],
    preferredDate: [''],
    preferredTime: [''],
    notes: ['', [Validators.maxLength(500)]],
  });

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('serviceId');
    if (!id) {
      this.router.navigate(['/customer/services']);
      return;
    }

    if (this.auth.getRole() !== 'customer') {
      this.loading = false;
      this.apiError = 'Only customer accounts can book services. Please log in with a customer account.';
      return;
    }

    this.serviceService.getAll().subscribe({
      next: (services) => {
        this.service = services.find((s) => s._id === id) ?? null;
        this.loading = false;
        if (!this.service) {
          this.apiError = 'Service not found or is no longer available.';
        }
      },
      error: (err) => {
        this.apiError = getApiErrorMessage(err, 'Failed to load service.');
        this.loading = false;
      },
    });
  }

  invalid(field: string): boolean {
    return isFieldInvalid(this.bookingForm.get(field), this.submitted);
  }

  submit() {
    this.submitted = true;
    this.validationError = '';
    this.apiError = '';

    if (!this.auth.isLoggedIn()) {
      this.apiError = 'Your session has expired. Please log in again.';
      this.router.navigate(['/login']);
      return;
    }

    if (this.auth.getRole() !== 'customer') {
      this.apiError = 'Only customer accounts can submit bookings.';
      this.showError();
      return;
    }

    if (!this.service) {
      this.apiError = 'Service not found or is no longer available.';
      this.showError();
      return;
    }

    markFormGroupTouched(this.bookingForm);

    const fieldLabels: Record<string, string> = {
      make: 'Vehicle make',
      model: 'Vehicle model',
      plateNumber: 'Plate number',
      year: 'Vehicle year',
      notes: 'Notes',
    };

    const errors = getFormValidationSummary(this.bookingForm, fieldLabels);
    const yearControl = this.bookingForm.get('year');
    if (yearControl?.errors?.['yearRange'] && !errors.some((e) => e.includes('Vehicle year'))) {
      errors.push(`Vehicle year must be between 1900 and ${currentYear + 1}.`);
    }
    if (yearControl?.errors?.['pattern'] && !errors.some((e) => e.includes('Vehicle year'))) {
      errors.push('Vehicle year must be a 4-digit number.');
    }

    if (errors.length > 0) {
      this.validationError = errors.join(' ');
      this.showError();
      return;
    }

    const formValue = this.bookingForm.getRawValue();
    const year = Number(formValue.year);

    this.submitting = true;

    this.bookingService
      .create({
        serviceId: this.service._id,
        vehicle: {
          make: String(formValue.make).trim(),
          model: String(formValue.model).trim(),
          plateNumber: String(formValue.plateNumber).trim(),
          year,
        },
        preferredDate: formValue.preferredDate || '',
        preferredTime: formValue.preferredTime || '',
        notes: formValue.notes || '',
      })
      .subscribe({
        next: () => {
          this.submitting = false;
          this.router.navigate(['/customer/bookings']);
        },
        error: (err) => {
          this.submitting = false;
          this.apiError = getApiErrorMessage(err, 'Booking submission failed. Please try again.');
          this.showError();
        },
      });
  }

  private showError() {
    setTimeout(() => {
      this.errorAlert()?.nativeElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
    });
  }
}
