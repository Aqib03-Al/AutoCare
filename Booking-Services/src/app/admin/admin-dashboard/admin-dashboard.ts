import { Component, inject, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { DecimalPipe } from '@angular/common';
import { catchError, finalize, forkJoin, of } from 'rxjs';
import { AnalyticsService } from '../../core/services/analytics.service';
import { AuthService } from '../../core/services/auth.service';
import { MonthlyAnalytics, TrendAnalytics } from '../../core/models/booking.model';
import { AnalyticsChart } from '../../shared/analytics-chart/analytics-chart';
import { getApiErrorMessage } from '../../shared/utils/form.utils';

@Component({
  selector: 'app-admin-dashboard',
  imports: [RouterLink, DecimalPipe, AnalyticsChart],
  templateUrl: './admin-dashboard.html',
  styleUrl: './admin-dashboard.css',
})
export class AdminDashboard implements OnInit {
  private readonly analyticsService = inject(AnalyticsService);
  private readonly auth = inject(AuthService);

  stats: MonthlyAnalytics | null = null;
  trend: TrendAnalytics | null = null;
  pendingCount = 0;
  loading = true;
  error = '';
  trendError = '';
  dashboardError = '';

  readonly statusColors = ['#f59e0b', '#2563eb', '#ef4444', '#9ca3af', '#8b5cf6', '#16a34a'];
  readonly serviceColors = ['#2563eb', '#16a34a', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4'];

  get firstName(): string {
    const name = this.auth.currentUser()?.name;
    return name ? name.split(' ')[0] : 'Admin';
  }

  get statusChartLabels(): string[] {
    return (this.stats?.statusBreakdown ?? [])
      .filter((item) => item.count > 0)
      .map((item) => item.label);
  }

  get statusChartValues(): number[] {
    return (this.stats?.statusBreakdown ?? [])
      .filter((item) => item.count > 0)
      .map((item) => item.count);
  }

  get serviceChartLabels(): string[] {
    return (this.stats?.serviceBreakdown ?? []).map((item) => item.serviceName);
  }

  get serviceChartValues(): number[] {
    return (this.stats?.serviceBreakdown ?? []).map((item) => item.count);
  }

  get trendLabels(): string[] {
    return (this.trend?.trend ?? []).map((item) => item.label);
  }

  get trendBookings(): number[] {
    return (this.trend?.trend ?? []).map((item) => item.totalBookings);
  }

  get trendRevenue(): number[] {
    return (this.trend?.trend ?? []).map((item) => item.totalRevenue);
  }

  get hasChartData(): boolean {
    return this.statusChartValues.length > 0 || this.serviceChartValues.length > 0;
  }

  get hasTrendData(): boolean {
    return (this.trend?.trend?.length ?? 0) > 0;
  }

  ngOnInit() {
    const month = new Date().toISOString().slice(0, 7);

    forkJoin({
      monthly: this.analyticsService.getMonthly(month).pipe(
        catchError((err) => {
          this.error = getApiErrorMessage(err, 'Failed to load monthly analytics.');
          return of(null);
        })
      ),
      trend: this.analyticsService.getTrend(6).pipe(
        catchError((err) => {
          this.trendError = getApiErrorMessage(err, 'Failed to load trend charts.');
          return of(null);
        })
      ),
    })
      .pipe(finalize(() => (this.loading = false)))
      .subscribe(({ monthly, trend }) => {
        this.stats = monthly;
        this.trend = trend;
      });

    this.analyticsService.getDashboard().subscribe({
      next: (data) => (this.pendingCount = data.pendingCount),
      error: (err) => {
        this.dashboardError = getApiErrorMessage(err, 'Failed to load pending booking count.');
        this.pendingCount = 0;
      },
    });
  }
}
