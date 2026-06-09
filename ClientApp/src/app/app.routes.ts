import { Routes } from '@angular/router';
import { PreLoginLayout } from './layouts/pre-login-layout/pre-login-layout';
import { PostLoginLayout } from './layouts/post-login-layout/post-login-layout';
import { AuthenticationRoute } from './shared/routers/authentication.const';
import { NotFound } from './layouts/not-found/not-found.component';
import { Unauthorized } from './layouts/unauthorized/unauthorized.component';
import { Forbidden } from './layouts/forbidden/forbidden.component';
import { NetworkError } from './layouts/network-error/network-error.component';
import { guestGuard } from './core/guards/guest.guard';
import { authGuard } from './core/guards/auth.guard';
import { Test } from './modules/main/pages/test/test';
// import { MainRoute } from './shared/routers/main.const';
export const routes: Routes = [
  {
    path: '',
    component: PreLoginLayout,
    canActivateChild: [guestGuard],
    children: [
      {
        path: '',
        redirectTo: AuthenticationRoute.login,
        pathMatch: 'full',
      },
      {
        path: AuthenticationRoute.prefix,
        loadChildren: () =>
          import('./modules/authentication/authentication.module')
            .then(m => m.AuthenticationModule)
      }
    ]
  },

  {
    path: '',
    component: PostLoginLayout,
    canActivateChild: [authGuard],
    children: [
      {
        path: 'main',
        loadChildren: () =>
          import('./modules/main/main.module')
            .then(m => m.MainModule)
      }
    ]
  },

  { path: 'not-found', component: NotFound },
  { path: 'unauthorized', component: Unauthorized },
  { path: 'forbidden', component: Forbidden },
  { path: 'network-error', component: NetworkError },
  { path:'test', component:Test},
  { path: '**', redirectTo: 'not-found' },
];