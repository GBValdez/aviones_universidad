import { CanActivateFn } from '@angular/router';

export const selectSeatGuard: CanActivateFn = (route, state) => {
  const id = route.params['id'];
  return true;
};
