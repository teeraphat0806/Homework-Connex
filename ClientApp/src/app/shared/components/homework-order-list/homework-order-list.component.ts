import { Component, OnChanges, Input, Output, EventEmitter, SimpleChanges, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { mockDatabase } from '../../../mock/mock-data';
import {HomeworkDatagridComponent, DynamicGridConfig} from "../homework-datagrid/homework-datagrid.component";
import CustomStore from 'devextreme/data/custom_store';

import {
  DxDataGridModule,
  DxButtonModule,
} from 'devextreme-angular';

@Component({
  selector: 'homework-order-list',
  standalone: true,
  imports: [
    CommonModule,
    DxDataGridModule,
    DxButtonModule,
    HomeworkDatagridComponent
],
  templateUrl: './homework-order-list.component.html',
  styleUrl: './homework-order-list.component.css',
})
export class HomeworkOrderListComponent implements OnChanges, OnDestroy{
  productDataSource!: CustomStore;
  database = mockDatabase;
  totalpage = 100;
  pagesize = 10;
  currentpage = 1;
  products = this.database.products;
  orders = this.database.orders;
  orderItems = this.database.orderItems;
  users = this.database.users;

  gridConfig: DynamicGridConfig = {
    keyExpr: 'orderId',
    columns: [
      { dataField: 'orderId', caption: 'ID', dataType: 'number' ,columnType: 'text'},
      { dataField: 'orderNo', caption: 'Order No', dataType: 'string' ,columnType: 'text'},
      { dataField: 'orderDate', caption: 'Order Date', dataType: 'date' ,columnType: 'date'},
      { dataField: 'totalAmount', caption: 'Total Amount', dataType: 'number' ,columnType: 'number'},
      {
        caption: 'Actions',
        columnType: 'action',
        cellTemplate: 'actionTemplate',
        alignment: 'center'
      }
    ]
  };

  getProductsByOrderId(orderId: number) {
    const items = this.orderItems.filter(x => x.orderId === orderId);

    return items
      .map(item => this.products.find(product => product.productId === item.productId))
      .filter(product => product !== undefined);
  }

  viewOrder(order: any) {
    console.log('View Order:', order);
  }

  editOrder(order: any) {
    console.log('Edit Order:', order);
  }

  deleteOrder(order: any) {
    console.log('Delete Order:', order);
  }

  ngOnChanges(changes: SimpleChanges): void {
  }
  ngOnDestroy(): void {
  }

}