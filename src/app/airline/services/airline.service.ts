import {
  airlineCreationDto,
  airlineDto,
} from '@airline/interface/airline.interface';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CommonsSvcService } from '@utils/commons-svc.service';

@Injectable({
  providedIn: 'root',
})
export class AirlineService extends CommonsSvcService<
  airlineDto,
  airlineCreationDto
> {
  constructor(http: HttpClient) {
    super(http);
    this.url = 'airline';
  }
}
