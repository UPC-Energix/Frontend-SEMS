import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivateFn, Router, UrlTree } from '@angular/router';
import { SessionService } from '../services/session.service';

export const roleGuard: CanActivateFn = (route: ActivatedRouteSnapshot): boolean | UrlTree => {
  const session = inject(SessionService);
  const router = inject(Router);
  const allowedRoles = route.data['roles'] as string[] | undefined;

  if (!session.isAuthenticated) {
    return router.createUrlTree(['/login']);
  }

  if (!allowedRoles?.length) {
    return true;
  }

  const currentRole = session.currentUser?.role;
  return currentRole && allowedRoles.includes(currentRole) ? true : router.createUrlTree(['/home']);
};

