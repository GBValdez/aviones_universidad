import { Injectable } from '@angular/core';
import { CommonsSvcService } from '@utils/commons-svc.service';
import { crewDto, crewDtoCreation } from '../interface/crew.interface';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class CrewService extends CommonsSvcService<crewDto, crewDtoCreation> {
  constructor(http: HttpClient) {
    super(http);
    this.url = 'crew';
  }
}
