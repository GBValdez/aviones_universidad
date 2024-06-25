import { AirlineSectSvcService } from '@airlineSection/services/AirlineSectSvc.service';
import { aeropuertoDto } from '@airport/interface/aeropuerto.interface';
import { TextFieldModule } from '@angular/cdk/text-field';
import { Component, Inject } from '@angular/core';
import {
  AbstractControl,
  FormArray,
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  ValidationErrors,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDatepickerModule } from '@angular/material/datepicker';
import {
  MAT_DIALOG_DATA,
  MatDialogModule,
  MatDialogRef,
} from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { vueloDto } from '@buyTicket/interfaces/vuelo.interface';
import { VueloService } from '@buyTicket/services/vuelo.service';
import { CatalogueService } from '@catalogues/services/catalogue.service';
import { avionDto } from '@plane/interfaces/avion.interface';
import { PlaneService } from '@plane/services/plane.service';
import { catalogueInterface } from '@utils/commons.interface';
import { OnlyNumberInputDirective } from '@utils/directivas/only-number-input.directive';
import moment, { Moment } from 'moment';
import { destinoDto } from 'src/app/destinations/interfaces/destino.interface';
import { DestinosService } from 'src/app/destinations/services/destinos.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-vuelo-form',
  standalone: true,
  imports: [
    MatCardModule,
    ReactiveFormsModule,
    MatInputModule,
    MatButtonModule,
    MatFormFieldModule,
    MatDialogModule,
    TextFieldModule,
    MatDatepickerModule,
    MatSelectModule,
    OnlyNumberInputDirective,
  ],
  templateUrl: './vuelo-form.component.html',
  styleUrl: './vuelo-form.component.scss',
})
export class VueloFormComponent {
  dataItem?: vueloDto;
  destinos: destinoDto[] = [];
  origen: destinoDto[] = [];
  aviones: avionDto[] = [];
  sections: catalogueInterface[] = [];
  dateTimeValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const fechaSalida: Moment | undefined = control.get('fechaSalida')?.value;
      const horaSalida: string | undefined = control.get('horaSalida')?.value;
      const fechaLlegada: Moment | undefined =
        control.get('fechaLlegada')?.value;
      const horaLlegada: string | undefined = control.get('horaLlegada')?.value;
      if (!fechaSalida || !horaSalida || !fechaLlegada || !horaLlegada) {
        return null; // If any field is empty, we don't apply the validation
      }

      const salida = moment.isMoment(fechaSalida)
        ? fechaSalida.toDate()
        : fechaSalida;
      salida.setHours(
        Number(horaSalida.split(':')[0]),
        Number(horaSalida.split(':')[1])
      );
      const llegada = moment.isMoment(fechaLlegada)
        ? fechaLlegada.toDate()
        : fechaLlegada;
      llegada.setHours(
        Number(horaLlegada.split(':')[0]),
        Number(horaLlegada.split(':')[1])
      );
      const NOW = new Date();
      if (salida < NOW || llegada < NOW) {
        return { dateNowTimeInvalid: true };
      }
      return salida >= llegada ? { dateTimeInvalid: true } : null;
    };
  }

  airportValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const origen: number | undefined =
        control.get('aeropuertoOrigenId')?.value;
      const destino: number | undefined = control.get(
        'aeropuertoDestinoId'
      )?.value;
      if (!origen || !destino) {
        return null;
      }
      return origen === destino ? { airportInvalid: true } : null;
    };
  }

  form: FormGroup = this.fb.group(
    {
      codigo: [
        '',
        Validators.compose([Validators.required, Validators.maxLength(50)]),
      ],
      fechaSalida: ['', Validators.required],
      fechaLlegada: ['', Validators.required],
      aeropuertoDestinoId: ['', Validators.required],
      aeropuertoOrigenId: ['', Validators.required],
      avionId: ['', Validators.required],
      vueloClases: this.fb.array([]),

      horaSalida: ['', Validators.required],
      horaLlegada: ['', Validators.required],
    },
    {
      validators: [this.dateTimeValidator(), this.airportValidator()],
    }
  );
  constructor(
    @Inject(MAT_DIALOG_DATA) private data: vueloDto,
    private fb: FormBuilder,
    private dataSvc: VueloService,
    private dialogRef: MatDialogRef<VueloFormComponent>,
    private destinosSvc: DestinosService,
    private avionSvc: PlaneService,
    private catalogueSvc: CatalogueService,
    private airLineSecSvc: AirlineSectSvcService
  ) {}

  get formClases(): FormArray {
    return this.form.get('vueloClases') as FormArray;
  }
  showNameSectionById(id: number): string {
    return this.sections.find((section) => section.id === id)!.name;
  }
  toFormGroup(data: any): FormGroup {
    return data as FormGroup;
  }

  ngOnInit(): void {
    this.dataItem = this.data;
    if (this.dataItem) {
      this.form.patchValue(this.data);
      this.form.patchValue({
        fechaSalida: moment(this.dataItem.fechaSalida),
        fechaLlegada: moment(this.dataItem.fechaLlegada),
        horaSalida: moment(this.dataItem.fechaSalida).format('HH:mm'),
        horaLlegada: moment(this.dataItem.fechaLlegada).format('HH:mm'),
        aeropuertoDestinoId: this.dataItem.aeropuertoDestino.id,
        aeropuertoOrigenId: this.dataItem.aeropuertoOrigen.id,
        avionId: this.dataItem.avion.id,
      });
    }
    this.destinosSvc
      .get({
        all: true,
        query: {
          aerolineaId: this.airLineSecSvc.getCurrentAirline()?.id,
        },
      })
      .subscribe((res) => {
        this.destinos = res.items.filter((dest) => dest.isDestino);
        this.origen = res.items.filter((dest) => !dest.isDestino);
      });
    this.avionSvc
      .get({
        all: true,
        query: {
          aerolineaId: this.airLineSecSvc.getCurrentAirline()?.id,
        },
      })
      .subscribe((res) => {
        this.aviones = res.items;
      });
    this.catalogueSvc
      .get('CAA', 1, 1, {
        all: true,
      })
      .subscribe((res) => {
        res.items.forEach((section) => {
          const PREVIEW = this.dataItem?.vueloClases.find(
            (x) => x.clase.id === section.id
          );
          const PRECIO = PREVIEW ? PREVIEW.precio : 0;
          const CONTROL = this.fb.group({
            claseId: [section.id],
            precio: [PRECIO, [Validators.required, Validators.min(0.01)]],
          });
          const control = this.form.controls['vueloClases'] as FormArray;
          control.push(CONTROL);
          console.log('control', control);
        });
        this.sections = res.items;
      });
  }
  cleanForm() {
    console.log('cleanForm', this.form.value);
    this.form.patchValue({
      codigo: '',
      fechaSalida: '',
      fechaLlegada: '',
      aeropuertoDestinoId: '',
      aeropuertoOrigenId: '',
      avionId: '',
      horaSalida: '',
      horaLlegada: '',
    });
    this.form.markAllAsTouched();
  }
  async onSubmit() {
    if (this.form.valid) {
      const result = Swal.fire({
        title: '¿Quieres guardar los cambios?',
        showCancelButton: true,
        confirmButtonText: `Guardar`,
        icon: 'question',
      });
      if ((await result).isConfirmed) {
        const DATA = this.form.value;
        const FECHA_SALIDA = moment.isMoment(DATA.fechaSalida)
          ? DATA.fechaSalida.toDate()
          : DATA.fechaSalida;
        const FECHA_LLEGADA = moment.isMoment(DATA.fechaLlegada)
          ? DATA.fechaLlegada.toDate()
          : DATA.fechaLlegada;
        FECHA_SALIDA.setHours(
          Number(DATA.horaSalida.split(':')[0]),
          Number(DATA.horaSalida.split(':')[1])
        );
        FECHA_LLEGADA.setHours(
          Number(DATA.horaLlegada.split(':')[0]),
          Number(DATA.horaLlegada.split(':')[1])
        );
        DATA.fechaSalida = FECHA_SALIDA;
        DATA.fechaLlegada = FECHA_LLEGADA;
        console.log('DATA', DATA);
        if (this.dataItem) {
          this.dataSvc.put(this.dataItem.id!, DATA).subscribe((res) => {
            this.closeDialog();
          });
        } else {
          this.dataSvc.post(DATA).subscribe((res) => {
            this.closeDialog();
          });
        }
      }
    }
  }

  async closeDialog() {
    await Swal.fire({
      title: 'La operación se realizo con éxito',
      icon: 'success',
      confirmButtonText: `Aceptar`,
    });
    this.dialogRef.close({
      modify: true,
    });
  }
}
