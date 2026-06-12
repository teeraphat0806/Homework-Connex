import { Component, OnDestroy, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DxPopupModule } from 'devextreme-angular/ui/popup';
import { FormsModule } from '@angular/forms';
import { mockDatabase } from '../../../mock/mock-data';
import {
  HomeworkDatagridComponent,
} from '../homework-datagrid/homework-datagrid.component';
import { DynamicGridConfig } from '../../models/homework-datagrid.model';
export interface OrderRow {
  orderId: number;
  orderNo: string;
  orderDate: string | Date;
  totalAmount: number;
  status: string;
}

@Component({
  selector: 'homework-order-list',
  standalone: true,
  imports: [CommonModule, HomeworkDatagridComponent, DxPopupModule, FormsModule],
  templateUrl: './homework-order-list.component.html',
  styleUrl: './homework-order-list.component.css',
})
export class HomeworkOrderListComponent implements OnChanges, OnDestroy {
  database = mockDatabase;

  orders = this.database.orders as OrderRow[];

  isEditPopupVisible = false;
  selectedOrder: OrderRow | null = null;

  gridConfig: DynamicGridConfig<OrderRow> = {
    keyExpr: 'orderId',
    pageSize: 10,
    columns: [
      { dataField: 'orderId', caption: 'ID', dataType: 'number', columnType: 'text' },
      { dataField: 'orderNo', caption: 'Order No', dataType: 'string', columnType: 'text' },
      { dataField: 'orderDate', caption: 'Order Date', dataType: 'date', columnType: 'date' },
      { dataField: 'totalAmount', caption: 'Total Amount', dataType: 'number', columnType: 'number' },
      {
        caption: 'Actions',
        columnType: 'action',
        cellTemplate: 'actionTemplate',
        alignment: 'center',
      },
    ],
    actions: [
      {
        label: 'Edit',
        theme: 'Secondary',
        size: 'sm',
        onClick: (row) => this.editOrder(row),
      },
      {
        label: 'Delete',
        theme: 'Danger',
        size: 'sm',
        onClick: (row) => this.deleteOrder(row),
      },
      {
        label: 'Confirm',
        theme: 'Primary',
        size: 'sm',
        onClick: (row) => this.confirmOrder(row),
      },
    ],
  };

  editOrder(order: OrderRow): void {
    this.selectedOrder = { ...order };
    this.isEditPopupVisible = true;
  }

  deleteOrder(order: OrderRow): void {
    this.orders = this.orders.filter((x) => x.orderId !== order.orderId);
  }

  confirmOrder(order: OrderRow): void {
    order.status = 'Pending';
    this.orders = [...this.orders];
  }

  closeEditPopup(): void {
    this.isEditPopupVisible = false;
    this.selectedOrder = null;
  }

  saveEditOrder(): void {
    if (!this.selectedOrder) return;

    this.orders = this.orders.map((order) =>
      order.orderId === this.selectedOrder!.orderId
        ? { ...this.selectedOrder! }
        : order
    );

    this.closeEditPopup();
  }

  ngOnChanges(changes: SimpleChanges): void {}

  ngOnDestroy(): void {}
}