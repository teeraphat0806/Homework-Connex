import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';

let alreadyRedirecting = false;

export const AuthInterceptor: HttpInterceptorFn = (request, next) => {
  const router = inject(Router);

  const authRequest = request.clone({
    withCredentials: true
  });

  return next(authRequest).pipe(
    catchError((error: HttpErrorResponse) => {
      const isSessionValidEndpoint = request.url.includes('is-session-valid');

      if (isSessionValidEndpoint) {
        return throwError(() => error);
      }

      if (error.status === 401 && !alreadyRedirecting) {
        alreadyRedirecting = true;

        router.navigate(['/unauthorized']).finally(() => {
          alreadyRedirecting = false;
        });
      }
      else if (error.status === 403 && !alreadyRedirecting) {
        alreadyRedirecting = true;

        router.navigate(['/forbidden']).finally(() => {
          alreadyRedirecting = false;
        });
      }

      return throwError(() => error);
    })
  );
};