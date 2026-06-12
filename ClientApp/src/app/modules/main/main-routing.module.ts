import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { OrderRoute } from '../../shared/routers/order.const';
import { ProductMasterRoute } from '../../shared/routers/productmaster.const';
import {ProductMaster} from "./pages/productmaster/productmaster";
// import { DashboardComponent } from './pages/dashboard/dashboard.component';
// import { ProfileComponent } from './pages/profile/profile.component';
import {OrderList} from "./pages/orderlist/orderlist";
import {OrderDetail} from "./pages/orderdetail/orderdetail";
const MainRoutes: Routes = [
  {
    path: '',
    redirectTo: ProductMasterRoute.productMasterList,
    pathMatch: 'full'
  },
  {
    path: OrderRoute.orderList,
    component: OrderList
  },
  {
    path: OrderRoute.orderDetails,
    component: OrderDetail
  },
  {
    path: ProductMasterRoute.productMasterList,
    component: ProductMaster
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