import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import {
  MatPaginator,
  MatPaginatorModule,
  PageEvent,
} from '@angular/material/paginator';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { vueloClaseDto } from '@buyTicket/interfaces/vuelo.interface';
import { VueloService } from '@buyTicket/services/vuelo.service';
import { boletoDto } from '@plane/interfaces/seats.interface';
import { ExportService } from '@utils/export.service';
import { LocalTimezonePipe } from '@utils/pipes/local-timezone-pipe.pipe';

@Component({
  selector: 'app-passanger-per-flight',
  standalone: true,
  imports: [
    MatTableModule,
    MatPaginatorModule,
    MatButtonModule,
    MatIconModule,
    RouterModule,
  ],
  providers: [LocalTimezonePipe],
  templateUrl: './passanger-per-flight.component.html',
  styleUrl: './passanger-per-flight.component.scss',
})
export class PassangerPerFlightComponent implements AfterViewInit, OnInit {
  displayedColumns: string[] = [
    'code',
    'passport',
    'name',
    'nationality',
    'age',
    'phone',
    'gmail',
    'clase',
    'maletas',
    'maletasMax',
    'recargo',
    'status',
  ];
  dataSource = new MatTableDataSource<boletoDto>([]);
  idFly: number = 0;
  pageSize: number = 10;
  pageNumber: number = 0;
  sizeData: number = 0;
  vuelosClases: vueloClaseDto[] = [];
  constructor(
    private vueloSvc: VueloService,
    private actRoute: ActivatedRoute,
    private localTimezonePipeSvc: LocalTimezonePipe,
    private exportSvc: ExportService
  ) {}
  ngOnInit(): void {
    this.idFly = this.actRoute.snapshot.params['id'];
  }
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  ngAfterViewInit(): void {
    this.getData(this.pageNumber, this.pageSize);
  }

  getData(pageNumber: number, pageSize: number) {
    this.vueloSvc
      .getTicketsOfFly(this.idFly, {
        pageNumber: pageNumber + 1,
        pageSize,
      })
      .subscribe((res) => {
        res.boletos.items.forEach((x) => {
          x.cliente!.fechaNacimiento = new Date(
            this.localTimezonePipeSvc.transform(
              x.cliente!.fechaNacimiento.toString()
            )
          );
        });
        this.vuelosClases = res.vuelo.vueloClases;
        this.dataSource.data = res.boletos.items;
        this.sizeData = res.boletos.total;
      });
  }
  getAge(date: Date): number {
    const timeDiff = Math.abs(Date.now() - date.getTime());
    return Math.floor(timeDiff / (1000 * 3600 * 24) / 365);
  }
  changePagination(event: PageEvent) {
    this.pageNumber = event.pageIndex;
    this.pageSize = event.pageSize;
    this.getData(this.pageNumber, this.pageSize);
    // this.getAuthors(this.indexPage, this.pageSize);
  }

  exportExcel() {
    this.exportSvc.exportToExcel(this.dataExport, 'pasajeros.xlsx');
  }

  private get dataExport() {
    return this.dataSource.data.map((x) => {
      return {
        Código: x.codigo,
        Pasaporte: x.cliente?.noPasaporte,
        Nombre: x.cliente?.nombre,
        Nacionalidad: x.cliente?.pais.nombre,
        Edad: this.getAge(x.cliente!.fechaNacimiento),
        Teléfono: x.cliente?.telefono,
        Correo: x.cliente?.correo,
        Clase: this.getVueloClase(x).clase.name,
        MaletasPresentada: x.cantidadMaletasPresentadas,
        MaletasMax: this.getVueloClase(x).cantidadMaletasMax,
        RecargoExtra: this.getRecargo(x),
        Estado: x.estadoBoleto?.name,
      };
    });
  }
  exportPdf() {
    this.exportSvc.exportToPdf(this.dataExport, 'pasajero.pdf');
  }
  getVueloClase(boleto: boletoDto): vueloClaseDto {
    return this.vuelosClases.find((x) => x.clase.id === boleto.claseId)!;
  }

  getRecargo(boleto: boletoDto): number {
    const clase = this.getVueloClase(boleto);
    if (boleto.cantidadMaletasPresentadas > clase.cantidadMaletasMax)
      return (
        50 * (boleto.cantidadMaletasPresentadas - clase.cantidadMaletasMax)
      );
    return 0;
  }
}
