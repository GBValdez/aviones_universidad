import { NgStyle } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatTooltipModule } from '@angular/material/tooltip';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { AuthService } from '@auth/services/auth.service';
import { vueloClaseDto } from '@buyTicket/interfaces/vuelo.interface';
import {
  configSeatPlane,
  mySeatPosInterface,
  posInterface,
  seatPosInterface,
} from '@plane/interfaces/plane.interface';
import { SeatsService } from '@plane/services/seats.service';
import { catalogueInterface } from '@utils/commons.interface';
import { SeatsSelectComponent } from '@utils/components/seats-select/seats-select/seats-select.component';
import { toDataURL } from 'qrcode';
import * as pdfMake from 'pdfmake/build/pdfmake';
import * as pdfFonts from 'pdfmake/build/vfs_fonts';
import { TDocumentDefinitions } from 'pdfmake/interfaces';
import { setPdfMakeVfs } from './utils/custom';
setPdfMakeVfs(pdfFonts.pdfMake.vfs);
@Component({
  selector: 'app-my-tickets',
  standalone: true,
  imports: [
    SeatsSelectComponent,
    NgStyle,
    FormsModule,
    MatIconModule,
    MatTooltipModule,
    MatMenuModule,
    MatButtonModule,
    RouterModule,
  ],
  templateUrl: './my-tickets.component.html',
  styleUrl: './my-tickets.component.scss',
})
export class MyTicketsComponent implements OnInit {
  idFly: number = 0;
  seats: seatPosInterface[] = [];
  mySeats: mySeatPosInterface[] = [];
  clasesList: vueloClaseDto[] = [];
  config!: configSeatPlane;
  clientId: number = -1;
  modeVisualization: number = 0;

  constructor(
    private routerAct: ActivatedRoute,
    private seatSvc: SeatsService,
    private authSvc: AuthService
  ) {}
  ngOnInit(): void {
    this.clientId = this.authSvc.getAuth()?.clientId!;
    this.idFly = this.routerAct.snapshot.params['id'];
    this.seatSvc.getByFly(this.idFly).subscribe((res) => {
      this.clasesList = res.classList;
      this.seats = res.asientoDtos.map((seat) => {
        const [x, y] = seat.posicion.split('|').map(Number);
        // console.log(seat);
        const ticket = res.boletos.find((t) => t.asientoId == seat.id);
        let estado: catalogueInterface = {
          id: 94,
          name: 'Libre',
          description: 'Libre',
        };
        let clienteId: number = -1;
        if (ticket) {
          estado = ticket.estadoBoleto;
          clienteId = ticket.clienteId!;
        }
        return {
          position: { x, y },
          clase: seat.clase,
          Id: seat.id,
          Codigo: seat.codigo,
          Estado: estado,
          clienteId,
        };
      });
      this.mySeats = this.seats.filter(
        (seat) => seat.clienteId == this.clientId && seat.Estado!.id == 92
      );
      this.mySeats.forEach((seat) => (seat.checked = true));
      this.config = {
        sizeWidth: res.avion.tamAsientoPorc,
        img: '/assets/img/avion.jpg',
        getIcon: (seat: seatPosInterface) => {
          if (seat.Estado!.id == 92 && this.clientId == seat.clienteId)
            return 'check_circle';
          return 'event_seat';
        },
        opacitySeat: (seat: seatPosInterface) => {
          switch (this.modeVisualization) {
            case 0:
              if (seat.Estado!.id == 92 && this.clientId == seat.clienteId)
                return 1;
              return 0.4;
            case 1:
              const SEAT = this.mySeats.find((s) => s.Id == seat.Id);
              return SEAT?.checked ? 1 : 0.4;
            default:
              return 1;
          }
        },
        blockSeat: true,
      };
    });
  }
  getTotal(): number {
    return this.mySeats.reduce((acc, seat) => acc + this.getPrice(seat), 0);
  }
  getPrice(seat: seatPosInterface): number {
    return (
      this.clasesList.find((c) => c.clase.id == seat.clase.id)?.precio || 0
    );
  }

  downloadTicket() {
    const qrCodeText = 'https://www.example.com';
    toDataURL(qrCodeText, { width: 200, margin: 1 }, (err, url) => {
      if (err) {
        console.error(err);
        return;
      }

      // Definir el documento PDF
      const docDefinition: TDocumentDefinitions = {
        content: [
          {
            text: 'Escanea el código QR:',
            fontSize: 16,
            margin: [0, 0, 0, 10],
          },
          { image: url, width: 200, height: 200 },
        ],
      };

      // Crear y descargar el PDF
      pdfMake.createPdf(docDefinition).download('documento-con-qr.pdf');
    });
  }
}
