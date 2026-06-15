import { Component, inject, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AnalyticsService } from '../../core/services/analytics.service';
import { AuthService } from '../../core/services/auth.service';
import { Booking } from '../../core/models/booking.model';
import { StatusBadge } from '../../shared/status-badge/status-badge';
import { getApiErrorMessage } from '../../shared/utils/form.utils';

@Component({
  selector: 'app-staff-dashboard',
  imports: [RouterLink, StatusBadge],
  templateUrl: './staff-dashboard.html',
  styleUrl: './staff-dashboard.css',
})
export class StaffDashboard implements OnInit {
  private readonly analyticsService = inject(AnalyticsService);
  private readonly auth = inject(AuthService);

  pendingCount = 0;
  todayBookings: Booking[] = [];
  loading = true;
  error = '';

  get firstName(): string {
    const name = this.auth.currentUser()?.name;
    return name ? name.split(' ')[0] : 'Staff';
  }

  ngOnInit() {
    this.analyticsService.getDashboard().subscribe({
      next: (data) => {
        this.pendingCount = data.pendingCount;
        this.todayBookings = data.todayBookings;
        this.loading = false;
      },
      error: (err) => {
        this.error = getApiErrorMessage(err, 'Failed to load dashboard.');
        this.loading = false;
      },
    });
  }

  serviceName(booking: Booking): string {
    const s = booking.serviceId;
    return typeof s === 'object' ? s.name : '—';
  }

  customerName(booking: Booking): string {
    const c = booking.customerId;
    return typeof c === 'object' ? c.name : '—';
  }
}
