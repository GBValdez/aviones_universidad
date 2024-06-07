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
import { MatDatepickerModule } from '@angular/material/datepicker';
import {
  MAT_DIALOG_DATA,
  MatDialogModule,
  MatDialogRef,
} from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { CatalogueService } from '@catalogues/services/catalogue.service';
import { crewDto } from '@crew/pages/crew/interface/crew.interface';
import { CrewService } from '@crew/pages/crew/services/crew.service';
import { avionDto } from '@plane/interfaces/avion.interface';
import { PlaneService } from '@plane/services/plane.service';
import { catalogueInterface } from '@utils/commons.interface';
import { OnlyNumberInputDirective } from '@utils/directivas/only-number-input.directive';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-avion-form',
  standalone: true,
  imports: [
    MatCardModule,
    ReactiveFormsModule,
    MatInputModule,
    MatButtonModule,
    MatFormFieldModule,
    MatDialogModule,
    TextFieldModule,
    OnlyNumberInputDirective,
    MatSelectModule,
    MatDialogModule,
  ],
  templateUrl: './avion-form.component.html',
  styleUrl: './avion-form.component.scss',
})
export class AvionFormComponent {
  dataItem?: avionDto;
  marcas: catalogueInterface[] = [];
  modelos: catalogueInterface[] = [];
  tiposAvion: catalogueInterface[] = [];
  crews: crewDto[] = [];

  form: FormGroup = this.fb.group({
    codigo: [
      '',
      Validators.compose([Validators.required, Validators.maxLength(50)]),
    ],
    year: ['', Validators.compose([Validators.required])],
    serie: ['', Validators.compose([Validators.required])],

    marcaId: ['', Validators.compose([Validators.required])],
    modeloId: ['', Validators.compose([Validators.required])],
    tipoAvionId: ['', Validators.compose([Validators.required])],
    tripulacionId: ['', Validators.compose([Validators.required])],

    capacidadCarga: ['', Validators.compose([Validators.required])],
    capacidadPasajeros: ['', Validators.compose([Validators.required])],
    capacidadCombustible: ['', Validators.compose([Validators.required])],
  });
  constructor(
    @Inject(MAT_DIALOG_DATA) private data: avionDto,
    private fb: FormBuilder,
    private dataSvc: PlaneService,
    private dialogRef: MatDialogRef<AvionFormComponent>,
    private cataloguesSvc: CatalogueService,
    private crewSvc: CrewService
  ) {}

  ngOnInit(): void {
    this.dataItem = this.data;
    if (this.dataItem) {
      this.form.patchValue(this.data);
      this.form.patchValue({
        marcaId: this.data.marca.id,
        modeloId: this.data.modelo.id,
        tipoAvionId: this.data.tipoAvion.id,
        tripulacionId: this.data.tripulaciones[0].id,
      });
    }
    this.cataloguesSvc.get('MARCA_AV', 1, 1, { all: true }).subscribe((res) => {
      this.marcas = res.items;
    });
    this.cataloguesSvc
      .get('MODELO_AV', 1, 1, { all: true })
      .subscribe((res) => {
        this.modelos = res.items;
      });
    this.cataloguesSvc.get('TIP_AV', 1, 1, { all: true }).subscribe((res) => {
      this.tiposAvion = res.items;
    });
    this.crewSvc
      .allAndPlane(this.dataItem ? this.dataItem.id : -1)
      .subscribe((res) => {
        this.crews = res;
      });
  }
  cleanForm() {
    this.form.patchValue({
      codigo: '',
      year: '',
      serie: '',
      marcaId: '',
      modeloId: '',
      tipoAvionId: '',
      capacidadCarga: '',
      capacidadPasajeros: '',
      capacidadCombustible: '',
      tripulacionId: '',
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
