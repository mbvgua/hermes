import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { Auth } from '../services/auth/auth';

export const authGuard: CanActivateFn = (route, state) => {
  const auth = inject(Auth);
  const router = inject(Router);

  // if logged in allow access
  if (auth.showStatus()) {
    return true;
  }
  // else if not looged in, deny access
  router.navigate(['/auth/login']);
  return false;
};
