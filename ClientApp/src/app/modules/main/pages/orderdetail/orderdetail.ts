import { Component, OnDestroy, OnInit } from '@angular/core';
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
import {
  HomeworkDropdownComponent,
  HomeworkDropdownItem,
} from '../../../../shared/components/homework-dropdown/homework-dropdown.component';
import { OrderRoute } from '../../../../shared/routers/order.const';
export interface OrderItem {
  orderItemId: number;
  productCode: string;
  productName: string;
  qty: number;
  unitPrice: number;
  total: number;
}

export interface OrderDetailInterface {
  orderId: number;
  orderNo: string;
  customerName: string;
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
    HomeworkDropdownComponent,
  ],
  templateUrl: './orderdetail.html',
  styleUrl: './orderdetail.css',
})
export class OrderDetail implements OnInit, OnDestroy {
  public mode: 'create' | 'edit' = 'create';
  public orderId: number | null = null;

  public orderDetail: OrderDetailInterface = this.createEmptyOrder();

  public isItemPopupVisible = false;
  public selectedItem: OrderItem | null = null;
  public statusItems: HomeworkDropdownItem[] = [
    { id: 'Draft', text: 'Draft', icon: 'edit' },
    { id: 'Submit', text: 'Submit', icon: 'send' },
    { id: 'Approved', text: 'Approved', icon: 'check' },
    { id: 'Rejected', text: 'Rejected', icon: 'close' },
  ];
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
        dataField: 'unitPrice',
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

  constructor(
    private route: ActivatedRoute,
    private router: Router,
  ) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe((params) => {
      this.mode = params['mode'] === 'edit' ? 'edit' : 'create';
      this.orderId = params['orderId'] ? Number(params['orderId']) : null;

      if (this.mode === 'edit' && this.orderId) {
        this.loadMockOrder(this.orderId);
      } else {
        this.orderDetail = this.createEmptyOrder();
      }
    });
  }

  ngOnDestroy(): void {}

  private createEmptyOrder(): OrderDetailInterface {
    return {
      orderId: 0,
      orderNo: 'NEW',
      customerName: '',
      orderDate: new Date().toISOString().slice(0, 10),
      status: 'Draft',
      items: [],
    };
  }

  private loadMockOrder(orderId: number): void {
    this.orderDetail = {
      orderId,
      orderNo: `ORD-20260611-${String(orderId).padStart(3, '0')}`,
      customerName: 'John Smith',
      orderDate: '2026-06-11',
      status: 'Draft',
      items: [
        {
          orderItemId: 1,
          productCode: 'P-KEYBOARD-001',
          productName: 'Mechanical Keyboard',
          qty: 2,
          unitPrice: 2500,
          total: 5000,
        },
        {
          orderItemId: 2,
          productCode: 'P-MOUSE-001',
          productName: 'Wireless Mouse',
          qty: 1,
          unitPrice: 890,
          total: 890,
        },
      ],
    };
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

  public get vatAmount(): number {
    return this.subtotal * 0.07;
  }

  public get grandTotal(): number {
    return this.subtotal + this.vatAmount;
  }

  public openAddItemPopup(): void {
    this.selectedItem = {
      orderItemId: this.getNextItemId(),
      productCode: '',
      productName: '',
      qty: 1,
      unitPrice: 0,
      total: 0,
    };

    this.isItemPopupVisible = true;
  }

  public editItem(item: OrderItem): void {
    this.selectedItem = { ...item };
    this.isItemPopupVisible = true;
  }

  public deleteItem(item: OrderItem): void {
    this.orderDetail.items = this.orderDetail.items.filter(
      (x) => x.orderItemId !== item.orderItemId,
    );
  }

  public closeItemPopup(): void {
    this.isItemPopupVisible = false;
    this.selectedItem = null;
  }

  public saveItem(): void {
    if (!this.selectedItem) {
      return;
    }

    this.selectedItem.total = Number(this.selectedItem.qty) * Number(this.selectedItem.unitPrice);

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

  public saveDraft(): void {
    console.log('Save Draft', this.orderDetail);
  }

  public submitOrder(): void {
    this.orderDetail.status = 'Submit';
    console.log('Submit Order', this.orderDetail);
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
