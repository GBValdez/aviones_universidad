import { TestBed } from '@angular/core/testing';
import { CanActivateFn } from '@angular/router';

import { selectSeatGuard } from './select-seat.guard';

describe('selectSeatGuard', () => {
  const executeGuard: CanActivateFn = (...guardParameters) => 
      TestBed.runInInjectionContext(() => selectSeatGuard(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
});
