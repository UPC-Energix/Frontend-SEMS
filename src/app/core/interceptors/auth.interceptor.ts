import { HttpErrorResponse, HttpInterceptorFn, HttpRequest } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, switchMap, throwError } from 'rxjs';
import { AuthService } from '../../sems/iam/application/services/auth.service';
import { TokenService } from '../../sems/iam/infrastructure/services/token.service';

const PUBLIC_AUTH_PATHS = ['/sign-in', '/sign-up', '/login', '/refresh', '/reset-password'];
let isRefreshing = false;

function shouldSkipRefresh(url: string): boolean {
  return PUBLIC_AUTH_PATHS.some(path => url.includes(path));
}

function addBearer(request: HttpRequest<unknown>, token: string | null): HttpRequest<unknown> {
  if (!token || request.headers.has('Authorization')) {
    return request;
  }

  return request.clone({
    setHeaders: {
      Authorization: `Bearer ${token}`
    }
  });
}

export const authInterceptor: HttpInterceptorFn = (request, next) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  const tokenService = inject(TokenService);

  return next(addBearer(request, tokenService.getAccessToken())).pipe(
    catchError((error: unknown) => {
      if (!(error instanceof HttpErrorResponse) || error.status !== 401 || shouldSkipRefresh(request.url)) {
        return throwError(() => error);
      }

      if (!tokenService.getRefreshToken() || isRefreshing) {
        tokenService.clearTokens();
        void router.navigate(['/login']);
        return throwError(() => error);
      }

      isRefreshing = true;

      return authService.refreshToken().pipe(
        switchMap(() => {
          isRefreshing = false;
          return next(addBearer(request, tokenService.getAccessToken()));
        }),
        catchError(refreshError => {
          isRefreshing = false;
          tokenService.clearTokens();
          void router.navigate(['/login']);
          return throwError(() => refreshError);
        })
      );
    })
  );
};

