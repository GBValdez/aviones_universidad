import { Route, Routes } from '@angular/router';
import { AuthGuard } from '@auth/guards/auth.guard';
import { catalogueData } from '@catalogues/catalogueData';
import { planePageExitGuard } from '@plane/guard/plane-page-exit.guard';

const createRouteCatalogue = (title: string, name: string): Route => {
  return {
    path: `catalogue/${name}`,
    loadComponent: () =>
      import(`@catalogues/catalogues-home/catalogues-home.component`).then(
        (m) => m.CataloguesHomeComponent
      ),
    canActivate: [AuthGuard],
    data: {
      isProtect: 20,
      roles: ['ADMINISTRATOR'],
      titleShow: title,
      typeCatalogue: name,
    },
    title: title,
  };
};
const CATALOGUE_ROUTE = catalogueData.map((catalogue) =>
  createRouteCatalogue(catalogue.title, catalogue.name)
);

export const routes: Routes = [
  {
    path: 'login',
    loadComponent: () =>
      import('@auth/pages/home/home.component').then((m) => m.HomeComponent),
    data: { isProtect: 30 },
    canActivate: [AuthGuard],
    title: 'Iniciar sesión',
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
    path: 'plane/:id',
    loadComponent: () =>
      import('@plane/pages/plane-page/plane-page.component').then(
        (m) => m.PlanePageComponent
      ),
    canActivate: [AuthGuard],
    data: { isProtect: 20, roles: ['ADMINISTRATOR', 'ADMINISTRATOR_AIRLINE'] },
    title: 'Avión',
  },
  {
    path: 'buyTicket/:id',
    loadComponent: () =>
      import('@buyTicket/pages/buy-ticket/buy-ticket.component').then(
        (m) => m.BuyTicketComponent
      ),
    canActivate: [AuthGuard],
    data: { isProtect: 20, roles: ['userNormal'] },
    // canDeactivate: [planePageExitGuard],
    title: 'Comprar boleto',
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
        data: { isProtect: 20, roles: ['userNormal'] },
        title: 'Buscar vuelo',
      },
      {
        path: 'dashboard',
        loadComponent: () =>
          import('@user/pages/dashboard/dashboard.component').then(
            (m) => m.DashboardComponent
          ),
        canActivate: [AuthGuard],
        data: { isProtect: 20 },
        title: 'Dashboard',
      },
      {
        path: 'airline-section',
        loadComponent: () =>
          import(
            '@airlineSection/airline-section/airline-section.component'
          ).then((m) => m.AirlineSectionComponent),
        children: [
          {
            path: 'vuelo-home',
            loadComponent: () =>
              import('@vuelo/pages/vuelo-home/vuelo-home.component').then(
                (m) => m.VueloHomeComponent
              ),
            canActivate: [AuthGuard],
            data: {
              isProtect: 20,
              roles: ['ADMINISTRATOR', 'ADMINISTRATOR_AIRLINE'],
            },
          },
          {
            path: 'plane-home',
            loadComponent: () =>
              import('@plane/pages/avion-home/avion-home.component').then(
                (m) => m.AvionHomeComponent
              ),
            canActivate: [AuthGuard],
            data: {
              isProtect: 20,
              roles: ['ADMINISTRATOR', 'ADMINISTRATOR_AIRLINE'],
            },
          },
          {
            path: 'crew',
            loadComponent: () =>
              import('@crew/pages/crew/crew.component').then(
                (m) => m.CrewComponent
              ),
            canActivate: [AuthGuard],
            data: {
              isProtect: 20,
              roles: ['ADMINISTRATOR', 'ADMINISTRATOR_AIRLINE'],
            },
          },
          {
            path: 'personal',
            loadComponent: () =>
              import('@crew/pages/personal/personal.component').then(
                (m) => m.PersonalComponent
              ),
            canActivate: [AuthGuard],
            data: {
              isProtect: 20,
              roles: ['ADMINISTRATOR', 'ADMINISTRATOR_AIRLINE'],
            },
          },
        ],
      },
      {
        path: 'catalogue/country',
        loadComponent: () =>
          import('@country/pages/country-home/country-home.component').then(
            (m) => m.CountryHomeComponent
          ),
        canActivate: [AuthGuard],
        data: {
          isProtect: 20,
          roles: ['ADMINISTRATOR'],
        },
      },
      {
        path: 'airline-home',
        loadComponent: () =>
          import('@airline/pages/airline-home/airline-home.component').then(
            (m) => m.AirlineHomeComponent
          ),
        canActivate: [AuthGuard],
        data: {
          isProtect: 20,
          roles: ['ADMINISTRATOR'],
        },
      },
      {
        path: 'airport-home',
        loadComponent: () =>
          import('@airport/pages/airport-home/airport-home.component').then(
            (m) => m.AirportHomeComponent
          ),
        canActivate: [AuthGuard],
        data: {
          isProtect: 20,
          roles: ['ADMINISTRATOR'],
        },
      },
      {
        path: 'user-home',
        loadComponent: () =>
          import('@user/pages/user-home/user-home.component').then(
            (m) => m.UserHomeComponent
          ),
        canActivate: [AuthGuard],
        data: { isProtect: 20, roles: ['ADMINISTRATOR'] },
        title: 'Usuarios',
      },
      {
        path: 'user-home/edit/:userName',
        loadComponent: () =>
          import('@user/pages/user-edit/user-edit.component').then(
            (m) => m.UserEditComponent
          ),
        title: 'Usuarios',
        data: { isProtect: 20, roles: ['ADMINISTRATOR'] },
        canActivate: [AuthGuard],
      },
      ...CATALOGUE_ROUTE,
    ],
  },
  {
    path: '**',
    redirectTo: 'login',
    pathMatch: 'full',
  },
];
