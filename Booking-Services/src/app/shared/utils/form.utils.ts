import { AbstractControl, FormGroup } from '@angular/forms';

export function markFormGroupTouched(form: FormGroup): void {
  Object.values(form.controls).forEach((control) => {
    control.markAsTouched();
    if (control instanceof FormGroup) {
      markFormGroupTouched(control);
    }
  });
}

export function isFieldInvalid(control: AbstractControl | null, submitted: boolean): boolean {
  return !!control && control.invalid && (control.touched || control.dirty || submitted);
}

export function getFieldError(control: AbstractControl | null, label: string, submitted = false): string | null {
  if (!control || !control.errors || !(control.touched || control.dirty || submitted)) {
    return null;
  }

  const errors = control.errors;

  if (errors['required']) {
    return `${label} is required.`;
  }
  if (errors['email']) {
    return 'Please enter a valid email address.';
  }
  if (errors['minlength']) {
    return `${label} must be at least ${errors['minlength'].requiredLength} characters.`;
  }
  if (errors['maxlength']) {
    return `${label} must not exceed ${errors['maxlength'].requiredLength} characters.`;
  }
  if (errors['min']) {
    return `${label} must be at least ${errors['min'].min}.`;
  }
  if (errors['max']) {
    return `${label} must not exceed ${errors['max'].max}.`;
  }
  if (errors['pattern']) {
    return `Please enter a valid ${label.toLowerCase()}.`;
  }
  if (errors['yearRange']) {
    return `${label} must be between 1900 and ${new Date().getFullYear() + 1}.`;
  }

  return `${label} is invalid.`;
}

export function getFormValidationSummary(
  form: FormGroup,
  labels: Record<string, string>
): string[] {
  const messages: string[] = [];

  Object.entries(labels).forEach(([field, label]) => {
    const message = getFieldError(form.get(field), label, true);
    if (message) {
      messages.push(message);
    }
  });

  return messages;
}

export function getApiErrorMessage(
  err: { status?: number; error?: { message?: string; errors?: Array<{ msg?: string }> }; name?: string },
  fallback: string
): string {
  if (err.status === 0 || err.name === 'TimeoutError') {
    return 'Unable to connect to the server. Please ensure the backend is running.';
  }
  if (err.status === 400) {
    const validationMessages = err.error?.errors
      ?.map((item) => item.msg)
      .filter((msg): msg is string => !!msg);
    if (validationMessages?.length) {
      return validationMessages.join(' ');
    }
    return err.error?.message || 'Please check your input and try again.';
  }
  if (err.status === 401) {
    return err.error?.message || 'Your session has expired. Please log in again.';
  }
  if (err.status === 403) {
    return err.error?.message || 'You do not have permission to perform this action.';
  }
  if (err.status === 404) {
    const msg = err.error?.message || '';
    if (msg.toLowerCase().includes('route not found')) {
      return 'API route not found. Please restart the backend server (cd backend → npm start) and refresh the page.';
    }
    return msg || 'The requested resource was not found.';
  }
  if (err.status === 500) {
    return err.error?.message || fallback;
  }
  return err.error?.message || fallback;
}
