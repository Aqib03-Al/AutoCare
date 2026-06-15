import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { finalize } from 'rxjs';
import { ServiceService } from '../../core/services/service.service';
import { Service } from '../../core/models/service.model';
import { FieldError } from '../../shared/field-error/field-error';
import { getApiErrorMessage, isFieldInvalid, markFormGroupTouched } from '../../shared/utils/form.utils';

@Component({
  selector: 'app-manage-services',
  imports: [ReactiveFormsModule, FieldError],
  templateUrl: './manage-services.html',
  styleUrl: './manage-services.css',
})
export class ManageServices implements OnInit {
  private readonly serviceService = inject(ServiceService);
  private readonly fb = inject(FormBuilder);

  services: Service[] = [];
  loading = true;
  error = '';
  message = '';
  editingId: string | null = null;
  submitted = false;

  form = this.fb.group({
    name: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(100)]],
    description: ['', [Validators.maxLength(500)]],
    price: [null as number | null, [Validators.required, Validators.min(0)]],
    duration: [null as number | null, [Validators.required, Validators.min(1), Validators.max(480)]],
  });

  ngOnInit() {
    this.loadServices();
  }

  invalid(field: string): boolean {
    return isFieldInvalid(this.form.get(field), this.submitted);
  }

  loadServices() {
    this.loading = true;
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

  startEdit(service: Service) {
    this.editingId = service._id;
    this.submitted = false;
    this.form.patchValue({
      name: service.name,
      description: service.description,
      price: service.price,
      duration: service.duration,
    });
  }

  cancelEdit() {
    this.editingId = null;
    this.submitted = false;
    this.form.reset({ name: '', description: '', price: null, duration: null });
  }

  submit() {
    this.submitted = true;
    this.error = '';
    markFormGroupTouched(this.form);

    if (this.form.invalid) return;

    const data = this.form.getRawValue();

    const req = this.editingId
      ? this.serviceService.update(this.editingId, data as { name: string; description?: string; price: number; duration: number })
      : this.serviceService.create(data as { name: string; description?: string; price: number; duration: number });

    req.subscribe({
      next: () => {
        this.message = this.editingId ? 'Service updated successfully.' : 'Service created successfully.';
        this.cancelEdit();
        this.loadServices();
      },
      error: (err) => {
        this.error = getApiErrorMessage(err, 'Failed to save service.');
      },
    });
  }

  deleteService(id: string) {
    if (!confirm('Are you sure you want to deactivate this service?')) return;
    this.serviceService.delete(id).subscribe({
      next: () => {
        this.message = 'Service deactivated successfully.';
        this.loadServices();
      },
      error: (err) => {
        this.error = getApiErrorMessage(err, 'Failed to deactivate service.');
      },
    });
  }
}
