import { aeropuertoDto } from '@airport/interface/aeropuerto.interface';
import { Component, Inject, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  ValidationErrors,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatRadioModule } from '@angular/material/radio';
import { AeropuertoService } from '@airport/services/aeropuerto.service';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { airlineDto } from '@airline/interface/airline.interface';
import { DestinosService } from '../../services/destinos.service';
import {
  destinoCreationDto,
  destinoDto,
} from '../../interfaces/destino.interface';
import { MatListModule } from '@angular/material/list';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-destinations-home',
  standalone: true,
  imports: [
    MatCardModule,
    MatDialogModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatSelectModule,
    MatRadioModule,
    MatButtonModule,
    MatIconModule,
    MatListModule,
  ],
  templateUrl: './destinations-home.component.html',
  styleUrl: './destinations-home.component.scss',
})
export class DestinationsHomeComponent implements OnInit {
  aeropuertos: aeropuertoDto[] = [];
  destinations: destinoDto[] = [];
  origins: destinoDto[] = [];
  aeropuertoValidator(): ValidatorFn {
    return (formGroup: AbstractControl): ValidationErrors | null => {
      const aeropuertoId = formGroup.get('aeropuertoId')?.value;
      const isDestino = formGroup.get('isDestino')?.value;

      if (isDestino === true) {
        const existsInDestinations = this.destinations.some(
          (dest) => dest.aeropuerto.id === aeropuertoId
        );
        return existsInDestinations ? { aeropuertoInDestinations: true } : null;
      } else {
        const existsInOrigins = this.origins.some(
          (origin) => origin.aeropuerto.id === aeropuertoId
        );
        return existsInOrigins ? { aeropuertoInOrigins: true } : null;
      }
    };
  }

  form: FormGroup = this.fb.group(
    {
      aeropuertoId: ['', [Validators.required]],
      isDestino: [true, [Validators.required]],
    },
    {
      validators: this.aeropuertoValidator(),
    }
  );

  constructor(
    private airPortSvc: AeropuertoService,
    private fb: FormBuilder,
    @Inject(MAT_DIALOG_DATA) private data: airlineDto,
    private destinoSvc: DestinosService
  ) {}
  ngOnInit(): void {
    this.airPortSvc
      .get({
        all: true,
      })
      .subscribe((res) => {
        this.aeropuertos = res.items;
      });
    this.destinoSvc
      .get({
        all: true,
        query: {
          aerolineaId: this.data.id,
        },
      })
      .subscribe((res) => {
        this.destinations = res.items.filter((x) => x.isDestino);
        this.origins = res.items.filter((x) => !x.isDestino);
        console.log(this.destinations);
        console.log(this.origins);
      });
  }

  deleteItem(item: destinoDto) {
    this.destinoSvc.delete(item.id).subscribe(() => {
      this.destinations = this.destinations.filter((x) => x.id !== item.id);
    });
  }

  addItem() {
    if (this.form.valid) {
      const data: destinoCreationDto = this.form.value;
      data.aerolineaId = this.data.id;
      this.destinoSvc.modifyDestino(data).subscribe((res) => {
        if (res) {
          const RES_DES: destinoDto = {
            id: res.id,
            aeropuerto: this.aeropuertos.find(
              (x) => x.id === data.aeropuertoId
            )!,
            isDestino: res.isDestino,
            aerolinea: this.data,
          };

          if (res.isDestino) this.destinations.push(RES_DES);
          else this.origins.push(RES_DES);

          Swal.fire('Guardado', 'Registro guardado', 'success');
          this.form.patchValue({
            aeropuertoId: '',
            isDestino: true,
          });
        }
      });
    }
  }
}
