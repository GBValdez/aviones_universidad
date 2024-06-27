import { airlineDto } from '@airline/interface/airline.interface';
import { AirlineService } from '@airline/services/airline.service';
import { AirlineSectSvcService } from '@airlineSection/services/AirlineSectSvc.service';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { RouterModule } from '@angular/router';
import { AuthService } from '@auth/services/auth.service';
import { LocalStorageService } from '@utils/local-storage.service';

@Component({
  selector: 'app-airline-section',
  standalone: true,
  imports: [RouterModule, MatSelectModule, MatFormFieldModule, FormsModule],
  templateUrl: './airline-section.component.html',
  styleUrl: './airline-section.component.scss',
})
export class AirlineSectionComponent implements OnInit {
  constructor(
    private authSvc: AuthService,
    private airlineSvc: AirlineService,
    private localStorageSvc: LocalStorageService,
    private airlineSecSvc: AirlineSectSvcService
  ) {}
  aerolineaCurrent?: airlineDto = undefined;
  isAdmin: boolean = false;
  airlineList: airlineDto[] = [];
  ngOnInit(): void {
    this.isAdmin = this.authSvc.hasRoles(['ADMINISTRATOR']);
    if (this.isAdmin) this.getAirlines();
  }

  getAirlines() {
    this.airlineSvc.get({ all: true }).subscribe((res) => {
      this.airlineList = res.items;
      if (this.airlineSecSvc.getCurrentAirline() != undefined) {
        const airline = this.airlineSecSvc.getCurrentAirline();
        const INDEX: number = this.airlineList.findIndex(
          (x) => x.id == airline?.id
        );
        if (INDEX != -1) this.aerolineaCurrent = this.airlineList[INDEX];
      }
    });
  }
  selectAirline() {
    this.airlineSecSvc.setCurrentAirline(this.aerolineaCurrent);
  }
}
