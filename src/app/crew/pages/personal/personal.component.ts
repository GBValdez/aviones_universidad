import { Component } from '@angular/core';
import { PersonalService } from './services/personal.service';
import { MatDialog } from '@angular/material/dialog';
import { personalDto } from './interface/personal.interface';
import Swal from 'sweetalert2';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { PersonalFormComponent } from './components/personal-form/personal-form.component';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { AirlineSectSvcService } from '@airlineSection/services/AirlineSectSvc.service';

@Component({
  selector: 'app-personal',
  standalone: true,
  imports: [
    MatCardModule,
    MatButtonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatMenuModule,
    MatIconModule,
    MatPaginatorModule,
  ],
  templateUrl: './personal.component.html',
  styleUrl: './personal.component.scss',
})
export class PersonalComponent {
  constructor(
    private dataSvc: PersonalService,
    private dialog: MatDialog,
    private airLineSecSvc: AirlineSectSvcService
  ) {}
  data: personalDto[] = [];
  pageNumber: number = 0;
  pageSize: number = 10;
  dataSize: number = 0;
  canOperation: boolean = false;
  ngOnInit(): void {
    this.canOperation = this.airLineSecSvc.canOperation();
    this.getData(this.pageNumber, this.pageSize);
    this.airLineSecSvc.getCurrentAirlineObservable().subscribe((res) => {
      this.canOperation = this.airLineSecSvc.canOperation();
      this.getData(this.pageNumber, this.pageSize);
    });
  }

  getData(pageNumber: number, pageSize: number) {
    this.dataSvc
      .get({
        pageNumber: pageNumber + 1,
        pageSize,
        query: {
          AerolineaId: this.airLineSecSvc.getCurrentAirline()?.id,
        },
      })
      .subscribe((res) => {
        if (res.total > 0) {
          this.data = res.items;
          this.dataSize = res.total;
        } else {
          this.data = [];
          this.dataSize = 0;
          Swal.fire('No se encontraron registros', '', 'info');
        }
      });
  }

  changePagination(event: PageEvent) {
    this.pageNumber = event.pageIndex;
    this.pageSize = event.pageSize;
    this.getData(this.pageNumber, this.pageSize);
  }
  async deleteItem(catalogue: personalDto) {
    const result = await Swal.fire({
      title: '¿Estas seguro de eliminar este registro?',
      text: `Eliminar ${catalogue.nombre}`,
      icon: 'warning',
      showCancelButton: true,
    });
    if (result.isConfirmed) {
      this.dataSvc.delete(catalogue.id!).subscribe(async () => {
        await Swal.fire('Eliminado', 'Registro eliminado', 'success');
        this.pageNumber = 0;
        this.getData(this.pageNumber, this.pageSize);
      });
    }
  }

  openForm(item?: personalDto) {
    this.dialog
      .open(PersonalFormComponent, {
        width: '60%',
        minWidth: '280px',
        data: item,
      })
      .afterClosed()
      .subscribe((res) => {
        if (res?.modify) {
          this.getData(this.pageNumber, this.pageSize);
        }
      });
  }
}
