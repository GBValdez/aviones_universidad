import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'plane',
    loadComponent: () =>
      import('@plane/pages/plane-page/plane-page.component').then(
        (m) => m.PlanePageComponent
      ),
  },
  {
    path: '**',
    redirectTo: 'plane',
    pathMatch: 'full',
  },
];
