import { AirlineSectSvcService } from '@airlineSection/services/AirlineSectSvc.service';
import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  CanActivateFn,
  CanDeactivateFn,
  GuardResult,
  MaybeAsync,
  Router,
  RouterStateSnapshot,
} from '@angular/router';
import { AuthService } from '@auth/services/auth.service';
import Swal from 'sweetalert2';

export const planePageExitGuard: CanDeactivateFn<unknown> = async (
  component,
  currentRoute,
  currentState,
  nextState
) => {
  const RES = await Swal.fire({
    title: '¿Estás seguro de salir de la página?',
    text: 'Los cambios realizados no se guardarán',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    confirmButtonText: 'Salir',
    cancelButtonText: 'Cancelar',
  });
  return RES.isConfirmed;
};

@Injectable({
  providedIn: 'root',
})
export class planeActivateGuard implements CanActivate {
  constructor(
    private authSvc: AuthService,
    private airlineSectSvc: AirlineSectSvcService,
    private router: Router
  ) {}
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): MaybeAsync<GuardResult> {
    if (
      this.authSvc.hasRoles(['ADMINISTRATOR']) &&
      this.airlineSectSvc.getCurrentAirline() == undefined
    ) {
      Swal.fire('No se ha seleccionado una aerolinea', '', 'error');
      this.router.navigate(['/session/airline-section/plane-home']);
      return false;
    }
    return true;
  }
}

// export const planeActivateGuard: CanActivateFn = async () => {

//   return true;
// };
