import { AirlineSectSvcService } from '@airlineSection/services/AirlineSectSvc.service';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {
  seatCreationDto,
  seatDto,
  seatPlaneCreation,
  seatWithPlaneDto,
} from '@plane/interfaces/seats.interface';
import { CommonsSvcService } from '@utils/commons-svc.service';
import { fixedQueryParams } from '@utils/utils';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class SeatsService extends CommonsSvcService<seatDto, seatCreationDto> {
  /**
   *
   */
  constructor(
    private httpClient: HttpClient,
    private airlineSectSvc: AirlineSectSvcService
  ) {
    super(httpClient);
    this.url = 'Seats';
  }

  saveSeats(seats: seatPlaneCreation, idPlane: number) {
    let params: any = {
      AerolineaId: this.airlineSectSvc.getCurrentAirline()?.id,
    };
    params = fixedQueryParams(params);
    return this.httpClient.post<any>(
      `${this.urlBase}/saveSeats/${idPlane}`,
      seats,
      { params }
    );
  }

  getByFly(id: number): Observable<seatWithPlaneDto> {
    return this.httpClient.get<seatWithPlaneDto>(
      `${this.urlBase}/getSeatsOfFly/${id}`
    );
  }

  canEditSeats(id: number): Observable<any> {
    let params: any = {
      AerolineaId: this.airlineSectSvc.getCurrentAirline()?.id,
    };
    params = fixedQueryParams(params);
    return this.httpClient.get<any>(`${this.urlBase}/canEditSeats/${id}`, {
      params,
    });
  }

  getTicketPdf(idFly: number): Observable<any> {
    return this.httpClient.get<any>(`${this.urlBase}/getTicket/${idFly}`, {
      responseType: 'blob' as 'json',
    });
  }
}
