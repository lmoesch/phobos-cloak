import { Routes } from '@angular/router';
import { ClusterControlComponent } from './cluster-control/cluster-control.component';
import { PowerControlComponent } from './power-control/power-control.component';

export const routes: Routes = [
    {
      path: 'power',
      component: PowerControlComponent,
      canActivate: [],
    },
    {
      path: 'cluster',
      component: ClusterControlComponent,
      canActivate: [],
      data: {
        roles: ['admin', 'tec']
      }
    }
];
