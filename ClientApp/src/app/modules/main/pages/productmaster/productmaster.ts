import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

import {
  HomeworkDatagridComponent,
  GridTemplateDirective,
} from '../../../../shared/components/homework-datagrid/homework-datagrid.component';

import { HomeworkButton } from '../../../../shared/components/homework-button/homework-button.component';
import { HomeworkInputComponent } from '../../../../shared/components/homework-input/homework-input.component';
import { HomeworkFormpopup } from '../../../../shared/components/homework-formpopup/homework-formpopup.component';
import { DynamicGridConfig } from '../../../../shared/models/homework-datagrid.model';

export interface ProductMasterRow {
  productId: number;
  sku: string;
  name: string;
  description: string;
  price: number;
  cost: number;
  stockQty: number;
  categoryName: string;
  isActive: boolean;
}

@Component({
  selector: 'product-master',
  standalone: true,
  imports: [
    CommonModule,
    HomeworkDatagridComponent,
    GridTemplateDirective,
    HomeworkButton,
    HomeworkInputComponent,
    HomeworkFormpopup,
  ],
  templateUrl: './productmaster.html',
  styleUrl: './productmaster.css',
})
export class ProductMaster {
  products: ProductMasterRow[] = [
    {
      productId: 1,
      sku: 'P-KEYBOARD-001',
      name: 'Mechanical Keyboard',
      description: 'RGB mechanical keyboard',
      price: 2500,
      cost: 1800,
      stockQty: 20,
      categoryName: 'Computer Accessories',
      isActive: true,
    },
    {
      productId: 2,
      sku: 'P-MOUSE-001',
      name: 'Wireless Mouse',
      description: 'Bluetooth wireless mouse',
      price: 890,
      cost: 500,
      stockQty: 50,
      categoryName: 'Computer Accessories',
      isActive: true,
    },
    {
      productId: 3,
      sku: 'P-MONITOR-001',
      name: 'Monitor 24 inch',
      description: 'Full HD monitor',
      price: 3900,
      cost: 3000,
      stockQty: 8,
      categoryName: 'Monitor',
      isActive: false,
    },
  ];

  selectedProduct: ProductMasterRow | null = null;
  isProductPopupVisible = false;
  popupMode: 'create' | 'edit' = 'create';

  gridConfig: DynamicGridConfig<ProductMasterRow> = {
    keyExpr: 'productId',
    pageSize: 10,
    columns: [
      {
        dataField: 'sku',
        caption: 'SKU',
        dataType: 'string',
        columnType: 'text',
      },
      {
        dataField: 'name',
        caption: 'Product Name',
        dataType: 'string',
        columnType: 'text',
      },
      {
        dataField: 'categoryName',
        caption: 'Category',
        dataType: 'string',
        columnType: 'text',
      },
      {
        dataField: 'price',
        caption: 'Price',
        dataType: 'number',
        columnType: 'number',
        cellTemplate: 'priceTemplate',
      },
      {
        dataField: 'cost',
        caption: 'Cost',
        dataType: 'number',
        columnType: 'number',
        cellTemplate: 'costTemplate',
      },
      {
        dataField: 'stockQty',
        caption: 'Stock',
        dataType: 'number',
        columnType: 'number',
      },
      {
        dataField: 'isActive',
        caption: 'Status',
        dataType: 'boolean',
        columnType: 'status',
        cellTemplate: 'statusTemplate',
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
        onClick: (row) => this.openEditPopup(row),
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

  get popupTitle(): string {
    return this.popupMode === 'create' ? 'Create Product' : 'Edit Product';
  }

  openCreatePopup(): void {
    this.popupMode = 'create';
    this.selectedProduct = {
      productId: this.getNextProductId(),
      sku: '',
      name: '',
      description: '',
      price: 0,
      cost: 0,
      stockQty: 0,
      categoryName: '',
      isActive: true,
    };

    this.isProductPopupVisible = true;
  }

  openEditPopup(product: ProductMasterRow): void {
    this.popupMode = 'edit';
    this.selectedProduct = { ...product };
    this.isProductPopupVisible = true;
  }

  closePopup(): void {
    this.isProductPopupVisible = false;
    this.selectedProduct = null;
  }

  saveProduct(): void {
    if (!this.selectedProduct) {
      return;
    }

    if (this.popupMode === 'create') {
      this.products = [...this.products, { ...this.selectedProduct }];
    } else {
      this.products = this.products.map((product) =>
        product.productId === this.selectedProduct!.productId
          ? { ...this.selectedProduct! }
          : product,
      );
    }

    this.closePopup();
  }

  deleteProduct(product: ProductMasterRow): void {
    this.products = this.products.filter(
      (x) => x.productId !== product.productId,
    );
  }

  private getNextProductId(): number {
    if (this.products.length === 0) {
      return 1;
    }

    return Math.max(...this.products.map((x) => x.productId)) + 1;
  }
}