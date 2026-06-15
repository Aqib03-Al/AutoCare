import { Component, inject, OnInit } from '@angular/core';
import { DatePipe } from '@angular/common';
import { finalize } from 'rxjs';
import { UserService } from '../../core/services/user.service';
import { User } from '../../core/models/user.model';
import { getApiErrorMessage } from '../../shared/utils/form.utils';

@Component({
  selector: 'app-manage-customers',
  imports: [DatePipe],
  templateUrl: './manage-customers.html',
  styleUrl: './manage-customers.css',
})
export class ManageCustomers implements OnInit {
  private readonly userService = inject(UserService);

  customers: User[] = [];
  loading = true;
  error = '';

  ngOnInit() {
    this.userService
      .getUsers('customer')
      .pipe(finalize(() => (this.loading = false)))
      .subscribe({
        next: (data) => {
          this.customers = data;
        },
        error: (err) => {
          this.error = getApiErrorMessage(err, 'Failed to load customers.');
        },
      });
  }
}
