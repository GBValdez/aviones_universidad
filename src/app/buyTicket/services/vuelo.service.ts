import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {
  selectVueloDto,
  vueloDto,
  vueloDtoCreation,
} from '@buyTicket/interfaces/vuelo.interface';
import { CommonsSvcService } from '@utils/commons-svc.service';
import { HubConnection, HubConnectionBuilder } from '@microsoft/signalr';
import { BehaviorSubject } from 'rxjs';
import { environment } from '@env/environment';
import { boletoDto, seatDto, seatWithPlaneDto } from '@plane/interfaces/seats.interface';
import { AuthService } from '@auth/services/auth.service';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';
@Injectable({
  providedIn: 'root',
})
export class VueloService extends CommonsSvcService<
  vueloDto,
  vueloDtoCreation
> {
  constructor(http: HttpClient, private authSvc: AuthService,private router:Router) {
    super(http);
    this.url = 'Vuelo';
    this.hubConnection = new HubConnectionBuilder()
      .withUrl(environment.api + '/selectSeatHub', {
        accessTokenFactory: () => {
          return authSvc.getAuth()?.token || '';
        },
        withCredentials: true,
      })
      .build();
  }

  public startConnection() {
    return this.hubConnection.start().catch((err) => console.error(err));
  }
  public addReceiveSeatSelection() {
    this.hubConnection.on('ReceiveSeatSelection', (tickets: boletoDto[]) => {
      this.seatSubject.next(tickets);
    });
    this.hubConnection.on("ErrorMessage", (message: string) => {
      Swal.fire('Error', message, 'error');
      this.router.navigate(['/session/searchFlight']);
    });
  }

  onReceiveSeatSelection(callback: (seats: seatWithPlaneDto) => void) {}

  private hubConnection!: HubConnection;
  private seatSubject: BehaviorSubject<boletoDto[] | null> =
    new BehaviorSubject<boletoDto[] | null>(null);

  public getSeat() {
    return this.seatSubject.asObservable();
  }
  sendSeat(seat: selectVueloDto) {
    console.log('asiento', seat);
    this.hubConnection
      .invoke('SendSeatSelections', seat.AsientoId + '', seat.VueloId + '')
      .then(() => console.log('Enviado'))
      .catch((err) => console.error(err));
  }
  joinGroup(id: number) {
    this.hubConnection
      .invoke('JoinGroup', id + '')
      .then(() => console.log('Joined group'))
      .catch((err) => console.error(err));
  }

  leaveGroup(id: number) {
    this.hubConnection
      .invoke('LeaveGroup', id + '')
      .catch((err) => console.error(err));
  }
}
