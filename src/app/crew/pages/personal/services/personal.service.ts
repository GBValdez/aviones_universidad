import { Injectable } from '@angular/core';
import { CommonsSvcService } from '@utils/commons-svc.service';
import {
  personalDto,
  personalDtoCreation,
} from '../interface/personal.interface';
import { HttpClient } from '@angular/common/http';

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
}
