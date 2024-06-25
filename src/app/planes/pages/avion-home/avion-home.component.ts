import { Component, OnDestroy } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { avionDto } from '@plane/interfaces/avion.interface';
import { PlaneService } from '@plane/services/plane.service';
import Swal from 'sweetalert2';
import { AvionFormComponent } from '../avion-form/avion-form.component';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { RouterModule } from '@angular/router';
import { Subscription } from 'rxjs';
import { AirlineSectSvcService } from '@airlineSection/services/AirlineSectSvc.service';

@Component({
  selector: 'app-avion-home',
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
    RouterModule,
  ],
  templateUrl: './avion-home.component.html',
  styleUrl: './avion-home.component.scss',
})
export class AvionHomeComponent implements OnDestroy {
  constructor(
    private dataSvc: PlaneService,
    private dialog: MatDialog,
    private airLineSecSvc: AirlineSectSvcService
  ) {}
  ngOnDestroy(): void {
    this.suscription.unsubscribe();
  }
  data: avionDto[] = [];
  pageNumber: number = 0;
  pageSize: number = 10;
  dataSize: number = 0;
  canOperation: boolean = false;
  suscription!: Subscription;
  ngOnInit(): void {
    this.canOperation = this.airLineSecSvc.canOperation();
    this.getData(this.pageNumber, this.pageSize);
    this.suscription = this.airLineSecSvc
      .getCurrentAirlineObservable()
      .subscribe((res) => {
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
  async deleteItem(catalogue: avionDto) {
    const result = await Swal.fire({
      title: '¿Estas seguro de eliminar este registro?',
      text: `Eliminar ${catalogue.codigo}`,
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

  openForm(item?: avionDto) {
    this.dialog
      .open(AvionFormComponent, {
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
