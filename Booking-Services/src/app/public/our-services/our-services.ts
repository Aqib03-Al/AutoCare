import { Component, inject, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { finalize } from 'rxjs';
import { ServiceService } from '../../core/services/service.service';
import { Service } from '../../core/models/service.model';
import { getApiErrorMessage } from '../../shared/utils/form.utils';

@Component({
  selector: 'app-our-services',
  imports: [RouterLink],
  templateUrl: './our-services.html',
  styleUrl: './our-services.css',
})
export class OurServices implements OnInit {
  private readonly serviceService = inject(ServiceService);

  services: Service[] = [];
  loading = true;
  error = '';

  ngOnInit() {
    this.serviceService
      .getPublic()
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
}
