import { Component, inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { finalize } from 'rxjs';
import { ServiceService } from '../../core/services/service.service';
import { Service } from '../../core/models/service.model';
import { ServiceCard } from '../../shared/service-card/service-card';
import { getApiErrorMessage } from '../../shared/utils/form.utils';

@Component({
  selector: 'app-service-list',
  imports: [ServiceCard],
  templateUrl: './service-list.html',
  styleUrl: './service-list.css',
})
export class ServiceList implements OnInit {
  private readonly serviceService = inject(ServiceService);
  private readonly router = inject(Router);

  services: Service[] = [];
  loading = true;
  error = '';

  ngOnInit() {
    this.serviceService
      .getAll()
      .pipe(finalize(() => (this.loading = false)))
      .subscribe({
        next: (data) => {
          this.services = data;
        },
        error: (err) => {
          this.error = getApiErrorMessage(err, 'Failed to load services.');
        },
      });
  }

  book(serviceId: string) {
    this.router.navigate(['/customer/book', serviceId]);
  }
}
