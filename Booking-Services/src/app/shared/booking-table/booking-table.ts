import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Booking } from '../../core/models/booking.model';
import { StatusBadge } from '../status-badge/status-badge';

@Component({
  selector: 'app-booking-table',
  imports: [StatusBadge],
  templateUrl: './booking-table.html',
  styleUrl: './booking-table.css',
})
export class BookingTable {
  @Input({ required: true }) bookings: Booking[] = [];
  @Input() showCustomer = false;
  @Input() showActions = false;
  @Input() actionType: 'customer' | 'staff-pending' | 'staff-all' = 'customer';

  @Output() cancel = new EventEmitter<string>();
  @Output() approve = new EventEmitter<Booking>();
  @Output() reject = new EventEmitter<Booking>();
  @Output() startProgress = new EventEmitter<string>();
  @Output() complete = new EventEmitter<string>();

  serviceName(booking: Booking): string {
    const s = booking.serviceId;
    return typeof s === 'object' ? s.name : '—';
  }

  customerName(booking: Booking): string {
    const c = booking.customerId;
    return typeof c === 'object' ? c.name : '—';
  }

  customerPhone(booking: Booking): string {
    const c = booking.customerId;
    return typeof c === 'object' ? (c.phone || '—') : '—';
  }
}
