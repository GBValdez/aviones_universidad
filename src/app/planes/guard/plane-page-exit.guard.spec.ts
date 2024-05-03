import { TestBed } from '@angular/core/testing';
import { CanDeactivateFn } from '@angular/router';

import { planePageExitGuard } from './plane-page-exit.guard';

describe('planePageExitGuard', () => {
  const executeGuard: CanDeactivateFn = (...guardParameters) => 
      TestBed.runInInjectionContext(() => planePageExitGuard(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
});
