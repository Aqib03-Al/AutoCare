import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { FieldError } from '../../shared/field-error/field-error';
import { isFieldInvalid, markFormGroupTouched } from '../../shared/utils/form.utils';

@Component({
  selector: 'app-contact-us',
  imports: [ReactiveFormsModule, FieldError],
  templateUrl: './contact-us.html',
  styleUrl: './contact-us.css',
})
export class ContactUs {
  private readonly fb = inject(FormBuilder);

  submitted = false;
  sent = false;

  form = this.fb.group({
    name: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(80)]],
    email: ['', [Validators.required, Validators.email]],
    subject: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(120)]],
    message: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(1000)]],
  });

  invalid(field: string): boolean {
    return isFieldInvalid(this.form.get(field), this.submitted);
  }

  submit() {
    this.submitted = true;
    markFormGroupTouched(this.form);

    if (this.form.invalid) return;

    this.sent = true;
    this.submitted = false;
    this.form.reset();
  }
}
