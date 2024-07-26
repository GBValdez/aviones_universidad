import { AirlineSectSvcService } from '@airlineSection/services/AirlineSectSvc.service';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '@env/environment';
import {
  ticketBodyDto,
  ticketCompleteDto,
  ticketDto,
  ticketFinDto,
} from '@plane/interfaces/seats.interface';
import { fixedQueryParams } from '@utils/utils';

@Injectable({
  providedIn: 'root',
})
export class TackleTicketService {
  url: string = `${environment.api}/Seats`;
  constructor(
    private http: HttpClient,
    private airlineSect: AirlineSectSvcService
  ) {}
  getInfoTicket(ticketEncrypted: string) {
    let params: any = {
      AerolineaId: this.airlineSect.getCurrentAirline()?.id,
    };
    params = fixedQueryParams(params);
    const DATA: ticketDto = {
      ticket: ticketEncrypted,
    };
    return this.http.post<ticketCompleteDto>(
      `${this.url}/getTackleTicket`,
      DATA,
      { params }
    );
  }
  completeTicket(body: ticketFinDto) {
    let params: any = {
      AerolineaId: this.airlineSect.getCurrentAirline()?.id,
    };
    params = fixedQueryParams(params);

    return this.http.post<any>(`${this.url}/completeTackleTicket`, body, {
      params,
    });
  }
}
