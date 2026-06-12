import { inject } from '@angular/core';
import { CanActivateFn, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { catchError, map, of } from 'rxjs';
import { PostLoginNavbarService } from '../../layouts/post-login-layout/services/navbar.service';
import { GuardService } from '../../core/services/guard.service';
export const permissionGuard:   CanActivateFn = (route: ActivatedRouteSnapshot, state: RouterStateSnapshot) => {
  const guardService = inject(GuardService);
  const postLoginNavbarService = inject(PostLoginNavbarService);
    const router = inject(Router);
    const requiredPermission = route.data['pageCode'] as string;
    if(!requiredPermission) {
        console.warn('No pageCode specified in route data for permissionGuard');
        return true;
    }
    return postLoginNavbarService.getPrivPage(requiredPermission).pipe(
        map(response => {
            if (response.hasAccess) {
                guardService.setPermission(response.permissionCode);
                return true;
            }
            return false;
        }
        ),
        catchError(error => {
            console.error('Error checking permissions:', error);
            router.navigate(['/main/products']);
            return of(false);
        })
    );
};