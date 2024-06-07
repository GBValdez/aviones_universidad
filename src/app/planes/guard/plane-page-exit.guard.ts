import { CanDeactivateFn } from '@angular/router';
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
