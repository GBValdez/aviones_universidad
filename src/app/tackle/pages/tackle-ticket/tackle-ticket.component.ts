import { DatePipe, NgClass } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import {
  MatTable,
  MatTableDataSource,
  MatTableModule,
} from '@angular/material/table';
import { Router } from '@angular/router';
import { vueloClaseDto, vueloDto } from '@buyTicket/interfaces/vuelo.interface';
import { mySeatPosInterface } from '@plane/interfaces/plane.interface';
import { boletoDto } from '@plane/interfaces/seats.interface';
import { TackleTicketService } from '@tackleTicket/services/tackle-ticket.service';
import { clientedto } from '@user/interface/user.interface';
import { LocalTimezonePipe } from '@utils/pipes/local-timezone-pipe.pipe';
import { ZXingScannerComponent, ZXingScannerModule } from '@zxing/ngx-scanner';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-tackle-ticket',
  standalone: true,
  imports: [
    ZXingScannerModule,
    NgClass,
    MatCardModule,
    MatTableModule,
    DatePipe,
    MatButtonModule,
  ],
  templateUrl: './tackle-ticket.component.html',
  styleUrl: './tackle-ticket.component.scss',
  providers: [LocalTimezonePipe],
})
export class TackleTicketComponent implements OnInit {
  @ViewChild(MatTable) table!: MatTable<boletoDto>;

  ticketEncrypted?: string;
  client?: clientedto;
  fly?: vueloDto;
  displayedColumns: string[] = ['codigo', 'clase', 'precio'];
  dataSource = new MatTableDataSource<boletoDto>([]);
  @ViewChild('scanner') scanner!: ZXingScannerComponent;

  constructor(
    private route: Router,
    private tackleSvc: TackleTicketService,
    private localTimezonePipe: LocalTimezonePipe
  ) {}
  ngOnInit(): void {
    // this.ticketEncrypted = '';
    // this.scanner.scanStop();
  }
  cameras: MediaDeviceInfo[] = [];
  selectedCamera!: MediaDeviceInfo;

  onCamerasFound(devices: MediaDeviceInfo[]): void {
    this.cameras = devices;
    if (devices.length > 0) {
      this.selectedCamera = devices[0];
    }
  }

  getPrice(seat: boletoDto): number {
    return this.fly?.vueloClases.find(
      (x) => x.clase.id === seat.asiento?.clase.id
    )?.precio!;
  }
  async handleQrCodeResult(resultString: string) {
    await Swal.fire({
      title: 'Boleto escaneado',
      icon: 'success',
    });
    this.tackleSvc.getInfoTicket(resultString).subscribe((res) => {
      if (res) {
        this.ticketEncrypted = resultString;
        this.scanner.scanStop();

        Swal.fire({
          title: 'Boleto encontrado',
          icon: 'success',
        });
        this.client = res.cliente;
        this.fly = res.vuelo;
        this.fly.fechaLlegada = new Date(
          this.localTimezonePipe.transform(this.fly.fechaLlegada.toString())
        );
        this.fly.fechaSalida = new Date(
          this.localTimezonePipe.transform(this.fly.fechaSalida.toString())
        );
        this.dataSource.data = res.boletos;
        // this.table.renderRows();
      } else {
        Swal.fire({
          title: 'Boleto no encontrado',
          icon: 'error',
        });
      }
    });
  }

  cleanInfo(): void {
    this.fly = undefined;
    this.client = undefined;
    this.ticketEncrypted = undefined;
    this.dataSource.data = [];
    this.scanner.scanStart();
  }
  async tackle() {
    const alert = await Swal.fire({
      text: 'Esta seguro de abordar los boletos',
      icon: 'question',
      showCancelButton: true,
      cancelButtonText: 'No',
      showConfirmButton: true,
      confirmButtonText: 'Si',
    });
    if (alert.isConfirmed)
      this.tackleSvc.completeTicket(this.ticketEncrypted!).subscribe(() => {
        Swal.fire({
          text: 'Los boletos han sido abordados',
          icon: 'success',
        });
        this.cleanInfo();
      });
  }
}
