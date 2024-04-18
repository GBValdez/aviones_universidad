import { TestBed } from '@angular/core/testing';

import { SectionsSvcService } from './sections-svc.service';

describe('SectionsSvcService', () => {
  let service: SectionsSvcService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SectionsSvcService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
