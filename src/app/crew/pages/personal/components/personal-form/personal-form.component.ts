import { Component, Inject } from '@angular/core';
import { personalDto } from '../../interface/personal.interface';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import {
  MAT_DIALOG_DATA,
  MatDialogModule,
  MatDialogRef,
} from '@angular/material/dialog';
import { PersonalService } from '../../services/personal.service';
import Swal from 'sweetalert2';
import { MatButtonModule } from '@angular/material/button';
import { TextFieldModule } from '@angular/cdk/text-field';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { OnlyNumberInputDirective } from '@utils/directivas/only-number-input.directive';
import { MatSelectModule } from '@angular/material/select';
import { countryDto } from '@country/interfaces/pais.interface';
import { catalogueInterface } from '@utils/commons.interface';
import { CountryService } from '@country/services/country.service';
import { CatalogueService } from '@catalogues/services/catalogue.service';
import moment, { Moment } from 'moment';
import { AirlineSectSvcService } from '@airlineSection/services/AirlineSectSvc.service';

@Component({
  selector: 'app-personal-form',
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
    OnlyNumberInputDirective,
    MatSelectModule,
    MatDialogModule,
  ],
  templateUrl: './personal-form.component.html',
  styleUrl: './personal-form.component.scss',
})
export class PersonalFormComponent {
  countries: countryDto[] = [];
  positions: catalogueInterface[] = [];
  dataItem?: personalDto;
  fechaNacimientoValidator(): ValidatorFn {
    return (control) => {
      if (!control.value) return null;
      const fechaNacimiento = control.value;
      const fechaNacimientoDate = moment.isMoment(fechaNacimiento)
        ? fechaNacimiento.toDate()
        : fechaNacimiento;
      const fechaActual = new Date();
      fechaActual.setFullYear(fechaActual.getFullYear() - 18);
      return fechaNacimientoDate <= fechaActual ? null : { menorDeEdad: true };
    };
  }
  form: FormGroup = this.fb.group({
    nombre: [
      '',
      Validators.compose([Validators.required, Validators.maxLength(50)]),
    ],
    userId: ['', [Validators.required, Validators.pattern('^[a-zA-Z0-9]+$')]],
    fechaNacimiento: [
      null,
      [Validators.required, this.fechaNacimientoValidator()],
    ],
    correo: ['', Validators.compose([Validators.required, Validators.email])],
    direccion: [
      '',
      Validators.compose([Validators.required, Validators.maxLength(255)]),
    ],
    telefono: [
      '',
      Validators.compose([Validators.required, Validators.maxLength(10)]),
    ],
    paisId: [null, Validators.required],
    puestoId: [null, Validators.required],
  });
  constructor(
    @Inject(MAT_DIALOG_DATA) private data: personalDto,
    private fb: FormBuilder,
    private dataSvc: PersonalService,
    private dialogRef: MatDialogRef<PersonalFormComponent>,
    private countrySvc: CountryService,
    private catalogueSvc: CatalogueService,
    private airLineSecSvc: AirlineSectSvcService
  ) {}

  ngOnInit(): void {
    this.dataItem = this.data;
    if (this.dataItem) {
      this.form.patchValue(this.data);
      this.form.patchValue({
        userId: this.dataItem.user.userName,
        paisId: this.dataItem.pais.id,
        puestoId: this.dataItem.puesto.id,
        fechaNacimiento: moment(this.dataItem.fechaNacimiento),
      });
      this.form.get('userId')?.disable();
    }
    this.countrySvc.get({ all: true }).subscribe((res) => {
      this.countries = res.items;
    });
    this.catalogueSvc.get('PUESTOS', 0, 0, { all: true }).subscribe((res) => {
      this.positions = res.items;
    });
  }
  cleanForm() {
    this.form.patchValue({
      nombre: '',
      userId: '',
      fechaNacimiento: '',
      correo: '',
      direccion: '',
      telefono: '',
      paisId: '',
      puestoId: '',
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
        DATA.fechaNacimiento = new Date(DATA.fechaNacimiento)
          .toISOString()
          .split('T')[0];
        DATA.aerolineaId = this.airLineSecSvc.getCurrentAirline()?.id ?? null;
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
