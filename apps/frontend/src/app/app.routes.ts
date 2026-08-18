import { Routes } from '@angular/router';
import { ClusterControlComponent } from './cluster-control/cluster-control.component';
import { PowerControlComponent } from './power-control/power-control.component';

export const routes: Routes = [
    {
      path: 'power',
      component: PowerControlComponent,
      data: {
        roles: ['admin', 'tec'],
        view: 'CLOAK',
        tab: 'POWER'
      },
    },
    {
      path: 'cluster',
      component: ClusterControlComponent,
      data: {
        roles: ['admin', 'sci'],
        view: 'CLOAK',
        tab: 'CLUSTER'
      }
    }
];
