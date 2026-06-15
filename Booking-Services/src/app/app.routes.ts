import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';
import { roleGuard } from './core/guards/role.guard';
import { PublicLayout } from './layout/public-layout/public-layout';
import { MainLayout } from './layout/main-layout/main-layout';
import { Home } from './public/home/home';
import { AboutUs } from './public/about-us/about-us';
import { OurServices } from './public/our-services/our-services';
import { ContactUs } from './public/contact-us/contact-us';
import { Login } from './auth/login/login';
import { Register } from './auth/register/register';
import { Customer } from './customer/customer/customer';
import { CustomerDashboard } from './customer/customer-dashboard/customer-dashboard';
import { ServiceList } from './customer/service-list/service-list';
import { BookService } from './customer/book-service/book-service';
import { MyBookings } from './customer/my-bookings/my-bookings';
import { StaffDashboard } from './staff/staff-dashboard/staff-dashboard';
import { PendingBookings } from './staff/pending-bookings/pending-bookings';
import { AllBookings } from './staff/all-bookings/all-bookings';
import { AdminDashboard } from './admin/admin-dashboard/admin-dashboard';
import { ManageServices } from './admin/manage-services/manage-services';
import { ManageStaff } from './admin/manage-staff/manage-staff';
import { ManageCustomers } from './admin/manage-customers/manage-customers';
import { Analytics } from './admin/analytics/analytics';

export const routes: Routes = [
  {
    path: '',
    component: PublicLayout,
    children: [
      { path: '', component: Home },
      { path: 'about', component: AboutUs },
      { path: 'our-services', component: OurServices },
      { path: 'contact', component: ContactUs },
      { path: 'login', component: Login },
      { path: 'register', component: Register },
    ],
  },
  {
    path: 'customer',
    component: MainLayout,
    canActivate: [authGuard, roleGuard('customer')],
    children: [
      {
        path: '',
        component: Customer,
        children: [
          { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
          { path: 'dashboard', component: CustomerDashboard },
          { path: 'services', component: ServiceList },
          { path: 'book/:serviceId', component: BookService },
          { path: 'bookings', component: MyBookings },
        ],
      },
    ],
  },
  {
    path: 'staff',
    component: MainLayout,
    canActivate: [authGuard, roleGuard('staff', 'admin')],
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      { path: 'dashboard', component: StaffDashboard },
      { path: 'pending', component: PendingBookings },
      { path: 'bookings', component: AllBookings },
    ],
  },
  {
    path: 'admin',
    component: MainLayout,
    canActivate: [authGuard, roleGuard('admin')],
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      { path: 'dashboard', component: AdminDashboard },
      { path: 'services', component: ManageServices },
      { path: 'staff', component: ManageStaff },
      { path: 'customers', component: ManageCustomers },
      { path: 'analytics', component: Analytics },
    ],
  },
  { path: '**', redirectTo: '' },
];
