import { NgClass } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { Router } from '@angular/router';
import { vueloDto } from '@buyTicket/interfaces/vuelo.interface';
import { boletoDto } from '@plane/interfaces/seats.interface';
import { TackleTicketService } from '@tackleTicket/services/tackle-ticket.service';
import { clientedto } from '@user/interface/user.interface';
import { ZXingScannerComponent, ZXingScannerModule } from '@zxing/ngx-scanner';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-tackle-ticket',
  standalone: true,
  imports: [ZXingScannerModule, NgClass, MatCardModule],
  templateUrl: './tackle-ticket.component.html',
  styleUrl: './tackle-ticket.component.scss',
})
export class TackleTicketComponent implements OnInit {
  ticketEncrypted?: string;
  client!: clientedto;
  fly!: vueloDto;
  tickets: boletoDto[] = [];
  @ViewChild('scanner') scanner!: ZXingScannerComponent;

  constructor(private route: Router, private tackleSvc: TackleTicketService) {}
  ngOnInit(): void {
    this.ticketEncrypted = '';
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
        this.tickets = res.boletos;
      } else {
        Swal.fire({
          title: 'Boleto no encontrado',
          icon: 'error',
        });
      }
    });
  }
}
