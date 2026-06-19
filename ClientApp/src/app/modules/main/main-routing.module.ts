import { NgModule, OnInit, Component } from '@angular/core';
import { RouterModule, Routes, Router } from '@angular/router';
import { OrderRoute } from '../../shared/routers/order.const';
import { ProductMasterRoute } from '../../shared/routers/productmaster.const';
import { ProductMaster } from "./pages/productmaster/productmaster";
import { OrderList } from "./pages/orderlist/orderlist";
import { OrderDetail } from "./pages/orderdetail/orderdetail";
import { OrderListAdmin } from './pages/orderlistadmin/orderlistadmin';
import { OrderDetailAdmin } from './pages/orderdetailadmin/orderdetailadmin';
import { permissionGuard } from '../../core/guards/permission.guard';
import { PostLoginNavbarService } from '../../layouts/post-login-layout/services/navbar.service';

@Component({
  template: '',
  standalone: true
})
export class MainRedirectComponent implements OnInit {
  constructor(private navbarService: PostLoginNavbarService, private router: Router) {}
  ngOnInit() {
    this.navbarService.getNavbar().subscribe({
      next: (menus) => {
        if (menus && menus.length > 0) {
          this.router.navigate([`/main/${menus[0].pageUrl}`]);
        } else {
          this.router.navigate(['/forbidden']);
        }
      },
      error: () => {
        this.router.navigate(['/forbidden']);
      }
    });
  }
}

const MainRoutes: Routes = [
  {
    path: '',
    component: MainRedirectComponent,
    pathMatch: 'full'
  },
  {
    path: OrderRoute.orderList,
    component: OrderList,
    canActivate: [permissionGuard],
    data: { pageCode: 'ORDER_MEMBER' }
  },
  {
    path: OrderRoute.orderAdminList,
    component: OrderListAdmin,
    canActivate: [permissionGuard],
    data: { pageCode: 'ORDER_ADMIN' }
  },
  {
    path: OrderRoute.orderDetails,
    component: OrderDetail,
    canActivate: [permissionGuard],
    data: { pageCode: 'ORDER_DETAIL_MEMBER' }
  },
  {
    path: OrderRoute.orderAdminDetails,
    component: OrderDetailAdmin,
    canActivate: [permissionGuard],
    data: { pageCode: 'ORDER_DETAIL_ADMIN' }
  },
  {
    path: ProductMasterRoute.productMasterList,
    component: ProductMaster,
    canActivate: [permissionGuard],
    data: { pageCode: 'PRODUCT' }
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