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
    console.log('MainRedirectComponent: Loading menus from getNavbar...');
    this.navbarService.getNavbar().subscribe({
      next: (menus) => {
        console.log('MainRedirectComponent menus:', menus);
        if (menus && menus.length > 0) {
          let pageUrl = menus[0].pageUrl;
          if (pageUrl.startsWith('/')) {
            pageUrl = pageUrl.substring(1);
          }
          const targetUrl = `/main/${pageUrl}`;
          console.log('MainRedirectComponent: Navigating to:', targetUrl);
          this.router.navigate([targetUrl]);
        } else {
          console.warn('MainRedirectComponent: No menus returned, redirecting to /forbidden');
          this.router.navigate(['/forbidden']);
        }
      },
      error: (err) => {
        console.error('MainRedirectComponent error loading menus:', err);
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