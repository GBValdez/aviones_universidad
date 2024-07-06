import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from '@auth/services/auth.service';
import { vueloClaseDto } from '@buyTicket/interfaces/vuelo.interface';
import {
  configSeatPlane,
  posInterface,
  seatPosInterface,
} from '@plane/interfaces/plane.interface';
import { SeatsService } from '@plane/services/seats.service';
import { catalogueInterface } from '@utils/commons.interface';
import { SeatsSelectComponent } from '@utils/components/seats-select/seats-select/seats-select.component';

@Component({
  selector: 'app-my-tickets',
  standalone: true,
  imports: [SeatsSelectComponent],
  templateUrl: './my-tickets.component.html',
  styleUrl: './my-tickets.component.scss',
})
export class MyTicketsComponent implements OnInit {
  idFly: number = 0;
  seats: seatPosInterface[] = [];
  clasesList: vueloClaseDto[] = [];
  config!: configSeatPlane;
  clientId: number = -1;
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
      this.config = {
        sizeWidth: res.avion.tamAsientoPorc,
        img: '/assets/img/avion.jpg',
        getIcon: (seat: seatPosInterface) => {
          if (seat.Estado!.id == 92 && this.clientId == seat.clienteId)
            return 'check_circle';
          return 'event_seat';
        },
        opacitySeat: (seat: seatPosInterface) => {
          if (seat.Estado!.id == 92 && this.clientId == seat.clienteId)
            return 1;
          return 0.5;
        },
      };
    });
  }
}
