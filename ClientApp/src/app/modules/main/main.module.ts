import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MainRoutingModule } from './main-routing.module';
// import { SharedModule } from '../shared/shared.module';

// import { DashboardComponent } from './pages/dashboard/dashboard.component';
// import { ProfileComponent } from './pages/profile/profile.component';

// import { MainRoutingModule } from './main-routing.module';

@NgModule({
  imports: [
    CommonModule,
    MainRoutingModule,
    FormsModule,
  ]
})
export class MainModule {}