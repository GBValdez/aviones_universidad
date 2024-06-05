import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {
  aeropuertoCreationDto,
  aeropuertoDto,
} from '@airport/interface/aeropuerto.interface';
import { CommonsSvcService } from '@utils/commons-svc.service';

@Injectable({
  providedIn: 'root',
})
export class AeropuertoService extends CommonsSvcService<
  aeropuertoDto,
  aeropuertoCreationDto
> {
  constructor(http: HttpClient) {
    super(http);
    this.url = 'Aeropuerto';
  }
}
