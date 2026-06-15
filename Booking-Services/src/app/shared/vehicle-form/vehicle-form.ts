import { Component, Input } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { FieldError } from '../field-error/field-error';
import { isFieldInvalid } from '../utils/form.utils';

export const currentVehicleYear = new Date().getFullYear();

@Component({
  selector: 'app-vehicle-form',
  imports: [ReactiveFormsModule, FieldError],
  templateUrl: './vehicle-form.html',
  styleUrl: './vehicle-form.css',
})
export class VehicleForm {
  @Input({ required: true }) form!: FormGroup;
  @Input() submitted = false;

  readonly maxYear = currentVehicleYear + 1;

  invalid(field: string): boolean {
    return isFieldInvalid(this.form.get(field), this.submitted);
  }
}
