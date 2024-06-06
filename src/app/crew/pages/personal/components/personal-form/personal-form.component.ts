import { Component, Inject } from '@angular/core';
import { personalDto } from '../../interface/personal.interface';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
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
  ],
  templateUrl: './personal-form.component.html',
  styleUrl: './personal-form.component.scss',
})
export class PersonalFormComponent {
  dataItem?: personalDto;
  form: FormGroup = this.fb.group({
    nombre: [
      '',
      Validators.compose([Validators.required, Validators.maxLength(50)]),
    ],
    fechaNacimiento: [Validators.required],
    correo: ['', Validators.compose([Validators.required, Validators.email])],
    direccion: [
      '',
      Validators.compose([Validators.required, Validators.maxLength(255)]),
    ],
    telefono: [
      '',
      Validators.compose([Validators.required, Validators.maxLength(10)]),
    ],
    paisId: [Validators.required],
    puestoId: [Validators.required],
  });
  constructor(
    @Inject(MAT_DIALOG_DATA) private data: personalDto,
    private fb: FormBuilder,
    private dataSvc: PersonalService,
    private dialogRef: MatDialogRef<PersonalFormComponent>
  ) {}

  ngOnInit(): void {
    this.dataItem = this.data;
    if (this.dataItem) {
      this.form.patchValue(this.data);
    }
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
