import { inject } from '@angular/core';
import { CanActivateFn, Router, UrlTree } from '@angular/router';
import { SessionService } from '../services/session.service';

export const publicGuard: CanActivateFn = (): boolean | UrlTree => {
  const session = inject(SessionService);
  const router = inject(Router);

  return session.isAuthenticated ? router.createUrlTree(['/home']) : true;
};

