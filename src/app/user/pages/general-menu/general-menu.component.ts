import { NgClass } from '@angular/common';
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AuthService } from '@auth/services/auth.service';
import { SideMenuComponent } from '@utils/side-menu/side-menu.component';
import { sideMenuInterface } from '@utils/side-menu/side-menu.interface';

@Component({
  selector: 'app-general-menu',
  standalone: true,
  imports: [SideMenuComponent, RouterModule, NgClass],
  templateUrl: './general-menu.component.html',
  styleUrl: './general-menu.component.scss',
})
export class GeneralMenuComponent {
  constructor(private auth: AuthService) {}

  buttons: sideMenuInterface[] = [
    {
      text: 'Dashboard',
      icon: 'dashboard',
      click: '/session/dashboard',
      show: true,
    },
    {
      text: 'Vuelos ',
      icon: 'flight',
      click: 'flights',
      show: true,
      child: [
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
  isCollapsed: boolean = true;
}
