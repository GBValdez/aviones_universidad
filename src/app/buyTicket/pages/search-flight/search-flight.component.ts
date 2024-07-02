import { Component, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatSelectModule } from '@angular/material/select';
import { aeropuertoDto } from '@airport/interface/aeropuerto.interface';
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
import { DatePipe, NgClass } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AeropuertoService } from '@airport/services/aeropuerto.service';
import { LocalTimezonePipe } from '@utils/pipes/local-timezone-pipe.pipe';

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
    NgClass,
  ],
    providers: [LocalTimezonePipe]
  ,
  templateUrl: './search-flight.component.html',
  styleUrl: './search-flight.component.scss',
})
export class SearchFlightComponent implements OnInit {
  constructor(
    private aeropuertoSvc: AeropuertoService,
    private fb: FormBuilder,
    private vueloSvc: VueloService,
    private localTimezonePipe: LocalTimezonePipe,
  ) {}
  currentDate = new Date();
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
        all: true,
      })
      .subscribe((vuelos) => {
        this.vuelos = vuelos.items;
        vuelos.items.forEach((vuelo) => {
          vuelo.fechaLlegada = new Date(this.localTimezonePipe.transform(vuelo.fechaLlegada.toString()));
          vuelo.fechaSalida = new Date(this.localTimezonePipe.transform(vuelo.fechaSalida.toString()));

        });
      });
  }
}
