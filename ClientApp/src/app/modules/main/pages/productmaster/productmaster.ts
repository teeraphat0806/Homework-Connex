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
  ProductVariantViewModel,
} from '../../services/productmaster.service';
import {
  CategoriesMasterApiService,
  CategoryViewModel,
} from '../../services/categoriesmaster.service';

export interface ProductMasterRow {
  productId: number;
  productCode: string;
  name: string;
  description: string;
  price: number;
  stockQty: number;
  categoryName: string;
  isActive: boolean;
  variants?: ProductVariantViewModel[];
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
    DxTagBoxModule,
  ],
  templateUrl: './productmaster.html',
  styleUrl: './productmaster.css',
})
export class ProductMaster implements OnInit {
  products: ProductMasterViewModel[] = [];
  categoryList: CategoryViewModel[] = [];
  categoryDropdownItems: { key: string; value: string }[] = [];
  request: ProductMasterSearchRequest = {
    pageNumber: 1,
    pageSize: 10,
  };

  constructor(
    private productService: ProductMasterApiService,
    private CategoriesMasterApiService: CategoriesMasterApiService,
  ) {}

  ngOnInit(): void {
    this.loadProducts();
    this.getCategoryList();
  }

  loadProducts(): void {
    this.productService.GetProductList(this.request).subscribe({
      next: (res) => {
        this.products = res;
      },
      error: (err: any) => {
        console.error('Failed to load products', err);
      },
    });
  }

  selectedProduct: ProductMasterViewModel | null = null;
  isProductPopupVisible = false;
  popupMode: 'create' | 'edit' = 'create';

  isVariantPopupVisible = false;
  selectedVariant: (ProductVariantViewModel & { parentProductId?: number }) | null = null;
  variantPopupMode: 'create' | 'edit' = 'create';

  variantGridConfig: DynamicGridConfig<ProductVariantViewModel> = {
    keyExpr: 'productVariantId',
    pageSize: 10,

    columns: [
      {
        dataField: 'variantCode',
        caption: 'Variant Code',
        dataType: 'string',
        columnType: 'text',
      },
      {
        dataField: 'variantName',
        caption: 'Variant Name',
        dataType: 'string',
        columnType: 'text',
      },
      {
        dataField: 'color',
        caption: 'Color',
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
        onClick: (row) => this.openEditVariantPopup(row),
      },
      {
        label: '',
        theme: 'Danger',
        size: 'sm',
        iconCode: 'delete',
        showDefaultLabel: false,
        onClick: (row) => this.deleteVariant(row),
      },
    ],
  };

  gridConfig: DynamicGridConfig<ProductMasterViewModel> = {
    keyExpr: 'productId',
    pageSize: 10,

    masterDetail: {
      enabled: true,
      templateName: 'productDetailTemplate',
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
        dataField: 'categoryName',
        caption: 'Category Name',
        dataType: 'string',
        columnType: 'text',
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
    this.CategoriesMasterApiService.GetCategoriesList().subscribe({
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

  productVariantsMap = new Map<number, ProductVariantViewModel[] | null>();

  getProductVariants(productId: any): ProductVariantViewModel[] | null {
    const id = Number(productId);
    if (isNaN(id) || id <= 0) {
      return [];
    }
    const product = this.products.find((p) => p.productId === id);
    return product?.variants || [];
  }

  openCreatePopup(): void {
    this.popupMode = 'create';
    this.selectedProduct = {
      productId: 0,
      productCode: '',
      name: '',
      description: '',
      categoryId: undefined,
      isActive: true,
      variants: [],
    };

    this.isProductPopupVisible = true;
  }

  openEditPopup(product: ProductMasterViewModel): void {
    this.popupMode = 'edit';
    this.productService.GetProductInfo(product.productId).subscribe({
      next: (info) => {
        this.selectedProduct = {
          productId: info.productId,
          productCode: info.productCode,
          name: info.name,
          description: info.description || '',
          categoryId: info.categoryId,
          isActive: info.isActive,
          variants: info.variants || [],
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
        price: 0,
        stockQty: 0,
        categoryId: this.selectedProduct.categoryId,
        variants: [], // Empty default variants list
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
        price: 0,
        stockQty: 0,
        categoryId: this.selectedProduct.categoryId,
        isActive: this.selectedProduct.isActive,
        variants: (this.selectedProduct.variants || []).map((v) => ({
          variantCode: v.variantCode,
          variantName: v.variantName,
          color: v.color,
          price: v.price,
          stockQty: v.stockQty,
        })),
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

  get variantPopupTitle(): string {
    return this.variantPopupMode === 'create' ? 'Create Variant' : 'Edit Variant';
  }

  openCreateVariantPopup(parentProductId: number): void {
    this.variantPopupMode = 'create';
    this.selectedVariant = {
      productVariantId: 0,
      variantCode: '',
      variantName: '',
      color: '',
      price: 0,
      stockQty: 0,
      isActive: true,
      parentProductId: parentProductId,
    };
    this.isVariantPopupVisible = true;
  }

  openEditVariantPopup(variant: ProductVariantViewModel, parentProductId?: number): void {
    this.variantPopupMode = 'edit';
    this.selectedVariant = {
      ...variant,
      parentProductId: parentProductId,
    };
    this.isVariantPopupVisible = true;
  }

  closeVariantPopup(): void {
    this.isVariantPopupVisible = false;
    this.selectedVariant = null;
  }

  saveVariant(): void {
    if (!this.selectedVariant || !this.selectedVariant.parentProductId) {
      return;
    }

    const parentId = this.selectedVariant.parentProductId;

    this.productService.GetProductInfo(parentId).subscribe({
      next: (productInfo) => {
        let variantsList = productInfo.variants || [];

        if (this.variantPopupMode === 'create') {
          const newVariant: ProductVariantViewModel = {
            productVariantId: 0,
            variantCode: this.selectedVariant!.variantCode,
            variantName: this.selectedVariant!.variantName,
            color: this.selectedVariant!.color,
            price: this.selectedVariant!.price,
            stockQty: this.selectedVariant!.stockQty,
            isActive: true,
          };
          variantsList.push(newVariant);
        } else {
          variantsList = variantsList.map((v) =>
            v.productVariantId === this.selectedVariant!.productVariantId
              ? {
                  ...v,
                  variantCode: this.selectedVariant!.variantCode,
                  variantName: this.selectedVariant!.variantName,
                  color: this.selectedVariant!.color,
                  price: this.selectedVariant!.price,
                  stockQty: this.selectedVariant!.stockQty,
                  isActive: this.selectedVariant!.isActive,
                }
              : v,
          );
        }

        const variantsToSend = variantsList.map((v) => ({
          variantCode: v.variantCode,
          variantName: v.variantName,
          color: v.color,
          price: v.price,
          stockQty: v.stockQty,
        }));

        const updateReq: ProductMasterRequest = {
          productId: productInfo.productId,
          ProductCode: productInfo.productCode,
          name: productInfo.name,
          description: productInfo.description,
          price: (productInfo as any).price || 0,
          stockQty: (productInfo as any).stockQty || 0,
          categoryId: productInfo.categoryId,
          isActive: productInfo.isActive,
          variants: variantsToSend,
        };

        this.productService.UpdateProduct(updateReq).subscribe({
          next: (res) => {
            if (res.isSuccess) {
              this.loadProducts();
              this.closeVariantPopup();
            } else {
              console.error('Failed to save variant:', res.message);
            }
          },
          error: (err) => {
            console.error('Error updating product with variant:', err);
          },
        });
      },
      error: (err) => {
        console.error('Failed to get product info for variant save', err);
      },
    });
  }

  deleteVariant(variant: ProductVariantViewModel, parentProductId?: number): void {
    if (!parentProductId) return;
    if (
      confirm(`คุณต้องการลบ Variant "${variant.variantName || variant.variantCode}" ใช่หรือไม่?`)
    ) {
      if (variant.productVariantId > 0) {
        this.productService
          .DeleteProductVariant(parentProductId, variant.productVariantId)
          .subscribe({
            next: (res) => {
              if (res.isSuccess) {
                this.loadProducts();
              } else {
                console.error('Failed to delete variant:', res.message);
              }
            },
            error: (err: any) => {
              console.error('Error deleting variant:', err);
            },
          });
      }
    }
  }
}
