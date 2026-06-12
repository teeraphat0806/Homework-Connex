import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

import {
  HomeworkDatagridComponent,
  GridTemplateDirective,
} from '../../../../shared/components/homework-datagrid/homework-datagrid.component';

import { HomeworkButton } from '../../../../shared/components/homework-button/homework-button.component';
import { DynamicGridConfig } from '../../../../shared/models/homework-datagrid.model';
import { OrderRoute } from '../../../../shared/routers/order.const';

export interface OrderListRow {
  orderId: number;
  orderNo: string;
  customerName: string;
  orderDate: Date;
  totalAmount: number;
  status: string;
}

@Component({
  selector: 'app-orderlist',
  standalone: true,
  imports: [CommonModule, HomeworkDatagridComponent, HomeworkButton, GridTemplateDirective],
  templateUrl: './orderlist.html',
  styleUrl: './orderlist.css',
})
export class OrderList {
  constructor(private router: Router) {}

  orders: OrderListRow[] = [
    {
      orderId: 1,
      orderNo: 'ORD-20260611-001',
      customerName: 'John Smith',
      orderDate: new Date('2026-06-11'),
      totalAmount: 2500,
      status: 'Draft',
    },
    {
      orderId: 2,
      orderNo: 'ORD-20260611-002',
      customerName: 'Alice Brown',
      orderDate: new Date('2026-06-11'),
      totalAmount: 5800,
      status: 'Submit',
    },
    {
      orderId: 3,
      orderNo: 'ORD-20260610-001',
      customerName: 'Michael Johnson',
      orderDate: new Date('2026-06-10'),
      totalAmount: 12000,
      status: 'Approved',
    },
  ];

  gridConfig: DynamicGridConfig<OrderListRow> = {
    keyExpr: 'orderId',
    pageSize: 10,
    columns: [
      {
        dataField: 'orderNo',
        caption: 'Order No',
        dataType: 'string',
        columnType: 'text',
      },
      {
        dataField: 'customerName',
        caption: 'Customer',
        dataType: 'string',
        columnType: 'text',
      },
      {
        dataField: 'orderDate',
        caption: 'Order Date',
        dataType: 'date',
        format: 'dd/MM/yyyy',
        columnType: 'date',
      },
      {
        dataField: 'totalAmount',
        caption: 'Total Amount',
        dataType: 'number',
        columnType: 'number',
        cellTemplate: 'amountTemplate',
      },
      {
        dataField: 'status',
        caption: 'Status',
        dataType: 'string',
        columnType: 'status',
        cellTemplate: 'statusTemplate',
      },
      {
        caption: 'Actions',
        cellTemplate: 'orderActionTemplate',
        alignment: 'center',
        width: 180,
      },
    ],
    actions: [
      {
        label: '',
        theme: 'Secondary',
        size: 'sm',
        iconCode: 'edit',
        showDefaultLabel: false,
        visible: (row) => row.status !== 'Submit',
        onClick: (row) => this.goToEditOrder(row.orderId),
      },
      {
        label: '',
        theme: 'Danger',
        size: 'sm',
        iconCode: 'delete',
        showDefaultLabel: false,
        visible: (row) => row.status !== 'Submit',
        onClick: (row) => this.deleteItem(row),
      },
      {
        label: '',
        theme: 'Primary',
        size: 'sm',
        iconCode: 'check',
        showDefaultLabel: false,
        visible: (row) => row.status !== 'Submit',
        onClick: (row) => this.confirmOrder(row),
      },
    ],
  };

  goToCreateOrder(): void {
    this.router.navigate([`/${OrderRoute.fullOrderDetailsPath}`], {
      queryParams: {
        mode: 'create',
      },
    });
  }

  goToEditOrder(orderId: number): void {
    this.router.navigate([`/${OrderRoute.fullOrderDetailsPath}`], {
      queryParams: {
        mode: 'edit',
        orderId: orderId,
      },
    });
  }
  deleteItem(row: OrderListRow): void {
    this.orders = this.orders.filter((x) => x.orderId !== row.orderId);
  }
  confirmOrder(row: OrderListRow): void {
    row.status = 'Submit';
    this.orders = [...this.orders];
  }
}
