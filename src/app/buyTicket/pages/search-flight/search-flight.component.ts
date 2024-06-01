import { Component, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatSelectModule } from '@angular/material/select';
import { AeropuertoService } from '@buyTicket/services/aeropuerto.service';
import { aeropuertoDto } from '@buyTicket/interfaces/aeropuerto.interface';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { VueloService } from '@buyTicket/services/vuelo.service';
import { vueloDto } from '@buyTicket/interfaces/vuelo.interface';
import { formIsEmptyValidator, validateFieldEmpty } from '@utils/utils';
import { MatCardModule } from '@angular/material/card';
import { DatePipe } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-search-flight',
  standalone: true,
  imports: [
    MatButtonModule,
    MatInputModule,
    MatFormFieldModule,
    MatDatepickerModule,
    MatSelectModule,
    ReactiveFormsModule,
    MatCardModule,
    DatePipe,
    RouterModule,
  ],
  templateUrl: './search-flight.component.html',
  styleUrl: './search-flight.component.scss',
})
export class SearchFlightComponent implements OnInit {
  constructor(
    private aeropuertoSvc: AeropuertoService,
    private fb: FormBuilder,
    private vueloSvc: VueloService
  ) {}
  ngOnInit(): void {
    this.aeropuertoSvc.get({ all: true }).subscribe((aeropuertos) => {
      this.listAeropuerto = aeropuertos.items;
    });
    this.foundFlight();
  }
  listAeropuerto: aeropuertoDto[] = [];
  form: FormGroup = this.fb.group(
    {
      origen: [''],
      destino: [''],
      fechaSalida: [''],
    },
    { validators: formIsEmptyValidator() }
  );
  vuelos: vueloDto[] = [];
  foundFlight() {
    let QUERY: any = {};
    if (!validateFieldEmpty(this.form, 'origen'))
      QUERY.AeropuertoOrigenId = this.form.value.origen;
    if (!validateFieldEmpty(this.form, 'destino'))
      QUERY.AeropuertoDestinoId = this.form.value.destino;
    if (!validateFieldEmpty(this.form, 'fechaSalida')) {
      const newDate = new Date(this.form.value.fechaSalida);
      QUERY.FechaSalidaGreat = newDate.toISOString();
      newDate.setDate(newDate.getDate() + 1);
      QUERY.FechaSalidaSmall = newDate.toISOString();
    }
    this.vueloSvc
      .get({
        query: QUERY,
        pageNumber: 1,
        pageSize: 10,
      })
      .subscribe((vuelos) => {
        this.vuelos = vuelos.items;
      });
  }
}
