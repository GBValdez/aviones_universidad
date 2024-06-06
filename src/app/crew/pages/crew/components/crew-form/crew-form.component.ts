import { Component, Inject } from '@angular/core';
import { crewDto } from '../../interface/crew.interface';
import {
  AbstractControl,
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
import { CrewService } from '../../services/crew.service';
import Swal from 'sweetalert2';
import { TextFieldModule } from '@angular/cdk/text-field';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { personalDto } from '@crew/pages/personal/interface/personal.interface';
import { MatSelectModule } from '@angular/material/select';
import { PersonalService } from '@crew/pages/personal/services/personal.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-crew-form',
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
  ],
  templateUrl: './crew-form.component.html',
  styleUrl: './crew-form.component.scss',
})
export class CrewFormComponent {
  dataItem?: crewDto;
  pilots: personalDto[] = [];
  copilots: personalDto[] = [];
  engineers: personalDto[] = [];
  stewardess: personalDto[] = [];
  uniqueAzafatasValidator(): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } | null => {
      const azafata1 = control.get('azafata1')?.value;
      const azafata2 = control.get('azafata2')?.value;
      const azafata3 = control.get('azafata3')?.value;

      if (!azafata1 || !azafata2 || !azafata3) {
        return null;
      }

      const unique =
        azafata1 !== azafata2 && azafata1 !== azafata3 && azafata2 !== azafata3;

      return unique ? null : { nonUniqueAzafatas: true };
    };
  }

  form: FormGroup = this.fb.group(
    {
      codigo: [
        '',
        Validators.compose([Validators.required, Validators.maxLength(50)]),
      ],
      piloto: ['', Validators.compose([Validators.required])],
      copiloto: ['', Validators.compose([Validators.required])],
      ingeniero: ['', Validators.compose([Validators.required])],
      azafata1: ['', Validators.compose([Validators.required])],
      azafata2: ['', Validators.compose([Validators.required])],
      azafata3: ['', Validators.compose([Validators.required])],
    },
    { validators: this.uniqueAzafatasValidator() }
  );
  constructor(
    @Inject(MAT_DIALOG_DATA) private data: crewDto,
    private fb: FormBuilder,
    private dataSvc: CrewService,
    private dialogRef: MatDialogRef<CrewFormComponent>,
    private personalSvc: PersonalService
  ) {}

  ngOnInit(): void {
    this.dataItem = this.data;
    if (this.dataItem) {
      this.form.patchValue(this.data);
      const PILOTO = this.dataItem.empleados.find((x) => x.puesto.id === 83);
      const COPILOTO = this.dataItem.empleados.find((x) => x.puesto.id === 84);
      const INGENIERO = this.dataItem.empleados.find((x) => x.puesto.id === 85);
      const AZAFATA1 = this.dataItem.empleados.find((x) => x.puesto.id === 86);
      let ID_AZAFATA: number[] = [AZAFATA1!.id];
      const AZAFATA2 = this.dataItem.empleados.find(
        (x) => x.puesto.id === 86 && !ID_AZAFATA.includes(x.id)
      );
      ID_AZAFATA.push(AZAFATA2!.id);
      const AZAFATA3 = this.dataItem.empleados.find(
        (x) => x.puesto.id === 86 && !ID_AZAFATA.includes(x.id)
      );
      this.form.patchValue({
        piloto: PILOTO?.id,
        copiloto: COPILOTO?.id,
        ingeniero: INGENIERO?.id,
        azafata1: AZAFATA1?.id,
        azafata2: AZAFATA2?.id,
        azafata3: AZAFATA3?.id,
      });
    }
    this.getPersonal(83, 'pilots');
    this.getPersonal(84, 'copilots');
    this.getPersonal(85, 'engineers');
    this.getPersonal(86, 'stewardess');
  }

  getPersonal(puestoId: number, personal: string): void {
    this.personalSvc
      .getAllAndCrew(this.dataItem?.id ?? -1, puestoId)
      .subscribe((res) => {
        console.log(res);
        const REFERENCE = this as any;
        REFERENCE[personal] = res;
      });
  }
  cleanForm() {
    this.form.patchValue({
      codigo: '',
      piloto: '',
      copiloto: '',
      ingeniero: '',
      azafata1: '',
      azafata2: '',
      azafata3: '',
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
            .updateCrew(this.form.value, this.dataItem.id!)
            .subscribe((res) => {
              this.closeDialog();
            });
        } else {
          this.dataSvc.createCrew(this.form.value).subscribe((res) => {
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
