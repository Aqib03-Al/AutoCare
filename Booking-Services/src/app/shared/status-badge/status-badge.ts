import { Component, Input } from '@angular/core';
import { BookingStatus } from '../../core/models/booking.model';

@Component({
  selector: 'app-status-badge',
  imports: [],
  templateUrl: './status-badge.html',
  styleUrl: './status-badge.css',
})
export class StatusBadge {
  @Input({ required: true }) status!: BookingStatus;

  get label(): string {
    return this.status.replace('_', ' ');
  }
}
