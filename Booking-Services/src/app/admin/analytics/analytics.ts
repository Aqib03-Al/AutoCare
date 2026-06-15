import { DecimalPipe } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { catchError, finalize, forkJoin, of } from 'rxjs';
import { AnalyticsService } from '../../core/services/analytics.service';
import { MonthlyAnalytics, TrendAnalytics } from '../../core/models/booking.model';
import { AnalyticsChart } from '../../shared/analytics-chart/analytics-chart';
import { getApiErrorMessage } from '../../shared/utils/form.utils';

@Component({
  selector: 'app-analytics',
  imports: [DecimalPipe, AnalyticsChart],
  templateUrl: './analytics.html',
  styleUrl: './analytics.css',
})
export class Analytics implements OnInit {
  private readonly analyticsService = inject(AnalyticsService);

  stats: MonthlyAnalytics | null = null;
  trend: TrendAnalytics | null = null;
  selectedMonth = new Date().toISOString().slice(0, 7);
  loading = false;
  error = '';
  trendError = '';

  readonly statusColors = ['#f59e0b', '#2563eb', '#ef4444', '#9ca3af', '#8b5cf6', '#16a34a'];
  readonly serviceColors = ['#2563eb', '#16a34a', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4'];

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

  get serviceRevenueValues(): number[] {
    return (this.stats?.serviceBreakdown ?? []).map((item) => item.revenue);
  }

  get trendLabels(): string[] {
    return (this.trend?.trend ?? []).map((item) => item.label);
  }

  get trendRevenue(): number[] {
    return (this.trend?.trend ?? []).map((item) => item.totalRevenue);
  }

  get hasTrendData(): boolean {
    return (this.trend?.trend?.length ?? 0) > 0;
  }

  ngOnInit() {
    this.loadAnalytics();
  }

  loadAnalytics() {
    this.loading = true;
    this.error = '';
    this.trendError = '';

    forkJoin({
      monthly: this.analyticsService.getMonthly(this.selectedMonth).pipe(
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
  }

  onMonthChange(event: Event) {
    this.selectedMonth = (event.target as HTMLInputElement).value.slice(0, 7);
    this.loadAnalytics();
  }
}
