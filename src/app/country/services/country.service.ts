import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { countryDto } from '@country/interfaces/pais.interface';
import { CommonsSvcService } from '@utils/commons-svc.service';

@Injectable({
  providedIn: 'root',
})
export class CountryService extends CommonsSvcService<countryDto, countryDto> {
  constructor(http: HttpClient) {
    super(http);
    this.url = 'country';
  }
}
