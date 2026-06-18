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
  returnedQty?: number;
  pendingReturnQty?: number;
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
  public mode: 'create' | 'edit' | 'return' = 'create';
  public orderId: number | null = null;

  public orderDetail: OrderDetailInterface = this.createEmptyOrder();
  public totalAmount = 0;
  public isItemPopupVisible = false;
  public selectedItem: OrderItem | null = null;

  public isReturnPopupVisible = false;
  public selectedReturnItem: OrderItem | null = null;
  public tempReturnQty = 0;
  public isSubmitConfirmPopupVisible = false;

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
        dataField: 'returnedQty',
        caption: 'คืนแล้ว',
        dataType: 'number',
        columnType: 'number',
        visible: this.mode === 'return',
      },
      {
        dataField: 'pendingReturnQty',
        caption: 'กำลังจะคืน',
        dataType: 'number',
        columnType: 'number',
        visible: this.mode === 'return',
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
        dataField: 'orderItemStatus',
        caption: 'Status',
        dataType: 'string',
        columnType: 'status',
        cellTemplate: 'statusTemplate',
      },
      {
        caption: 'Actions',
        cellTemplate: 'myCustomActionTemplate',
        alignment: 'center',
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
      const queryMode = params['mode'];
      if (queryMode === 'edit') {
        this.mode = 'edit';
      } else if (queryMode === 'return') {
        this.mode = 'return';
      } else {
        this.mode = 'create';
      }
      this.orderId = params['orderId'] ? Number(params['orderId']) : null;

      const returnedQtyCol = this.itemGridConfig.columns.find((c) => c.dataField === 'returnedQty');
      if (returnedQtyCol) {
        returnedQtyCol.visible = this.mode === 'return';
      }
      const pendingReturnQtyCol = this.itemGridConfig.columns.find(
        (c) => c.dataField === 'pendingReturnQty',
      );
      if (pendingReturnQtyCol) {
        pendingReturnQtyCol.visible = this.mode === 'return';
      }
      this.itemGridConfig.columns = [...this.itemGridConfig.columns];

      if ((this.mode === 'edit' || this.mode === 'return') && this.orderId) {
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

    // Merge duplicates in orderDetail.items
    const mergedMap = new Map<number, OrderItem>();
    for (const item of this.orderDetail.items) {
      if (!item.productId) continue;
      const existing = mergedMap.get(item.productId);
      if (existing) {
        if (!item.isNew && existing.isNew) {
          existing.orderItemId = item.orderItemId;
          existing.isNew = false;
          existing.orderItemStatus = item.orderItemStatus;
        }
        existing.qty += Number(item.qty);
        existing.total = existing.qty * existing.price;
      } else {
        mergedMap.set(item.productId, { ...item });
      }
    }
    this.orderDetail.items = Array.from(mergedMap.values());

    this.totalAmount = this.orderDetail.items.reduce((sum, item) => sum + item.qty, 0);

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
        (p) => p.stockQty > 0 || (this.selectedItem && p.productId === this.selectedItem.productId),
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
          returnedQty: item.returnedQty || 0,
          pendingReturnQty: 0,
        })),
      };
      this.updateProductsList();
    });
  }

  public onStatusChange(item: HomeworkDropdownItem): void {
    this.orderDetail.status = String(item.id);
  }

  public get pageTitle(): string {
    if (this.mode === 'create') {
      return 'Create Order';
    } else if (this.mode === 'return') {
      return 'Return Order';
    } else {
      return 'Edit Order';
    }
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
      orderItemStatus: 'Draft',
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
      this.orderDetail.items = [...this.orderDetail.items, { ...this.selectedItem! }];
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
        orderItemStatus: item.orderItemStatus || 'Draft',
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

    if (this.orderDetail.status == 'Submit') {
      this.orderService.SubmitOrder(this.orderDetail.orderId).subscribe({
        next: (response) => {
          console.log('Order submitted successfully:', response);
        },
        error: (err) => {
          console.error('Failed to submit order:', err);
        },
      });
    }

    this.goBack();
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
    this.router.navigate([`/${OrderRoute.fullOrderListPath}`]);
  }

  public returnItem(row: OrderItem): void {
    this.selectedReturnItem = row;
    this.tempReturnQty = row.pendingReturnQty || 0;
    this.isReturnPopupVisible = true;
  }

  public saveReturnItem(): void {
    if (!this.selectedReturnItem) return;

    const maxQty = this.selectedReturnItem.qty - (this.selectedReturnItem.returnedQty || 0);
    if (this.tempReturnQty <= 0 || this.tempReturnQty > maxQty) {
      alert(`จำนวนที่คืนต้องมากกว่า 0 และไม่เกิน ${maxQty}`);
      return;
    }

    this.selectedReturnItem.pendingReturnQty = this.tempReturnQty;
    this.isReturnPopupVisible = false;
    this.selectedReturnItem = null;
  }

  public closeReturnPopup(): void {
    this.isReturnPopupVisible = false;
    this.selectedReturnItem = null;
  }

  public get maxReturnQty(): number {
    if (!this.selectedReturnItem) return 0;
    return this.selectedReturnItem.qty - (this.selectedReturnItem.returnedQty || 0);
  }

  public submitReturn(): void {
    const returnItems = this.orderDetail.items.filter(
      (item) => item.pendingReturnQty && item.pendingReturnQty > 0,
    );

    if (returnItems.length === 0) {
      alert('กรุณาระบุจำนวนสินค้าที่ต้องการคืนอย่างน้อย 1 รายการก่อนส่งคืน');
      return;
    }

    this.isSubmitConfirmPopupVisible = true;
  }

  public executeReturn(): void {
    this.isSubmitConfirmPopupVisible = false;

    const returnItems = this.orderDetail.items
      .filter((item) => item.pendingReturnQty && item.pendingReturnQty > 0)
      .map((item) => ({
        orderItemId: item.orderItemId,
        returnQty: item.pendingReturnQty!,
      }));

    this.loadingService.show();
    this.orderService
      .ReturnOrder({
        orderId: this.orderId!,
        items: returnItems,
      })
      .subscribe({
        next: (response) => {
          this.loadingService.hide();
          if (response.isSuccess) {
            this.goBack();
          } else {
            alert(response.message || 'ไม่สามารถคืนสินค้าได้');
          }
        },
        error: (err) => {
          this.loadingService.hide();
          alert(err?.error?.Message || 'เกิดข้อผิดพลาดในการเชื่อมต่อเซิร์ฟเวอร์');
        },
      });
  }

  private getNextItemId(): number {
    if (this.orderDetail.items.length === 0) {
      return 1;
    }

    return Math.max(...this.orderDetail.items.map((x) => x.orderItemId)) + 1;
  }
}
