import { Routes } from '@angular/router';
import { AuthComponent } from './auth/auth.component';
import { AuthGuardService as AuthGuard } from './auth/services/auth-guard.service';
import { DashboardComponent } from './dashboard/dashboard.component';

export const routes: Routes = [
    { path: '', pathMatch: 'full', redirectTo: 'auth'},
    { path: 'auth', component: AuthComponent },
    {
      path: 'dashboard',
      component: DashboardComponent,
      canActivate: [AuthGuard],
      data: {
        roles: ['admin', 'tec']
      }
    }
];
