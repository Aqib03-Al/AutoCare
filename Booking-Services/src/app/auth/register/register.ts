import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { FieldError } from '../../shared/field-error/field-error';
import { getApiErrorMessage, isFieldInvalid, markFormGroupTouched } from '../../shared/utils/form.utils';

@Component({
  selector: 'app-register',
  imports: [ReactiveFormsModule, RouterLink, FieldError],
  templateUrl: './register.html',
  styleUrl: './register.css',
})
export class Register {
  private readonly fb = inject(FormBuilder);
  private readonly auth = inject(AuthService);

  error = '';
  loading = false;
  submitted = false;

  form = this.fb.group({
    name: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(80)]],
    email: ['', [Validators.required, Validators.email]],
    phone: ['', [Validators.pattern(/^[0-9+\-\s()]{7,20}$/)]],
    password: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(64)]],
  });

  invalid(field: string): boolean {
    return isFieldInvalid(this.form.get(field), this.submitted);
  }

  submit() {
    this.submitted = true;
    this.error = '';
    markFormGroupTouched(this.form);

    if (this.form.invalid) return;

    this.loading = true;
    this.auth.register(this.form.getRawValue() as { name: string; email: string; password: string; phone?: string }).subscribe({
      next: () => {
        this.loading = false;
        this.auth.redirectByRole();
      },
      error: (err) => {
        this.loading = false;
        this.error = getApiErrorMessage(err, 'Registration failed. Please try again.');
      },
    });
  }
}
