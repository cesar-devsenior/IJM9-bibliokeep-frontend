import { Routes } from '@angular/router';

import { MainLayoutComponent } from './core/layouts/main-layout/main-layout.component';
import { DashboardPage } from './features/dashboard/dashboard.page';
import { LibraryPage } from './features/library/library.page';
import { LoansPage } from './features/loans/loans.page';
import { Login } from './features/login/login';
import { authGuard } from './core/guard/auth-guard';
import { adminGuard } from './core/guard/admin-guard';

export const routes: Routes = [
  {
    path: '',
    component: MainLayoutComponent,
    canActivateChild: [authGuard],
    children: [
      { path: '', pathMatch: 'full', redirectTo: 'dashboard' },
      { path: 'dashboard', component: DashboardPage },
      { path: 'library', component: LibraryPage },
      { path: 'loans', component: LoansPage, canActivate: [adminGuard] }
    ]
  },
  {
    path: 'login',
    component: Login
  },
  { path: '**', redirectTo: '' }
];
