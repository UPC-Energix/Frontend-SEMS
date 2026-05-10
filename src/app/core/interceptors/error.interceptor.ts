import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { catchError, throwError } from 'rxjs';

function getFriendlyMessage(error: HttpErrorResponse): string {
  if (error.status === 0) return 'No se pudo conectar con el API Gateway.';
  if (error.status === 400) return error.error?.message || 'La solicitud contiene datos no válidos.';
  if (error.status === 401) return 'Tu sesión expiró. Inicia sesión nuevamente.';
  if (error.status === 403) return 'No tienes permisos para realizar esta acción.';
  if (error.status === 404) return 'El recurso solicitado no está disponible.';
  if (error.status >= 500) return 'El servicio no está disponible por el momento.';

  return 'Ocurrió un error inesperado.';
}

export const errorInterceptor: HttpInterceptorFn = (request, next) => {
  const snackBar = inject(MatSnackBar);

  return next(request).pipe(
    catchError((error: unknown) => {
      if (error instanceof HttpErrorResponse) {
        snackBar.open(getFriendlyMessage(error), 'Cerrar', {
          duration: 5000,
          panelClass: ['app-snackbar-error']
        });
      }

      return throwError(() => error);
    })
  );
};

