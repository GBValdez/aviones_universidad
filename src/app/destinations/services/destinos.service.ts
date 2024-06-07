import { Injectable } from '@angular/core';
import { CommonsSvcService } from '@utils/commons-svc.service';
import {
  destinoCreationDto,
  destinoDto,
} from '../interfaces/destino.interface';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class DestinosService extends CommonsSvcService<
  destinoDto,
  destinoCreationDto
> {
  constructor(http: HttpClient) {
    super(http);
    this.url = 'destinoAutorizados';
  }
  public modifyDestino(body: destinoCreationDto): Observable<destinoDto> {
    return this.http.post<destinoDto>(`${this.urlBase}/modifyDestino`, body);
  }
}
