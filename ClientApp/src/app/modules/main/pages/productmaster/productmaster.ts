import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import DataSource from 'devextreme/data/data_source';
import CustomStore from 'devextreme/data/custom_store';
import { lastValueFrom } from 'rxjs';
import {
  HomeworkDatagridComponent,
  GridTemplateDirective,
} from '../../../../shared/components/homework-datagrid/homework-datagrid.component';
import { DxTagBoxModule, DxRadioGroupModule } from 'devextreme-angular';
import { HomeworkButton } from '../../../../shared/components/homework-button/homework-button.component';
import { HomeworkInputComponent } from '../../../../shared/components/homework-input/homework-input.component';
import { HomeworkFormpopup } from '../../../../shared/components/homework-formpopup/homework-formpopup.component';
import {
  HomeworkConfirmationModalComponent,
  ConfirmationModalConfig,
} from '../../../../shared/components/homework-confirmation-modal/homework-confirmation-modal.component';
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
import { ProductStatus } from '../../../../core/enum';
import { HomeworkRadioGroupComponent } from '../../../../shared/components/homework-radio-group/homework-radio-group.component';
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
    HomeworkConfirmationModalComponent,
    DxRadioGroupModule,
    HomeworkRadioGroupComponent,
  ],
  templateUrl: './productmaster.html',
  styleUrl: './productmaster.css',
})
export class ProductMaster implements OnInit {
  @ViewChild(HomeworkDatagridComponent, { static: false })
  gridWrapper!: HomeworkDatagridComponent<any>;
  products!: DataSource;
  categoryList: CategoryViewModel[] = [];
  categoryDropdownItems: { key: string; value: string }[] = [];
  statusDropdownItems = [
    { key: 'true', label: 'Active', value: ProductStatus.Active },
    { key: 'false', label: 'Inactive', value: ProductStatus.Inactive },
  ];
  isDeletePopupVisible = false;
  productToDelete: ProductMasterViewModel | null = null;
  deleteModalConfig: ConfirmationModalConfig = {
    title: 'ยืนยันการลบ',
    width: 400,
    height: 200,
  };

  request = {
    keyword: '',
    categoryIds: [],
    statuses: [] as string[],
    pageNumber: 1,
    pageSize: 10,
  };

  constructor(
    private productService: ProductMasterApiService,
    private categoriesMasterApiService: CategoriesMasterApiService,
  ) {}

  ngOnInit(): void {
    this.initializeDataSource();
    this.getCategoryList();
  }

  initializeDataSource(): void {
    this.products = new DataSource({
      store: new CustomStore({
        key: 'productId',
        load: (loadOptions) => {
          try {
            const categoryIdsAsNumbers = this.request.categoryIds.map((id) => +id);
            const params: any = {};

            if (loadOptions.skip !== undefined) params.skip = loadOptions.skip;
            if (loadOptions.take !== undefined) params.take = loadOptions.take;
            if (loadOptions.requireTotalCount !== undefined)
              params.requireTotalCount = loadOptions.requireTotalCount;
            if (loadOptions.sort) params.sort = JSON.stringify(loadOptions.sort);
            if (loadOptions.filter) params.filter = JSON.stringify(loadOptions.filter);

            if (this.request.keyword) params.keyword = this.request.keyword;
            if (categoryIdsAsNumbers.length > 0) {
              params.categoryIds = categoryIdsAsNumbers;
            }

            const selectedStatuses = this.request.statuses || [];
            if (selectedStatuses.length === 1) {
              params.isActive = selectedStatuses[0] === 'true';
            }

            console.log('DevExtreme load options:', loadOptions);
            console.log('Sending parameters:', params);

            const promise = lastValueFrom(this.productService.GetProductList(params))
              .then((response: any) => {
                console.log('API response:', response);
                const isArray = Array.isArray(response);
                const result = {
                  data: isArray ? response : response?.data || [],
                  totalCount: isArray ? response.length : response?.totalCount || 0,
                };
                console.log('Load resolved to:', result);
                return result;
              })
              .catch((err) => {
                console.error('Promise error in load:', err);
                throw err;
              });
            console.log('Returning promise:', promise);
            return promise;
          } catch (err) {
            console.error('Synchronous error in load:', err);
            throw err;
          }
        },
      }),
    });
  }

  loadProducts(): void {
    if (this.gridWrapper?.dataGrid?.instance) {
      this.gridWrapper.dataGrid.instance.refresh();
    } else if (this.products) {
      this.products.reload();
    }
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
        cellTemplate: 'stockQtyTemplate',
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
        stylingMode: 'outlined',
        showDefaultLabel: false,
        onClick: (row) => this.openEditPopup(row),
      },
      {
        label: '',
        theme: 'Danger',
        size: 'sm',
        iconCode: 'delete',
        stylingMode: 'outlined',
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
    this.productToDelete = product;
    this.isDeletePopupVisible = true;
  }

  confirmDeleteProduct(): void {
    if (!this.productToDelete) {
      return;
    }
    this.productService.DeleteProduct(this.productToDelete.productId).subscribe({
      next: (res) => {
        if (res.isSuccess) {
          this.loadProducts();
          this.closeDeletePopup();
        } else {
          console.error('Failed to delete product:', res.message);
        }
      },
      error: (err: any) => {
        console.error('Error deleting product:', err);
      },
    });
  }

  closeDeletePopup(): void {
    this.isDeletePopupVisible = false;
    this.productToDelete = null;
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
