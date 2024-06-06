import { Injectable } from '@angular/core';
import { CommonsSvcService } from '@utils/commons-svc.service';
import {
  personalDto,
  personalDtoCreation,
} from '../interface/personal.interface';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class PersonalService extends CommonsSvcService<
  personalDto,
  personalDtoCreation
> {
  constructor(http: HttpClient) {
    super(http);
    this.url = 'employee';
  }
  getAllAndCrew(idCrew: number, idPuesto: number): Observable<personalDto[]> {
    return this.http.get<personalDto[]>(
      `${this.urlBase}/AllAndCrew/${idCrew}/${idPuesto}`
    );
  }
}
