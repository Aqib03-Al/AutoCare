import { Component, inject, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { finalize } from 'rxjs';
import { ServiceService } from '../../core/services/service.service';
import { AuthService } from '../../core/services/auth.service';
import { Service } from '../../core/models/service.model';
import { ServiceCard } from '../../shared/service-card/service-card';
import { getApiErrorMessage } from '../../shared/utils/form.utils';

type ServiceFilter = 'all' | 'maintenance' | 'repair';

@Component({
  selector: 'app-home',
  imports: [RouterLink, ServiceCard],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home implements OnInit {
  private readonly serviceService = inject(ServiceService);
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);

  services: Service[] = [];
  loading = true;
  error = '';
  activeFilter: ServiceFilter = 'all';

  ngOnInit() {
    this.serviceService
      .getPublic()
      .pipe(finalize(() => (this.loading = false)))
      .subscribe({
        next: (data) => (this.services = data),
        error: (err) => {
          this.error = getApiErrorMessage(err, 'Failed to load services.');
        },
      });
  }

  get filteredServices(): Service[] {
    if (this.activeFilter === 'all') return this.services;
    return this.services.filter((s) => this.getCategory(s) === this.activeFilter);
  }

  setFilter(filter: ServiceFilter) {
    this.activeFilter = filter;
  }

  bookService(serviceId: string) {
    if (this.auth.isLoggedIn() && this.auth.getRole() === 'customer') {
      this.router.navigate(['/customer/book', serviceId]);
      return;
    }
    this.router.navigate(['/login']);
  }

  private getCategory(service: Service): 'maintenance' | 'repair' {
    const name = service.name.toLowerCase();
    const repairKeywords = ['brake', 'engine', 'diagnostic', 'repair'];
    return repairKeywords.some((k) => name.includes(k)) ? 'repair' : 'maintenance';
  }
}
