import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';

import {
  HomeworkDatagridComponent,
  GridTemplateDirective,
} from '../../../../shared/components/homework-datagrid/homework-datagrid.component';

import { DynamicGridConfig } from '../../../../shared/models/homework-datagrid.model';
import { HomeworkButton } from '../../../../shared/components/homework-button/homework-button.component';
import { HomeworkInputComponent } from '../../../../shared/components/homework-input/homework-input.component';
import { HomeworkFormpopup } from '../../../../shared/components/homework-formpopup/homework-formpopup.component';
import { DxDateBoxModule } from 'devextreme-angular/ui/date-box';
import { DxSelectBoxModule } from 'devextreme-angular/ui/select-box';
import {
  HomeworkDropdownComponent,
  HomeworkDropdownItem,
} from '../../../../shared/components/homework-dropdown/homework-dropdown.component';
import { OrderRoute } from '../../../../shared/routers/order.const';
import {
  OrderMasterApiService,
  OrderItemViewModel,
  OrderInfoViewModel,
  OrderUpdateViewModel,
  OrderViewModel,
} from '../../services/ordermaster.service';
import {
  ProductMasterApiService,
  ProductMasterViewModel,
} from '../../services/productmaster.service';
import { LoadingService } from '../../../../core/services/loading.service';

export interface OrderItem {
  orderItemId: number;
  productId?: number;
  productCode: string;
  productName: string;
  qty: number;
  price: number;
  total: number;
  orderItemStatus?: string;
  isNew?: boolean;
}

export interface OrderDetailInterface {
  orderId: number;
  orderNo: string;
  orderDate: Date | string;
  status: string;
  items: OrderItem[];
}

@Component({
  selector: 'orderdetail',
  standalone: true,
  imports: [
    CommonModule,
    HomeworkDatagridComponent,
    GridTemplateDirective,
    HomeworkButton,
    HomeworkInputComponent,
    HomeworkFormpopup,
    DxDateBoxModule,
    DxSelectBoxModule,
  ],
  templateUrl: './orderdetail.html',
  styleUrl: './orderdetail.css',
})
export class OrderDetail implements OnInit, OnDestroy {
  public loadingService = inject(LoadingService);
  public mode: 'create' | 'edit' = 'create';
  public orderId: number | null = null;

  public orderDetail: OrderDetailInterface = this.createEmptyOrder();

  public isItemPopupVisible = false;
  public selectedItem: OrderItem | null = null;

  public itemGridConfig: DynamicGridConfig<OrderItem> = {
    keyExpr: 'orderItemId',
    pageSize: 10,
    columns: [
      {
        dataField: 'productCode',
        caption: 'Product Code',
        dataType: 'string',
        columnType: 'text',
      },
      {
        dataField: 'productName',
        caption: 'Product Name',
        dataType: 'string',
        columnType: 'text',
      },
      {
        dataField: 'qty',
        caption: 'Qty',
        dataType: 'number',
        columnType: 'number',
      },
      {
        dataField: 'price',
        caption: 'Unit Price',
        dataType: 'number',
        columnType: 'number',
        cellTemplate: 'priceTemplate',
      },
      {
        dataField: 'total',
        caption: 'Total',
        dataType: 'number',
        columnType: 'number',
        cellTemplate: 'totalTemplate',
      },
      {
        caption: 'Actions',
        columnType: 'action',
        cellTemplate: 'actionTemplate',
        alignment: 'center',
      },
    ],
    actions: [
      {
        label: '',
        theme: 'Secondary',
        size: 'sm',
        iconCode: 'edit',
        showDefaultLabel: false,
        onClick: (row) => this.editItem(row),
      },
      {
        label: '',
        theme: 'Danger',
        size: 'sm',
        iconCode: 'delete',
        showDefaultLabel: false,
        onClick: (row) => this.deleteItem(row),
      },
    ],
  };

  public allProductsList: ProductMasterViewModel[] = [];
  public productsList: ProductMasterViewModel[] = [];

  constructor(
    private route: ActivatedRoute,
    private orderService: OrderMasterApiService,
    private productService: ProductMasterApiService,
    private router: Router,
  ) {}

  ngOnInit(): void {
    this.loadProducts();
    this.route.queryParams.subscribe((params) => {
      this.mode = params['mode'] === 'edit' ? 'edit' : 'create';
      this.orderId = params['orderId'] ? Number(params['orderId']) : null;

      if (this.mode === 'edit' && this.orderId) {
        this.loadOrderDetail(this.orderId);
      } else {
        this.orderDetail = this.createEmptyOrder();
        this.generateNewOrderNo();
      }
    });
  }

  ngOnDestroy(): void {}

  private loadProducts(): void {
    this.productService
      .GetProductList({ pageNumber: 1, pageSize: 1000, onlyWithStock: true })
      .subscribe({
        next: (response) => {
          this.allProductsList = Array.isArray(response) ? response : response?.data || [];
          this.updateProductsList();
        },
        error: (err) => {
          console.error('Failed to load products:', err);
        },
      });
  }

  public updateProductsList(): void {
    if (!this.allProductsList) return;

    this.productsList = this.allProductsList
      .map((p) => {
        const allocated = this.orderDetail.items
          .filter(
            (item) =>
              item.productId === p.productId &&
              (!this.selectedItem || item.orderItemId !== this.selectedItem.orderItemId),
          )
          .reduce((sum, item) => sum + Number(item.qty), 0);

        return {
          ...p,
          stockQty: p.stockQty - allocated,
        };
      })
      .filter(
        (p) =>
          p.stockQty > 0 ||
          (this.selectedItem && p.productId === this.selectedItem.productId),
      );
  }

  private createEmptyOrder(): OrderDetailInterface {
    return {
      orderId: 0,
      orderNo: 'NEW',
      orderDate: new Date().toISOString().slice(0, 10),
      status: 'Draft',
      items: [],
    };
  }

  private generateNewOrderNo(): void {
    this.orderService.GetNextOrderNo().subscribe({
      next: (res) => {
        this.orderDetail.orderNo = res.nextOrderNo;
      },
      error: (err) => {
        console.error('Failed to load next order number from server:', err);
        // Fallback
        const today = new Date();
        const year = today.getUTCFullYear();
        this.orderDetail.orderNo = `ORD-${year}-0001`;
      },
    });
  }

  private loadOrderDetail(orderId: number): void {
    this.orderService.GetOrderInfo(orderId).subscribe((response) => {
      this.orderDetail = {
        orderId: response.orderId,
        orderNo: response.orderNo,
        orderDate: response.orderDate,
        status: response.status,
        items: (response.orderItems || []).map((item) => ({
          orderItemId: item.orderItemId,
          productId: item.productId,
          productCode: item.productCode || '',
          productName: item.productName,
          qty: item.qty,
          price: item.price,
          total: item.qty * item.price,
          orderItemStatus: item.orderItemStatus,
        })),
      };
      this.updateProductsList();
    });
  }

  public onStatusChange(item: HomeworkDropdownItem): void {
    this.orderDetail.status = String(item.id);
  }

  public get pageTitle(): string {
    return this.mode === 'create' ? 'Create Order' : 'Edit Order';
  }

  public get subtotal(): number {
    return this.orderDetail.items.reduce((sum, item) => sum + item.total, 0);
  }

  public get maxStock(): number {
    if (!this.selectedItem || !this.selectedItem.productId) {
      return 0;
    }
    const matchedProduct = this.productsList.find(
      (p) => p.productId === this.selectedItem?.productId,
    );
    return matchedProduct ? matchedProduct.stockQty : 0;
  }

  public openAddItemPopup(): void {
    this.selectedItem = {
      orderItemId: this.getNextItemId(),
      productId: undefined,
      productCode: '',
      productName: '',
      qty: 1,
      price: 0,
      total: 0,
      orderItemStatus: 'Pending',
      isNew: true,
    };
    this.updateProductsList();
    this.isItemPopupVisible = true;
  }

  public editItem(item: OrderItem): void {
    this.selectedItem = { ...item };
    this.updateProductsList();
    this.isItemPopupVisible = true;
  }

  public deleteItem(item: OrderItem): void {
    this.orderDetail.items = this.orderDetail.items.filter(
      (x) => x.orderItemId !== item.orderItemId,
    );
    this.updateProductsList();
  }

  public closeItemPopup(): void {
    this.isItemPopupVisible = false;
    this.selectedItem = null;
    this.updateProductsList();
  }

  public onProductChanged(productId: any): void {
    if (!this.selectedItem) {
      return;
    }
    const matchedProduct = this.allProductsList.find((p) => p.productId === productId);
    if (matchedProduct) {
      this.selectedItem.productId = matchedProduct.productId;
      this.selectedItem.productCode = matchedProduct.productCode;
      this.selectedItem.productName = matchedProduct.name;
      this.selectedItem.price = matchedProduct.price;
    } else {
      this.selectedItem.productId = undefined;
      this.selectedItem.productCode = '';
      this.selectedItem.productName = '';
      this.selectedItem.price = 0;
    }
    this.updateProductsList();
  }

  public saveItem(): void {
    if (!this.selectedItem) {
      return;
    }

    const matchedProduct = this.allProductsList.find(
      (p) =>
        p.productId === this.selectedItem!.productId ||
        (p.productCode &&
          this.selectedItem!.productCode &&
          p.productCode.toLowerCase() === this.selectedItem!.productCode.trim().toLowerCase()),
    );

    if (matchedProduct) {
      this.selectedItem.productId = matchedProduct.productId;
      this.selectedItem.productCode = matchedProduct.productCode;
      this.selectedItem.productName = matchedProduct.name;
      if (!this.selectedItem.price) {
        this.selectedItem.price = matchedProduct.price;
      }
    } else {
      console.warn('Product not found in products list');
    }

    this.selectedItem.total = Number(this.selectedItem.qty) * Number(this.selectedItem.price);

    const exists = this.orderDetail.items.some(
      (x) => x.orderItemId === this.selectedItem!.orderItemId,
    );

    if (exists) {
      this.orderDetail.items = this.orderDetail.items.map((item) =>
        item.orderItemId === this.selectedItem!.orderItemId ? { ...this.selectedItem! } : item,
      );
    } else {
      this.orderDetail.items = [...this.orderDetail.items, { ...this.selectedItem }];
    }

    this.closeItemPopup();
  }

  private saveOrder(): void {
    const orderUpdate: OrderUpdateViewModel = {
      orderId: this.orderDetail.orderId,
      orderDate: this.orderDetail.orderDate,
      orderItems: this.orderDetail.items.map((item) => ({
        orderItemId: item.isNew ? null : item.orderItemId,
        productId: item.productId || 0,
        qty: item.qty,
        price: item.price,
        orderItemStatus: item.orderItemStatus || 'Pending',
      })) as any[],
    };

    const apiCall =
      this.orderDetail.orderId === 0
        ? this.orderService.CreateOrder(orderUpdate)
        : this.orderService.SaveOrder(orderUpdate);

    apiCall.subscribe({
      next: (response) => {
        console.log('Order saved successfully:', response);
        this.goBack();
      },
      error: (err) => {
        console.error('Failed to save order:', err);
      },
    });
  }

  public saveDraft(): void {
    this.orderDetail.status = 'Draft';
    this.saveOrder();
  }

  public submitOrder(): void {
    this.orderDetail.status = 'Submit';
    this.saveOrder();
  }

  public goBack(): void {
    this.router.navigate([`/${OrderRoute.fullOrderDetailsPath}`]);
  }

  private getNextItemId(): number {
    if (this.orderDetail.items.length === 0) {
      return 1;
    }

    return Math.max(...this.orderDetail.items.map((x) => x.orderItemId)) + 1;
  }
}
