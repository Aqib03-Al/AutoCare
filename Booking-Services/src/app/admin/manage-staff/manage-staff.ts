import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { finalize } from 'rxjs';
import { UserService } from '../../core/services/user.service';
import { User } from '../../core/models/user.model';
import { FieldError } from '../../shared/field-error/field-error';
import { getApiErrorMessage, isFieldInvalid, markFormGroupTouched } from '../../shared/utils/form.utils';

@Component({
  selector: 'app-manage-staff',
  imports: [ReactiveFormsModule, FieldError],
  templateUrl: './manage-staff.html',
  styleUrl: './manage-staff.css',
})
export class ManageStaff implements OnInit {
  private readonly userService = inject(UserService);
  private readonly fb = inject(FormBuilder);

  staff: User[] = [];
  loading = true;
  error = '';
  message = '';
  submitted = false;

  form = this.fb.group({
    name: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(80)]],
    email: ['', [Validators.required, Validators.email]],
    phone: ['', [Validators.pattern(/^[0-9+\-\s()]{7,20}$/)]],
    password: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(64)]],
  });

  ngOnInit() {
    this.loadStaff();
  }

  invalid(field: string): boolean {
    return isFieldInvalid(this.form.get(field), this.submitted);
  }

  loadStaff() {
    this.loading = true;
    this.error = '';
    this.userService
      .getUsers('staff')
      .pipe(finalize(() => (this.loading = false)))
      .subscribe({
        next: (data) => {
          this.staff = data;
        },
        error: (err) => {
          this.error = getApiErrorMessage(err, 'Failed to load staff accounts.');
        },
      });
  }

  submit() {
    this.submitted = true;
    this.error = '';
    markFormGroupTouched(this.form);

    if (this.form.invalid) return;

    this.userService
      .createStaff(this.form.getRawValue() as { name: string; email: string; password: string; phone?: string })
      .subscribe({
        next: (user) => {
          this.message = 'Staff account created successfully.';
          this.submitted = false;
          this.form.reset();
          this.staff = [user, ...this.staff.filter((s) => s._id !== user._id)];
        },
        error: (err) => {
          this.error = getApiErrorMessage(err, 'Failed to create staff account.');
        },
      });
  }

  deactivate(id: string) {
    if (!confirm('Are you sure you want to deactivate this staff account?')) return;
    this.userService.deactivate(id).subscribe({
      next: () => {
        this.message = 'Staff account deactivated successfully.';
        this.loadStaff();
      },
      error: (err) => {
        this.error = getApiErrorMessage(err, 'Failed to deactivate staff account.');
      },
    });
  }
}
