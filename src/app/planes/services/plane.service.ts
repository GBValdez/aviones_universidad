import { Injectable } from '@angular/core';
import { CommonsSvcService } from '@utils/commons-svc.service';
import { avionDto, avionCreationDto } from '@plane/interfaces/avion.interface';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class PlaneService extends CommonsSvcService<
  avionDto,
  avionCreationDto
> {
  constructor(private httpClient: HttpClient) {
    super(httpClient);
    this.url = 'Avion';
  }

  getImgBase() {
    return this.httpClient.get('assets/img/avion.jpg', {
      responseType: 'blob',
    });
  }
}
