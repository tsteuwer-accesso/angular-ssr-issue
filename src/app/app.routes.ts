import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'route-1',
    loadComponent: () => import('./route-1/route-1.component').then(m => m.Route1Component)
  },
  {
    path: 'route-2',
    loadComponent: () => import('./route-2/route-2.component').then(m => m.Route2Component)
  },
];
