import { NgClass } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { authUserInterface } from '@auth/interface/auth.inteface';
import { AuthService } from '@auth/services/auth.service';
import { catalogueData } from '@catalogues/catalogueData';
import { SideMenuComponent } from '@utils/side-menu/side-menu.component';
import { sideMenuInterface } from '@utils/side-menu/side-menu.interface';

@Component({
  selector: 'app-general-menu',
  standalone: true,
  imports: [SideMenuComponent, RouterModule, NgClass],
  templateUrl: './general-menu.component.html',
  styleUrl: './general-menu.component.scss',
})
export class GeneralMenuComponent implements OnInit {
  constructor(private auth: AuthService) {}
  ngOnInit(): void {
    this.auth.getObservable().subscribe((res) => {
      this.setPermission(res);
    });
    this.setPermission(this.auth.getAuth());
  }

  setPermission(res: authUserInterface | null) {
    if (!res) {
      this.buttons = [];
      return;
    }
    this.buttons = [
      {
        text: 'Dashboard',
        icon: 'dashboard',
        click: '/session/dashboard',
        show: true,
      },
      {
        text: 'Administrador',
        icon: 'admin_panel_settings',
        show: res?.roles.includes('ADMINISTRATOR'),
        child: [
          {
            text: 'Aerolíneas',
            icon: 'flight',
            click: '/session/airline-home',
            show: true,
          },
          {
            text: 'Aeropuertos',
            icon: 'public',
            click: '/session/airport-home',
            show: true,
          },
          {
            text: 'Usuarios',
            icon: 'people',
            click: '/session/user-home',
            show: true,
          },
          {
            text: 'Catálogos',
            icon: 'list',
            child: [
              ...catalogueData.map((catalogue) => {
                return {
                  text: catalogue.title,
                  icon: 'list',
                  click: `/session/catalogue/${catalogue.name}`,
                  show: true,
                };
              }),
              {
                text: 'Paises',
                icon: 'flag',
                click: '/session/catalogue/country',
                show: true,
              },
            ],
            show: true,
          },
        ],
      },
      {
        text: 'Aerolínea ',
        icon: 'flight',
        show: true,
        child: [
          {
            text: 'Vuelos',
            icon: 'flight',
            click: '/session/vuelo-home',
            show:
              res?.roles.includes('ADMINISTRATOR_AIRLINE') ||
              res?.roles.includes('ADMINISTRATOR'),
          },
          {
            text: 'Aviones',
            icon: 'airplanemode_active',
            click: '/session/plane-home',
            show:
              res?.roles.includes('ADMINISTRATOR_AIRLINE') ||
              res?.roles.includes('ADMINISTRATOR'),
          },
          {
            text: 'Tripulación',
            icon: 'people',
            click: '/session/crew',
            show:
              res?.roles.includes('ADMINISTRATOR_AIRLINE') ||
              res?.roles.includes('ADMINISTRATOR'),
          },
          {
            text: 'Personal',
            icon: 'people',
            click: '/session/personal',
            show:
              res?.roles.includes('ADMINISTRATOR_AIRLINE') ||
              res?.roles.includes('ADMINISTRATOR'),
          },

          {
            text: 'Reservar Vuelo',
            icon: 'flight_takeoff',
            click: '/session/searchFlight',
            show: true,
          },
        ],
      },

      {
        text: 'Cerrar sesión',
        icon: 'logout',
        click: () => {
          this.auth.logout();
        },
        show: true,
      },
    ];
  }

  buttons: sideMenuInterface[] = [];
  isCollapsed: boolean = true;
}
