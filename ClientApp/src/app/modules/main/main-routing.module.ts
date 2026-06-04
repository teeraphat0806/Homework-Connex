import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

// import { DashboardComponent } from './pages/dashboard/dashboard.component';
// import { ProfileComponent } from './pages/profile/profile.component';

const MainRoutes: Routes = [
  {
    path: 'dashboard',
    // component: DashboardComponent
  },
  {
    path: 'profile',
    // component: ProfileComponent
  }
];

@NgModule({
  imports: [
    RouterModule.forChild(MainRoutes)
  ],
  exports: [
    RouterModule
  ]
})
export class MainRoutingModule {}