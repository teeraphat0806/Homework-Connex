import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { map, take } from 'rxjs';
import { AuthApiService } from '../../modules/authentication/services/auth.service';

export const guestGuard: CanActivateFn = () => {
  const authApiService = inject(AuthApiService);
  const router = inject(Router);
  const currentUser = authApiService.GetCurrentUser();

  if (!currentUser()) {
    return true;
  }

  return authApiService.IsSessionValid().pipe(
    take(1),
    map(session => {
      if (!session.IsValid) {
        return true;
      }

      router.navigate(['/main/dashboard']);
      return false;
    })
  );
};