import { NgModule } from '@angular/core';
import { SharedModule } from '../../shared/shared.module';

import { LoginComponent } from './pages/login/login.component';
import { RegisterComponent } from './pages/register/register.component';

import { AuthenticationRoutingModule } from './authentication-routing.module';

@NgModule({
 
  imports: [
    LoginComponent,
    RegisterComponent,
    SharedModule,
    AuthenticationRoutingModule
  ]
})
export class AuthenticationModule {}