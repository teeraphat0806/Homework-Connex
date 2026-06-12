import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { catchError, Observable, throwError } from 'rxjs';

export interface ProductVariantRequest {
  variantCode: string;
  variantName: string;
  color: string;
  price: number;
  stockQty: number;
}

export interface ProductMasterRequest {
  productId: number;
  ProductCode: string;
  name: string;
  description?: string;
  price: number;
  stockQty: number;
  categoryId?: number;
  categoryName?: string;
  isActive: boolean;
  variants?: ProductVariantRequest[];
}

export interface ProductMasterRequestCreate {
  ProductCode: string;
  name: string;
  description?: string;
  price: number;
  stockQty: number;
  categoryId?: number;
  variants?: ProductVariantRequest[];
}

export interface ProductMasterSearchRequest {
  keyword?: string;
  categoryId?: number;
  isActive?: boolean;
  pageNumber: number;
  pageSize: number;
}

export interface ProductVariantViewModel {
  productVariantId: number;
  variantCode: string;
  variantName: string;
  color: string;
  price: number;
  stockQty: number;
  isActive: boolean;
}

export interface ProductMasterViewModel {
  productId: number;
  productCode: string;
  name: string;
  description?: string;
  categoryId?: number;
  isActive: boolean;
  variants: ProductVariantViewModel[];
}

export interface ProductManageViewModel {
  isSuccess: boolean;
  message?: string;
  productId?: number;
}

@Injectable({
  providedIn: 'root',
})
export class ProductMasterApiService {
  private url = `${environment.apiUrl}product`;

  constructor(private http: HttpClient) {}

  GetProductList(params: ProductMasterSearchRequest): Observable<ProductMasterViewModel[]> {
    return this.http
      .get<ProductMasterViewModel[]>(`${this.url}/list`, {
        params: params as any,
        withCredentials: true,
      })
      .pipe(
        catchError((error) => {
          console.error('Error fetching product list:', error);
          return throwError(() => error);
        }),
      );
  }

  GetProductInfo(productId: number): Observable<ProductMasterViewModel> {
    console.log('Fetching product info for product:', productId);
    return this.http
      .get<ProductMasterViewModel>(`${this.url}/info`, {
        params: { productId: productId.toString() },
        withCredentials: true,
      })
      .pipe(
        catchError((error) => {
          console.error('Error fetching product info:', error);
          return throwError(() => error);
        }),
      );
  }

  CreateProduct(product: ProductMasterRequestCreate): Observable<ProductManageViewModel> {
    return this.http
      .post<ProductManageViewModel>(`${this.url}/create`, product, { withCredentials: true })
      .pipe(
        catchError((error) => {
          console.error('Error creating product:', error);
          return throwError(() => error);
        }),
      );
  }

  UpdateProduct(product: ProductMasterRequest): Observable<ProductManageViewModel> {
    return this.http
      .post<ProductManageViewModel>(`${this.url}/update`, product, { withCredentials: true })
      .pipe(
        catchError((error) => {
          console.error('Error updating product:', error);
          return throwError(() => error);
        }),
      );
  }

  DeleteProduct(productId: number): Observable<ProductManageViewModel> {
    return this.http
      .post<ProductManageViewModel>(`${this.url}/delete`, { productId }, { withCredentials: true })
      .pipe(
        catchError((error) => {
          console.error('Error deleting product:', error);
          return throwError(() => error);
        }),
      );
  }

  DeleteProductVariant(
    productId: number,
    productVariantId: number,
  ): Observable<ProductManageViewModel> {
    return this.http
      .post<ProductManageViewModel>(
        `${this.url}/delete-variant`,
        { productId, productVariantId },
        { withCredentials: true },
      )
      .pipe(
        catchError((error) => {
          console.error('Error deleting product variant:', error);
          return throwError(() => error);
        }),
      );
  }
}
