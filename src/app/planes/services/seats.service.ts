import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {
  seatCreationDto,
  seatDto,
  seatPlaneCreation,
  seatWithPlaneDto,
} from '@plane/interfaces/seats.interface';
import { CommonsSvcService } from '@utils/commons-svc.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class SeatsService extends CommonsSvcService<seatDto, seatCreationDto> {
  /**
   *
   */
  constructor(private httpClient: HttpClient) {
    super(httpClient);
    this.url = 'Seats';
  }

  saveSeats(seats: seatPlaneCreation, idPlane: number) {
    return this.httpClient.post<any>(
      `${this.urlBase}/saveSeats/${idPlane}`,
      seats
    );
  }

  getByFly(id: number): Observable<seatWithPlaneDto> {
    return this.httpClient.get<seatWithPlaneDto>(
      `${this.urlBase}/getSeatsOfFly/${id}`
    );
  }

  canEditSeats(id: number): Observable<any> {
    return this.httpClient.get<any>(`${this.urlBase}/canEditSeats/${id}`);
  }
}
