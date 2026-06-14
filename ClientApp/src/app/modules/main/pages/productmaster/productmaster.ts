import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

import {
  HomeworkDatagridComponent,
  GridTemplateDirective,
} from '../../../../shared/components/homework-datagrid/homework-datagrid.component';
import { DxTagBoxModule } from 'devextreme-angular';
import { HomeworkButton } from '../../../../shared/components/homework-button/homework-button.component';
import { HomeworkInputComponent } from '../../../../shared/components/homework-input/homework-input.component';
import { HomeworkFormpopup } from '../../../../shared/components/homework-formpopup/homework-formpopup.component';
import { DynamicGridConfig } from '../../../../shared/models/homework-datagrid.model';
import {
  ProductMasterApiService,
  ProductMasterViewModel,
  ProductMasterSearchRequest,
  ProductMasterRequestCreate,
  ProductMasterRequest,
} from '../../services/productmaster.service';
import {
  CategoriesMasterApiService,
  CategoryViewModel,
} from '../../services/categoriesmaster.service';
import { DxTextBoxModule } from 'devextreme-angular';
export interface ProductMasterRow {
  productId: number;
  productCode: string;
  name: string;
  description: string;
  price: number;
  stockQty: number;
  categoryName: string;
  categoryNames?: string[];
  isActive: boolean;
  imageUrl?: string;
}

@Component({
  selector: 'product-master',
  standalone: true,
  imports: [
    CommonModule,
    HomeworkDatagridComponent,
    GridTemplateDirective,
    DxTextBoxModule,
    HomeworkButton,
    HomeworkInputComponent,
    HomeworkFormpopup,
    DxTagBoxModule,
  ],
  templateUrl: './productmaster.html',
  styleUrl: './productmaster.css',
})
export class ProductMaster implements OnInit {
  products: ProductMasterViewModel[] = [];
  categoryList: CategoryViewModel[] = [];
  categoryDropdownItems: { key: string; value: string }[] = [];

  request = {
    keyword: '',
    categoryIds: [],
    pageNumber: 1,
    pageSize: 10,
  };

  constructor(
    private productService: ProductMasterApiService,
    private categoriesMasterApiService: CategoriesMasterApiService,
  ) {}

  ngOnInit(): void {
    this.loadProducts();
    this.getCategoryList();
  }

  loadProducts(): void {
    const categoryIdsAsNumbers = this.request.categoryIds.map((id) => +id);
    const searchRequest: ProductMasterSearchRequest = {
      keyword: this.request.keyword,
      categoryIds: categoryIdsAsNumbers,
      pageNumber: this.request.pageNumber,
      pageSize: this.request.pageSize,
    };
    this.productService.GetProductList(searchRequest).subscribe({
      next: (res) => {
        this.products = res;
      },
      error: (err: any) => {
        console.error('Failed to load products', err);
      },
    });
  }

  selectedProduct: (ProductMasterViewModel & { categoryIdsText?: string[] }) | null = null;
  isProductPopupVisible = false;
  popupMode: 'create' | 'edit' = 'create';
  gridConfig: DynamicGridConfig<ProductMasterViewModel> = {
    keyExpr: 'productId',
    pageSize: 10,
    masterDetail: {
      enabled: true,
      templateName: 'productDescriptionDetail',
    },
    columns: [
      {
        dataField: 'productCode',
        caption: 'Product Code',
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
        dataField: 'description',
        caption: 'Description',
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
        dataField: 'stockQty',
        caption: 'Stock Qty',
        dataType: 'number',
        columnType: 'number',
      },
      {
        dataField: 'categoryNames',
        caption: 'Categories',
        dataType: 'string',
        columnType: 'text',
        cellTemplate: 'categoriesTemplate',
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

  getCategoryList(): void {
    this.categoriesMasterApiService.GetCategoriesList().subscribe({
      next: (res) => {
        this.categoryList = res;
        this.categoryDropdownItems = res.map((c) => ({
          key: c.categoryId.toString(),
          value: c.name,
        }));
      },
      error: (err: any) => {
        console.error('Failed to load categories', err);
      },
    });
  }

  openCreatePopup(): void {
    this.popupMode = 'create';
    this.selectedProduct = {
      productId: 0,
      productCode: '',
      name: '',
      description: '',
      categoryId: undefined,
      categoryIds: [],
      categoryIdsText: [],
      isActive: true,
      price: 0,
      stockQty: 0,
      imageUrl: '',
    };

    this.isProductPopupVisible = true;
  }

  openEditPopup(product: ProductMasterViewModel): void {
    this.popupMode = 'edit';
    this.productService.GetProductInfo(product.productId).subscribe({
      next: (info) => {
        const catIds = info.categoryIds || [];
        this.selectedProduct = {
          productId: info.productId,
          productCode: info.productCode,
          name: info.name,
          description: info.description || '',
          categoryId: info.categoryId,
          categoryIds: catIds,
          categoryIdsText: catIds.map((id) => id.toString()),
          isActive: info.isActive,
          price: info.price,
          stockQty: info.stockQty,
          imageUrl: info.imageUrl || '',
        };
        this.isProductPopupVisible = true;
      },
      error: (err: any) => {
        console.error('Failed to get product info', err);
      },
    });
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
      const createReq: ProductMasterRequestCreate = {
        ProductCode: this.selectedProduct.productCode,
        name: this.selectedProduct.name,
        description: this.selectedProduct.description,
        price: this.selectedProduct.price || 0,
        stockQty: this.selectedProduct.stockQty || 0,
        categoryId: this.selectedProduct.categoryId,
        categoryIds: this.selectedProduct.categoryIds,
        imageUrl: this.selectedProduct.imageUrl,
      };

      this.productService.CreateProduct(createReq).subscribe({
        next: (res) => {
          if (res.isSuccess) {
            this.loadProducts();
            this.closePopup();
          } else {
            console.error('Failed to create product:', res.message);
          }
        },
        error: (err: any) => {
          console.error('Error creating product:', err);
        },
      });
    } else {
      const updateReq: ProductMasterRequest = {
        productId: this.selectedProduct.productId,
        ProductCode: this.selectedProduct.productCode,
        name: this.selectedProduct.name,
        description: this.selectedProduct.description,
        price: this.selectedProduct.price || 0,
        stockQty: this.selectedProduct.stockQty || 0,
        categoryId: this.selectedProduct.categoryId,
        categoryIds: this.selectedProduct.categoryIds,
        isActive: this.selectedProduct.isActive,
        imageUrl: this.selectedProduct.imageUrl,
      };

      this.productService.UpdateProduct(updateReq).subscribe({
        next: (res) => {
          if (res.isSuccess) {
            this.loadProducts();
            this.closePopup();
          } else {
            console.error('Failed to update product:', res.message);
          }
        },
        error: (err: any) => {
          console.error('Error updating product:', err);
        },
      });
    }
  }

  deleteProduct(product: ProductMasterViewModel): void {
    if (confirm(`คุณต้องการลบสินค้า "${product.name}" ใช่หรือไม่?`)) {
      this.productService.DeleteProduct(product.productId).subscribe({
        next: (res) => {
          if (res.isSuccess) {
            this.loadProducts();
          } else {
            console.error('Failed to delete product:', res.message);
          }
        },
        error: (err: any) => {
          console.error('Error deleting product:', err);
        },
      });
    }
  }

  onCategorySelectionChange(selectedKeys: string[]): void {
    if (!this.selectedProduct) {
      return;
    }
    this.selectedProduct.categoryIds = (selectedKeys || []).map((k) => +k);
    this.selectedProduct.categoryIdsText = selectedKeys;
    if (this.selectedProduct.categoryIds.length > 0) {
      this.selectedProduct.categoryId = this.selectedProduct.categoryIds[0];
    } else {
      this.selectedProduct.categoryId = undefined;
    }
  }
}
