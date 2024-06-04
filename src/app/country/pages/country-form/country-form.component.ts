import { TextFieldModule } from '@angular/cdk/text-field';
import { Component, Inject } from '@angular/core';
import {
  FormGroup,
  Validators,
  FormBuilder,
  ReactiveFormsModule,
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
import { CatalogueFormComponent } from '@catalogues/catalogue-form/catalogue-form.component';
import { CatalogueService } from '@catalogues/services/catalogue.service';
import { countryDto } from '@country/interfaces/pais.interface';
import { CountryService } from '@country/services/country.service';
import { catalogueModal } from '@utils/commons.interface';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-country-form',
  standalone: true,
  imports: [
    MatCardModule,
    ReactiveFormsModule,
    MatInputModule,
    MatButtonModule,
    MatFormFieldModule,
    MatDialogModule,
    TextFieldModule,
  ],
  templateUrl: './country-form.component.html',
  styleUrl: './country-form.component.scss',
})
export class CountryFormComponent {
  dataItem?: countryDto;
  form: FormGroup = this.fb.group({
    nombre: [
      '',
      Validators.compose([Validators.required, Validators.maxLength(50)]),
    ],
    phoneCode: [
      '',
      Validators.compose([Validators.required, Validators.maxLength(5)]),
    ],
    iso3166: [
      '',
      Validators.compose([Validators.required, Validators.maxLength(5)]),
    ],
    iso4217: [
      '',
      Validators.compose([Validators.required, Validators.maxLength(5)]),
    ],
  });
  constructor(
    @Inject(MAT_DIALOG_DATA) private data: countryDto,
    private fb: FormBuilder,
    private dataSvc: CountryService,
    private dialogRef: MatDialogRef<CatalogueFormComponent>
  ) {}

  ngOnInit(): void {
    this.dataItem = this.data;
    if (this.dataItem) {
      this.form.patchValue(this.data);
    }
  }
  cleanForm() {
    this.form.patchValue({ nombre: '', descripcion: '' });
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
