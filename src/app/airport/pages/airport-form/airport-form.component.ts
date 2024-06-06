import { aeropuertoDto } from '@airport/interface/aeropuerto.interface';
import { AeropuertoService } from '@airport/services/aeropuerto.service';
import { TextFieldModule } from '@angular/cdk/text-field';
import { Component, Inject } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import {
  MAT_DIALOG_DATA,
  MatDialogModule,
  MatDialogRef,
} from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { CatalogueService } from '@catalogues/services/catalogue.service';
import { countryDto } from '@country/interfaces/pais.interface';
import { CountryService } from '@country/services/country.service';
import { catalogueInterface } from '@utils/commons.interface';
import { OnlyNumberInputDirective } from '@utils/directivas/only-number-input.directive';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-airport-form',
  standalone: true,
  imports: [
    MatCardModule,
    ReactiveFormsModule,
    MatInputModule,
    MatButtonModule,
    MatFormFieldModule,
    MatDialogModule,
    TextFieldModule,
    MatSelectModule,
    MatCheckboxModule,
    MatDialogModule,
    OnlyNumberInputDirective,
  ],
  templateUrl: './airport-form.component.html',
  styleUrl: './airport-form.component.scss',
})
export class AirportFormComponent {
  dataItem?: aeropuertoDto;
  countries: countryDto[] = [];
  timeZoneList: catalogueInterface[] = [];
  form: FormGroup = this.fb.group({
    iata: [
      '',
      Validators.compose([Validators.required, Validators.maxLength(3)]),
    ],
    oaci: [
      '',
      Validators.compose([Validators.required, Validators.maxLength(4)]),
    ],
    nombre: [
      '',
      Validators.compose([Validators.required, Validators.maxLength(50)]),
    ],
    ciudad: [
      '',
      Validators.compose([Validators.required, Validators.maxLength(255)]),
    ],
    localidad: [
      '',
      Validators.compose([Validators.required, Validators.maxLength(255)]),
    ],
    zonaHorariaId: [
      '',
      Validators.compose([Validators.required, Validators.maxLength(50)]),
    ],
    longitud: ['', Validators.compose([Validators.required])],
    latitud: ['', Validators.compose([Validators.required])],
    telefono: [
      '',
      Validators.compose([Validators.required, Validators.maxLength(10)]),
    ],
    email: ['', Validators.compose([Validators.required, Validators.email])],
    activo: [true, Validators.compose([Validators.required])],
    interno: [true, Validators.compose([Validators.required])],
    paisId: ['', Validators.compose([Validators.required])],
  });
  constructor(
    @Inject(MAT_DIALOG_DATA) private data: aeropuertoDto,
    private fb: FormBuilder,
    private dataSvc: AeropuertoService,
    private dialogRef: MatDialogRef<AirportFormComponent>,
    private countrySvc: CountryService,
    private catalogueSvc: CatalogueService
  ) {}

  ngOnInit(): void {
    this.dataItem = this.data;
    if (this.dataItem) {
      console.log('datos item', this.dataItem);

      this.form.patchValue(this.data);
      this.form.patchValue({
        zonaHorariaId: this.dataItem.zonaHoraria.id,
        paisId: this.dataItem.pais.id,
      });
    }
    this.countrySvc.get({ all: true }).subscribe((res) => {
      this.countries = res.items;
    });
    this.catalogueSvc.get('ZHORARIA', 0, 0, { all: true }).subscribe((res) => {
      this.timeZoneList = res.items;
    });
  }
  cleanForm() {
    this.form.patchValue({ nombre: '', descripcion: '' });
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
        if (this.dataItem) {
          this.dataSvc
            .put(this.dataItem.id!, this.form.value)
            .subscribe((res) => {
              this.closeDialog();
            });
        } else {
          this.dataSvc.post(this.form.value).subscribe((res) => {
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
