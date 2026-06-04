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
      if (error.status === 401 && !alreadyRedirecting) {
        alreadyRedirecting = true;
        router.navigate(['/unauthorized']);
      }
      else if (error.status === 403 && !alreadyRedirecting) {
        alreadyRedirecting = true;
        router.navigate(['/forbidden']);
      }

      return throwError(() => error);
    })
  );
};