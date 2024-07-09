import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '@env/environment';
import { ticketCompleteDto } from '@plane/interfaces/seats.interface';

@Injectable({
  providedIn: 'root',
})
export class TackleTicketService {
  url: string = `${environment.api}/Seats`;
  constructor(private http: HttpClient) {}
  getInfoTicket(ticketEncrypted: string) {
    return this.http.get<ticketCompleteDto>(
      `${this.url}/getTackleTicket/${ticketEncrypted}`
    );
  }
  completeTicket(ticketEncrypted: string) {
    return this.http.post<any>(
      `${this.url}/completeTackleTicket/${ticketEncrypted}`,
      {}
    );
  }
}
