import { NgClass } from '@angular/common';
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
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
  buttons: sideMenuInterface[] = [
    {
      text: 'Dashboard',
      icon: 'dashboard',
      click: '/user/dashboard',
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
          click: '/user/searchFlight',
          show: true,
        },
      ],
    },
    { text: 'Logout', icon: 'logout', click: 'logout', show: true },
  ];
  isCollapsed: boolean = true;
}
