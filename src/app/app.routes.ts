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
    path: 'user',
    loadComponent: () =>
      import('@user/pages/general-menu/general-menu.component').then(
        (m) => m.GeneralMenuComponent
      ),
    children: [
      {
        path: 'searchFlight',
        loadComponent: () =>
          import('@buyTicket/pages/search-flight/search-flight.component').then(
            (m) => m.SearchFlightComponent
          ),
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
        path: 'dashboard',
        loadComponent: () =>
          import('@user/pages/dashboard/dashboard.component').then(
            (m) => m.DashboardComponent
          ),
      },
    ],
  },

  {
    path: '**',
    redirectTo: 'user/dashboard',
    pathMatch: 'full',
  },
];
