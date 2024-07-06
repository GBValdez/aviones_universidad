import { NgStyle } from '@angular/common';
import {
  AfterViewInit,
  Component,
  ElementRef,
  HostListener,
  OnDestroy,
  OnInit,
  signal,
  ViewChild,
  WritableSignal,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatTooltip, MatTooltipModule } from '@angular/material/tooltip';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '@auth/services/auth.service';
import { SelctFinishModalComponent } from '@buyTicket/components/selct-finish-modal/selct-finish-modal.component';
import {
  selectVueloDto,
  vueloClaseDto,
} from '@buyTicket/interfaces/vuelo.interface';
import { VueloService } from '@buyTicket/services/vuelo.service';
import {
  configSeatPlane,
  modalFinishSeatInterface,
  mySeatPosInterface,
  posInterface,
  seatPosInterface,
} from '@plane/interfaces/plane.interface';
import { boletoDto } from '@plane/interfaces/seats.interface';
import { PlaneService } from '@plane/services/plane.service';
import { SeatsService } from '@plane/services/seats.service';
import { SeatsSelectComponent } from '@utils/components/seats-select/seats-select/seats-select.component';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-buy-ticket',
  standalone: true,
  imports: [
    SeatsSelectComponent,
    MatIconModule,
    NgStyle,
    MatTooltipModule,
    MatMenuModule,
    FormsModule,
    MatButtonModule,
  ],
  templateUrl: './buy-ticket.component.html',
  styleUrl: './buy-ticket.component.scss',
})
export class BuyTicketComponent implements AfterViewInit, OnInit, OnDestroy {
  config!: configSeatPlane;
  clasesList: vueloClaseDto[] = [];
  seats: seatPosInterface[] = [];
  mySeats: mySeatPosInterface[] = [];
  idFly: number = 0;
  clientId: number = 0;
  modeVisualization: number = 0;
  constructor(
    private routerAct: ActivatedRoute,
    private seatSvc: SeatsService,
    private vueloSvc: VueloService,
    private router: Router,
    private authSvc: AuthService,
    private matDialog: MatDialog
  ) {}
  ngOnDestroy(): void {
    this.vueloSvc.leaveGroup(this.idFly);
  }

  ngOnInit(): void {
    this.clientId = this.authSvc.getAuth()?.clientId || 0;
    this.vueloSvc.startConnection().then(() => {
      this.vueloSvc.joinGroup(this.idFly);
      this.vueloSvc.addReceiveSeatSelection();
    });
    this.idFly = this.routerAct.snapshot.params['id'];

    this.vueloSvc.getSeat().subscribe((res) => {
      if (res) {
        this.makeListSeats(res);
      }
    });
  }
  makeListSeats(tickets: boletoDto[]): void {
    this.seats.forEach((seat) => {
      const ticket = tickets.find((t) => t.asientoId == seat.Id);
      if (ticket) {
        seat.Estado = ticket.estadoBoleto;
        seat.clienteId = ticket.clienteId;
        return;
      }
      seat.Estado = { id: 94, name: 'Libre', description: 'Libre' };
    });
    this.mySeats = this.seats.filter(
      (seat) => seat.clienteId == this.clientId && seat.Estado?.id != 94
    );
    this.mySeats.forEach((seat) => {
      seat.checked = false;
    });
  }

  exit() {
    this.vueloSvc.leaveGroup(this.idFly);
    this.router.navigate(['/session/searchFlight']);
  }

  validOption(): boolean {
    return this.mySeats.some((seat) => seat.checked);
  }

  async vacateSeat() {
    const SEATS = this.mySeats.filter((seat) => seat.checked);

    const seatsId: number[] = SEATS.filter((seat) => seat.Estado?.id == 93).map(
      (seat) => seat.Id!
    );

    if (seatsId.length == 0) {
      await Swal.fire(
        'Error',
        'No hay ningun asiento apartado seleccionado',
        'error'
      );
      return;
    }
    if (SEATS.some((seat) => seat.Estado?.id == 92))
      await Swal.fire(
        'Advertencia',
        'Solo se desocuparan los asientos apartados , en los pagados no surtirá ningún efecto',
        'warning'
      );

    const RES = await Swal.fire({
      title: '¿Desea desocupar los asientos seleccionados?',
      showCancelButton: true,
      confirmButtonText: 'Desocupar',
      cancelButtonText: 'Cancelar',
      icon: 'question',
    });
    if (!RES.isConfirmed) return;
    this.vueloSvc.vacateSeats(this.idFly, seatsId, () => {
      this.mySeats = this.mySeats.filter(
        (seat) => seat.checked == undefined || seat.checked == false
      );
    });
  }

  sendSeat(seat: seatPosInterface) {
    if (seat.Estado?.id == 93 && seat.clienteId != this.clientId) return;
    if (seat.Estado?.id == 92) return;
    const SEAT_DTO: selectVueloDto = {
      VueloId: this.idFly,
      AsientoId: seat.Id!,
    };

    this.vueloSvc.sendSeat(SEAT_DTO);
  }

  ngAfterViewInit(): void {
    this.seatSvc.getByFly(this.idFly).subscribe((res) => {
      this.clasesList = res.classList;
      this.seats = res.asientoDtos.map((seat) => {
        const [x, y] = seat.posicion.split('|').map(Number);
        // console.log(seat);
        return {
          position: { x, y },
          clase: seat.clase,
          Id: seat.id,
          Codigo: seat.codigo,
        };
      });
      this.makeListSeats(res.boletos);
      this.config = {
        sizeWidth: res.avion.tamAsientoPorc,
        img: '/assets/img/avion.jpg',
        showTooltipText: (seat: seatPosInterface) => {
          return `${seat.Codigo} - ${seat.Estado?.name}`;
        },
        getIcon: (seat: seatPosInterface) => {
          if (seat.Estado?.id == 94) return 'event_seat';
          if (seat.Estado?.id == 93 && seat.clienteId == this.clientId)
            return 'airline_seat_recline_normal';
          if (seat.Estado?.id == 92 && seat.clienteId == this.clientId)
            return 'check_circle';
          return 'block';
        },
        opacitySeat: (seat: seatPosInterface) => {
          switch (this.modeVisualization) {
            case 0:
              return 1;
            case 1:
              return seat.Estado?.id == 94 ? 1 : 0.5;
            case 2:
              const SEAT = this.mySeats.find((s) => s.Id == seat.Id);
              return SEAT?.checked ? 1 : 0.5;
            default:
              return 1;
          }
        },
        blockSeat: (seat: seatPosInterface) => {
          return (
            seat.Estado?.id == 92 ||
            (seat.Estado?.id == 93 && seat.clienteId != this.clientId)
          );
        },
      };
    });
  }

  getPrice(seat: seatPosInterface): number {
    return (
      this.clasesList.find((c) => c.clase.id == seat.clase.id)?.precio || 0
    );
  }

  getTotal(): number {
    return this.mySeats.reduce((acc, seat) => acc + this.getPrice(seat), 0);
  }

  finishSelect() {
    const data: modalFinishSeatInterface = {
      mySeats: this.mySeats.filter((seat) => seat.Estado?.id == 93),
      clases: this.clasesList,
      idVuelo: this.idFly,
    };
    this.matDialog.open(SelctFinishModalComponent, {
      data,
      width: '50%',
      minWidth: '280px',
    });
  }

  canFinailize(): boolean {
    return this.mySeats.some((seat) => seat.Estado?.id == 93);
  }
}
