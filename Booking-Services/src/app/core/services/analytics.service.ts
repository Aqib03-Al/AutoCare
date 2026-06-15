import { Injectable, inject } from '@angular/core';
import { ApiService } from './api.service';
import { DashboardStats, MonthlyAnalytics, TrendAnalytics } from '../models/booking.model';

@Injectable({ providedIn: 'root' })
export class AnalyticsService {
  private readonly api = inject(ApiService);

  getMonthly(month: string) {
    return this.api.get<MonthlyAnalytics>(`/analytics/monthly?month=${month}`);
  }

  getTrend(months = 6) {
    return this.api.get<TrendAnalytics>(`/analytics/trend?months=${months}`);
  }

  getDashboard() {
    return this.api.get<DashboardStats>('/analytics/dashboard');
  }
}
