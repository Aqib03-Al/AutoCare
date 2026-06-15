import { Injectable, inject } from '@angular/core';
import { ApiService } from './api.service';
import { Service, ServiceRequest } from '../models/service.model';

@Injectable({ providedIn: 'root' })
export class ServiceService {
  private readonly api = inject(ApiService);

  getAll() {
    return this.api.get<Service[]>('/services');
  }

  getPublic() {
    return this.api.get<Service[]>('/services/public');
  }

  create(data: ServiceRequest) {
    return this.api.post<Service>('/services', data);
  }

  update(id: string, data: Partial<ServiceRequest>) {
    return this.api.put<Service>(`/services/${id}`, data);
  }

  delete(id: string) {
    return this.api.delete<{ message: string; service: Service }>(`/services/${id}`);
  }
}
