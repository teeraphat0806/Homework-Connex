import { Component, OnChanges, OnDestroy, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  HomeworkDatagridComponent,
  GridTemplateDirective,
} from '../homework-datagrid/homework-datagrid.component';
import { DynamicGridConfig } from '../../models/homework-datagrid.model';
import { HomeworkButton } from '../homework-button/homework-button.component';
import { HomeworkInputComponent } from '../homework-input/homework-input.component';
import { DxPopupModule } from 'devextreme-angular/ui/popup';
import { mockDatabase } from '../../../mock/mock-data';
import { DxTemplateModule } from 'devextreme-angular';
import { HomeworkFormpopup } from '../homework-formpopup/homework-formpopup.component';
export interface product {
  productId: number;
  name: string;
  description: string;
  price: number;
  stockQty: number;
  categoryId: number;
  isActive: boolean;
}
@Component({
  selector: 'homework-order-details',
  imports: [
    CommonModule,
    HomeworkDatagridComponent,
    HomeworkButton,
    HomeworkFormpopup,
    HomeworkInputComponent,
    DxPopupModule,
    DxTemplateModule,
    GridTemplateDirective,
  ],
  templateUrl: './homework-order-details.component.html',
  styleUrl: './homework-order-details.component.css',
})
export class HomeworkOrderDetailsComponent implements OnChanges, OnDestroy {
  ngOnChanges(changes: SimpleChanges): void {}
  ngOnDestroy(): void {}
  database = mockDatabase;
  gridConfig: DynamicGridConfig<product> = {
    keyExpr: 'productId',
    pageSize: 10,
    columns: [
      { dataField: 'productId', caption: 'Product ID', dataType: 'number', columnType: 'text' },
      { dataField: 'name', caption: 'Name', dataType: 'string', columnType: 'text' },
      { dataField: 'description', caption: 'Description', dataType: 'string', columnType: 'text' },
      {
        dataField: 'price',
        caption: 'Price',
        columnType: 'number',
        cellTemplate: 'priceTemplate',
      },
      { dataField: 'stockQty', caption: 'Stock Qty', dataType: 'number', columnType: 'number' },
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
        onClick: (row) => this.editProduct(row),
      },
      {
        label: '',
        theme: 'Danger',
        size: 'sm',
        iconCode: 'delete',
        showDefaultLabel: false,
        onClick: (row) => this.deleteProduct(row),
      },
    ],
  };
  newProduct: product = {
    productId: 0,
    name: '',
    description: '',
    price: 0,
    stockQty: 0,
    categoryId: 0,
    isActive: true,
  };
  products = this.database.products as product[];
  isAddPopupVisible = false;
  openCreatePopup(): void {
    this.isAddPopupVisible = true;
  }
  closeCreatePopup(): void {
    this.isAddPopupVisible = false;
  }
  showCreatePopup(): void {
    this.isAddPopupVisible = true;
  }
  saveNewProduct(newProduct: product): void {
    const newId = Math.max(...this.products.map((p) => p.productId)) + 1;
    this.products = [...this.products, { ...newProduct, productId: newId }];
    this.closeCreatePopup();
    newProduct.name = '';
    newProduct.description = '';
    newProduct.price = 0;
    newProduct.stockQty = 0;
    newProduct.categoryId = 0;
    newProduct.isActive = true;
  }

  isEditPopupVisible = false;
  selectedProduct: product | null = null;
  editProduct(product: product): void {
    this.selectedProduct = { ...product };
    this.isEditPopupVisible = true;
  }
  deleteProduct(product: product): void {
    this.products = this.products.filter((x) => x.productId !== product.productId);
  }
  closeEditPopup(): void {
    this.isEditPopupVisible = false;
    this.selectedProduct = null;
  }
  saveEditProduct(): void {
    if (!this.selectedProduct) {
      return;
    }

    this.products = this.products.map((product) =>
      product.productId === this.selectedProduct!.productId
        ? { ...this.selectedProduct! }
        : product,
    );

    this.closeEditPopup();
  }
}
