import { airlineDto } from '@airline/interface/airline.interface';
import { AirlineService } from '@airline/services/airline.service';
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
import {
  MAT_DIALOG_DATA,
  MatDialogModule,
  MatDialogRef,
} from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { countryDto } from '@country/interfaces/pais.interface';
import { CountryService } from '@country/services/country.service';
import { OnlyNumberInputDirective } from '@utils/directivas/only-number-input.directive';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-airline-form',
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
    OnlyNumberInputDirective,
  ],
  templateUrl: './airline-form.component.html',
  styleUrl: './airline-form.component.scss',
})
export class AirlineFormComponent {
  dataItem?: airlineDto;
  countries: countryDto[] = [];
  form: FormGroup = this.fb.group({
    nombre: [
      '',
      Validators.compose([Validators.required, Validators.maxLength(50)]),
    ],
    codigo: ['', Validators.compose([Validators.required])],
    direccion: [
      '',
      Validators.compose([Validators.required, Validators.maxLength(255)]),
    ],
    telefono: [
      '',
      Validators.compose([Validators.required, Validators.maxLength(10)]),
    ],
    email: ['', Validators.compose([Validators.required, Validators.email])],
    paisId: ['', Validators.compose([Validators.required])],
  });
  constructor(
    @Inject(MAT_DIALOG_DATA) private data: airlineDto,
    private fb: FormBuilder,
    private dataSvc: AirlineService,
    private dialogRef: MatDialogRef<AirlineFormComponent>,
    private countrySvc: CountryService
  ) {}

  ngOnInit(): void {
    this.dataItem = this.data;
    if (this.dataItem) {
      this.form.patchValue(this.data);
      this.form.patchValue({ paisId: this.dataItem.pais.id });
    }
    this.countrySvc
      .get({
        all: true,
      })
      .subscribe((res) => {
        this.countries = res.items;
      });
  }
  cleanForm() {
    this.form.patchValue({
      nombre: '',
      codigo: '',
      direccion: '',
      telefono: '',
      email: '',
      paisId: '',
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
