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
import { seatDto, seatWithPlaneDto } from '@plane/interfaces/seats.interface';
import { AuthService } from '@auth/services/auth.service';
@Injectable({
  providedIn: 'root',
})
export class VueloService extends CommonsSvcService<
  vueloDto,
  vueloDtoCreation
> {
  constructor(http: HttpClient, private authSvc: AuthService) {
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
    this.hubConnection.on('ReceiveSeatSelection', (seats: seatWithPlaneDto) => {
      this.seatSubject.next(seats);
      console.log('AmigoBoliviano', seats);
    });
  }

  onReceiveSeatSelection(callback: (seats: seatWithPlaneDto) => void) {}

  private hubConnection!: HubConnection;
  private seatSubject: BehaviorSubject<seatWithPlaneDto | null> =
    new BehaviorSubject<seatWithPlaneDto | null>(null);

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
