import { TestBed } from '@angular/core/testing';

import { TackleTicketService } from './tackle-ticket.service';

describe('TackleTicketService', () => {
  let service: TackleTicketService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TackleTicketService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
