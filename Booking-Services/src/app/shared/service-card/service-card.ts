import { Component, Input, Output, EventEmitter } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { Service } from '../../core/models/service.model';

@Component({
  selector: 'app-service-card',
  imports: [DecimalPipe],
  templateUrl: './service-card.html',
  styleUrl: './service-card.css',
})
export class ServiceCard {
  @Input({ required: true }) service!: Service;
  @Input() showBookButton = true;
  @Output() book = new EventEmitter<string>();

  get iconSvg(): string {
    const name = this.service.name.toLowerCase();
    if (name.includes('oil')) {
      return `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2v6m0 0l-3 3m3-3l3 3"/><rect x="5" y="11" width="14" height="10" rx="2"/></svg>`;
    }
    if (name.includes('brake')) {
      return `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="3"/></svg>`;
    }
    if (name.includes('tire') || name.includes('tyre')) {
      return `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="9"/><path d="M12 3v18M3 12h18"/></svg>`;
    }
    if (name.includes('engine') || name.includes('diagnostic')) {
      return `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2v4m-4 2H4v8h4v4h8v-4h4v-8h-4V6h-8z"/></svg>`;
    }
    return `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14.7 6.3a1 1 0 000 1.4l1.6 1.6a1 1 0 001.4 0l3.77-3.77a6 6 0 01-7.94 7.94l-6.91 6.91a2.12 2.12 0 01-3-3l6.91-6.91a6 6 0 017.94-7.94l-3.76 3.76z"/></svg>`;
  }
}
