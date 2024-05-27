import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {
  seatCreationDto,
  seatDto,
  seatPlaneCreation,
} from '@plane/interfaces/seats.interface';
import { CommonsSvcService } from '@utils/commons-svc.service';

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
}
