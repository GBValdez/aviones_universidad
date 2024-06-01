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
@Injectable({
  providedIn: 'root',
})
export class VueloService extends CommonsSvcService<
  vueloDto,
  vueloDtoCreation
> {
  constructor(http: HttpClient) {
    super(http);
    this.url = 'Vuelo';
    this.hubConnection = new HubConnectionBuilder()
      .withUrl(environment.api + '/selectSeatHub', {
        withCredentials: true, // Permitir credenciales
      })
      .build();
    console.log('hub', environment.api + '/selectSeatHub');
    this.hubConnection.start().catch((err) => console.error(err));

    this.hubConnection.on('ReceiveSeatSelection', (seats: seatWithPlaneDto) => {
      this.seatSubject.next(seats);
    });
  }

  private hubConnection!: HubConnection;
  private seatSubject: BehaviorSubject<seatWithPlaneDto | null> =
    new BehaviorSubject<seatWithPlaneDto | null>(null);

  public getSeat() {
    return this.seatSubject.asObservable();
  }
  sendSeat(seat: selectVueloDto) {
    // console.log('asiento', seat);
    this.hubConnection
      .invoke('SendSeatSelections', seat.AsientoId + '', seat.VueloId + '')
      .catch((err) => console.error(err));
  }
}
