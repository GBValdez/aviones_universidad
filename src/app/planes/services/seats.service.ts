import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { seatCreationDto, seatDto } from '@plane/interfaces/seats.interface';
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
}
