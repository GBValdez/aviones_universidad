import { Component, OnDestroy } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { vueloDto } from '@buyTicket/interfaces/vuelo.interface';
import { VueloService } from '@buyTicket/services/vuelo.service';
import Swal from 'sweetalert2';
import { VueloFormComponent } from '../vuelo-form/vuelo-form.component';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { DatePipe } from '@angular/common';
import { Subscription } from 'rxjs';
import { AirlineSectSvcService } from '@airlineSection/services/AirlineSectSvc.service';
import { LocalTimezonePipe } from '@utils/pipes/local-timezone-pipe.pipe';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-vuelo-home',
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
    DatePipe,
    LocalTimezonePipe,
    RouterModule,
  ],
  providers: [LocalTimezonePipe],
  templateUrl: './vuelo-home.component.html',
  styleUrl: './vuelo-home.component.scss',
})
export class VueloHomeComponent implements OnDestroy {
  constructor(
    private dataSvc: VueloService,
    private dialog: MatDialog,
    private airLineSecSvc: AirlineSectSvcService,
    private localTimezonePipe: LocalTimezonePipe
  ) {}
  data: vueloDto[] = [];
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
  ngOnDestroy(): void {
    this.suscription.unsubscribe();
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
          this.data.forEach((item) => {
            item.fechaSalida = new Date(
              this.localTimezonePipe.transform(item.fechaSalida.toString())
            );
            item.fechaLlegada = new Date(
              this.localTimezonePipe.transform(item.fechaLlegada.toString())
            );
          });
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
  async deleteItem(catalogue: vueloDto) {
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

  openForm(item?: vueloDto) {
    this.dialog
      .open(VueloFormComponent, {
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
