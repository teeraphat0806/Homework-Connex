import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { LoginComponent } from './pages/login/login.component';
import { RegisterComponent } from './pages/register/register.component';

const AuthenticationRoutes: Routes = [
    {path: 'login', component: LoginComponent},
    {path: 'register', component: RegisterComponent}
];

@NgModule({
  imports: [RouterModule.forChild(AuthenticationRoutes)],
  exports: [RouterModule]
})
export class AuthenticationRoutingModule {}