import { Routes } from '@angular/router';
import { AuthGuard } from '@auth/guards/auth.guard';
import { planePageExitGuard } from '@plane/guard/plane-page-exit.guard';

export const routes: Routes = [
  {
    path: 'login',
    loadComponent: () =>
      import('@auth/pages/home/home.component').then((m) => m.HomeComponent),
    data: { isProtect: 30 },
    canActivate: [AuthGuard],
  },
  {
    path: 'user/confirmEmail',
    loadComponent: () =>
      import('@user/pages/user-verify-email/user-verify-email.component').then(
        (m) => m.UserVerifyEmailComponent
      ),
    title: 'Verificar email',
    data: { isProtect: 30 },
    canActivate: [AuthGuard],
  },
  {
    path: 'user/resetPassword/:gmail/:token',
    loadComponent: () =>
      import('@user/pages/reset-password/reset-password.component').then(
        (m) => m.ResetPasswordComponent
      ),
    title: 'Reiniciar contraseña',
    data: { isProtect: 30 },
    canActivate: [AuthGuard],
  },
  {
    path: 'session',
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
        canActivate: [AuthGuard],
        data: { isProtect: 20 },
      },
      {
        path: 'buyTicket/:id',
        loadComponent: () =>
          import('@buyTicket/pages/buy-ticket/buy-ticket.component').then(
            (m) => m.BuyTicketComponent
          ),
        canActivate: [AuthGuard],
        data: { isProtect: 20 },
        // canDeactivate: [planePageExitGuard],
      },
      {
        path: 'dashboard',
        loadComponent: () =>
          import('@user/pages/dashboard/dashboard.component').then(
            (m) => m.DashboardComponent
          ),
        canActivate: [AuthGuard],
        data: { isProtect: 20 },
      },
      {
        path: 'plane/:id',
        loadComponent: () =>
          import('@plane/pages/plane-page/plane-page.component').then(
            (m) => m.PlanePageComponent
          ),
        canDeactivate: [planePageExitGuard],
        canActivate: [AuthGuard],
        data: { isProtect: 20 },
      },
    ],
  },
];
