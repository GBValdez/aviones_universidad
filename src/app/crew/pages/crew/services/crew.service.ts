import { Injectable } from '@angular/core';
import { CommonsSvcService } from '@utils/commons-svc.service';
import {
  crewDto,
  crewDtoCreation,
  crewPersonalDto,
} from '../interface/crew.interface';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CrewService extends CommonsSvcService<crewDto, crewDtoCreation> {
  constructor(http: HttpClient) {
    super(http);
    this.url = 'crew';
  }
  createCrew(data: crewPersonalDto): Observable<any> {
    return this.http.post(`${this.urlBase}/createCrew`, data);
  }
  updateCrew(data: crewPersonalDto, id: number): Observable<any> {
    return this.http.put(`${this.urlBase}/updateCrew/${id}`, data);
  }

  allAndPlane(idPlane: number): Observable<crewDto[]> {
    return this.http.get<crewDto[]>(`${this.urlBase}/allAndPlane/${idPlane}`);
  }
}
