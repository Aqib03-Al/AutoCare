import { User } from './user.model';
import { Service } from './service.model';

export type BookingStatus =
  | 'pending'
  | 'approved'
  | 'rejected'
  | 'cancelled'
  | 'in_progress'
  | 'completed';

export interface Vehicle {
  make: string;
  model: string;
  plateNumber: string;
  year: number;
}

export interface Booking {
  _id: string;
  customerId: User | string;
  serviceId: Service | string;
  staffId?: User | string;
  vehicle: Vehicle;
  preferredDate?: string;
  preferredTime?: string;
  assignedDate?: string;
  assignedTime?: string;
  status: BookingStatus;
  rejectionReason?: string;
  notes?: string;
  totalPrice: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface BookingRequest {
  serviceId: string;
  vehicle: Vehicle;
  preferredDate?: string;
  preferredTime?: string;
  notes?: string;
}

export interface MonthlyAnalytics {
  month: string;
  totalBookings: number;
  completedCount: number;
  pendingCount: number;
  totalRevenue: number;
  mostBookedService: string;
  statusBreakdown?: StatusBreakdownItem[];
  serviceBreakdown?: ServiceBreakdownItem[];
}

export interface StatusBreakdownItem {
  status: BookingStatus;
  label: string;
  count: number;
}

export interface ServiceBreakdownItem {
  serviceName: string;
  count: number;
  revenue: number;
}

export interface TrendPoint {
  month: string;
  label: string;
  totalBookings: number;
  completedCount: number;
  totalRevenue: number;
}

export interface TrendAnalytics {
  months: number;
  trend: TrendPoint[];
}

export interface DashboardStats {
  pendingCount: number;
  todayBookings: Booking[];
}
