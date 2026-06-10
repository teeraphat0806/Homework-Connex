import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { map, take } from 'rxjs';
import { AuthApiService } from '../../modules/authentication/services/auth.service';

export const authGuard: CanActivateFn = () => {
  const authApiService = inject(AuthApiService);
  const router = inject(Router);

  return authApiService.IsSessionValid().pipe(
    
    map(session => {
      console.log('AuthGuard session validation result:', session);
      if (session.isValid) {
        console.log('Session is valid, allowing access to route');
        return true;
      }
      router.navigate(['/login']);
      return false;
    })
  );
};