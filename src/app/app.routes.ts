import { Routes } from '@angular/router';

import { MainLayoutComponent } from './core/layouts/main-layout/main-layout.component';
import { DashboardPage } from './features/dashboard/dashboard.page';
import { LibraryPage } from './features/library/library.page';
import { LoansPage } from './features/loans/loans.page';

export const routes: Routes = [
  {
    path: '',
    component: MainLayoutComponent,
    children: [
      { path: '', pathMatch: 'full', redirectTo: 'dashboard' },
      { path: 'dashboard', component: DashboardPage },
      { path: 'library', component: LibraryPage },
      { path: 'loans', component: LoansPage }
    ]
  },
  { path: '**', redirectTo: '' }
];
