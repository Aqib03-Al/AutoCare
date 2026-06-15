import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { FieldError } from '../../shared/field-error/field-error';
import { getApiErrorMessage, isFieldInvalid, markFormGroupTouched } from '../../shared/utils/form.utils';

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule, RouterLink, FieldError],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {
  private readonly fb = inject(FormBuilder);
  private readonly auth = inject(AuthService);

  error = '';
  loading = false;
  submitted = false;

  form = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]],
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
    this.auth.login(this.form.getRawValue() as { email: string; password: string }).subscribe({
      next: () => {
        this.loading = false;
        this.auth.redirectByRole();
      },
      error: (err) => {
        this.loading = false;
        this.error = getApiErrorMessage(err, 'Login failed. Please try again.');
      },
    });
  }
}
