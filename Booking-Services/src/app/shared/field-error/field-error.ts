import { Component, Input } from '@angular/core';
import { AbstractControl } from '@angular/forms';
import { getFieldError } from '../utils/form.utils';

@Component({
  selector: 'app-field-error',
  imports: [],
  template: `@if (message) {
    <div class="invalid-feedback d-block">{{ message }}</div>
  }`,
})
export class FieldError {
  @Input({ required: true }) control!: AbstractControl | null;
  @Input({ required: true }) label!: string;
  @Input() submitted = false;

  get message(): string | null {
    if (!this.control?.errors) return null;
    if (!(this.control.touched || this.control.dirty || this.submitted)) return null;
    return getFieldError(this.control, this.label);
  }
}
