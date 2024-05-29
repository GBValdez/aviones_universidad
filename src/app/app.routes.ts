import { Routes } from '@angular/router';
import { planePageExitGuard } from '@plane/guard/plane-page-exit.guard';

export const routes: Routes = [
  {
    path: 'plane/:id',
    loadComponent: () =>
      import('@plane/pages/plane-page/plane-page.component').then(
        (m) => m.PlanePageComponent
      ),
    canDeactivate: [planePageExitGuard],
  },
  {
    path: 'buyTicket/:id',
    loadComponent: () =>
      import('@buyTicket/pages/buy-ticket/buy-ticket.component').then(
        (m) => m.BuyTicketComponent
      ),
    canDeactivate: [planePageExitGuard],
  },
  {
    path: '**',
    redirectTo: 'plane',
    pathMatch: 'full',
  },
];
