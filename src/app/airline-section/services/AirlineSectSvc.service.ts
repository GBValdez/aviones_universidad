import { airlineDto } from '@airline/interface/airline.interface';
import { Injectable } from '@angular/core';
import { AuthService } from '@auth/services/auth.service';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AirlineSectSvcService {
  private currentAirlineSubject: BehaviorSubject<airlineDto | undefined> =
    new BehaviorSubject<airlineDto | undefined>(undefined);

  constructor(private authSvc: AuthService) {}

  setCurrentAirline(airline: airlineDto | undefined): void {
    this.currentAirlineSubject.next(airline);
  }
  getCurrentAirline(): airlineDto | undefined {
    return this.currentAirlineSubject.value;
  }
  getCurrentAirlineObservable(): Observable<airlineDto | undefined> {
    return this.currentAirlineSubject.asObservable();
  }
  canOperation(): boolean {
    return (
      (this.authSvc.hasRoles(['ADMINISTRATOR']) &&
        this.getCurrentAirline() !== undefined) ||
      this.authSvc.hasRoles(['ADMINISTRATOR_AIRLINE'])
    );
  }
}
