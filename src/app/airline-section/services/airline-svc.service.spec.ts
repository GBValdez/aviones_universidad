import { TestBed } from '@angular/core/testing';

import { AirlineSectSvcService } from './AirlineSectSvc.service';

describe('AirlineSvcService', () => {
  let service: AirlineSectSvcService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AirlineSectSvcService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
