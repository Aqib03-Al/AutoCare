import { Component, inject, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { DecimalPipe } from '@angular/common';
import { finalize } from 'rxjs';
import { ServiceService } from '../../core/services/service.service';
import { BookingService } from '../../core/services/booking.service';
import { AuthService } from '../../core/services/auth.service';
import { Service } from '../../core/models/service.model';
import { Booking } from '../../core/models/booking.model';
import { ServiceCard } from '../../shared/service-card/service-card';
import { StatusBadge } from '../../shared/status-badge/status-badge';
import { getApiErrorMessage } from '../../shared/utils/form.utils';

type ServiceFilter = 'all' | 'maintenance' | 'repair';

@Component({
  selector: 'app-customer-dashboard',
  imports: [RouterLink, ServiceCard, StatusBadge, DecimalPipe],
  templateUrl: './customer-dashboard.html',
  styleUrl: './customer-dashboard.css',
})
export class CustomerDashboard implements OnInit {
  private readonly serviceService = inject(ServiceService);
  private readonly bookingService = inject(BookingService);
  private readonly router = inject(Router);
  protected readonly auth = inject(AuthService);

  services: Service[] = [];
  recentBookings: Booking[] = [];
  loadingServices = true;
  loadingBookings = true;
  error = '';
  bookingsError = '';
  activeFilter: ServiceFilter = 'all';

  get firstName(): string {
    const name = this.auth.currentUser()?.name;
    return name ? name.split(' ')[0] : 'there';
  }

  ngOnInit() {
    this.serviceService
      .getAll()
      .pipe(finalize(() => (this.loadingServices = false)))
      .subscribe({
        next: (data) => (this.services = data),
        error: (err) => {
          this.error = getApiErrorMessage(err, 'Failed to load services.');
        },
      });

    this.bookingService
      .getMyBookings()
      .pipe(finalize(() => (this.loadingBookings = false)))
      .subscribe({
        next: (data) => (this.recentBookings = data.slice(0, 5)),
        error: (err) => {
          this.bookingsError = getApiErrorMessage(err, 'Failed to load recent bookings.');
        },
      });
  }

  get filteredServices(): Service[] {
    if (this.activeFilter === 'all') return this.services;
    return this.services.filter((s) => this.getCategory(s) === this.activeFilter);
  }

  get upcomingBooking(): Booking | undefined {
    return this.recentBookings.find((b) => ['pending', 'approved', 'in_progress'].includes(b.status));
  }

  setFilter(filter: ServiceFilter) {
    this.activeFilter = filter;
  }

  bookService(serviceId: string) {
    this.router.navigate(['/customer/book', serviceId]);
  }

  serviceName(booking: Booking): string {
    const s = booking.serviceId;
    return typeof s === 'object' ? s.name : 'Service';
  }

  bookingDate(booking: Booking): string {
    return booking.assignedDate || booking.preferredDate || booking.createdAt || '—';
  }

  vehicleLabel(booking: Booking): string {
    const { make, model, year } = booking.vehicle;
    return year ? `${year} ${make} ${model}` : `${make} ${model}`;
  }

  private getCategory(service: Service): 'maintenance' | 'repair' {
    const name = service.name.toLowerCase();
    const repairKeywords = ['brake', 'engine', 'diagnostic', 'repair'];
    return repairKeywords.some((k) => name.includes(k)) ? 'repair' : 'maintenance';
  }
}
