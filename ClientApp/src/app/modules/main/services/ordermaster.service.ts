import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { catchError, Observable, throwError } from 'rxjs';

export interface OrderSearchRequest {
  keyword?: string;
  status?: string;
  startDate?: Date;
  endDate?: Date;
}

export interface OrderViewModel {
  orderId: number;
  orderNo: string;
  orderDate: Date;
  totalAmount: number;
  status: string;
}
export interface OrderItemViewModel {
  orderItemId: number;
  productId: number;
  productName: string;
  qty: number;
  unitPrice: number;
  netAmount: number;
  orderItemStatus: string;
}
@Injectable({
  providedIn: 'root',
})
export class OrderMasterApiService {
  private url = `${environment.apiUrl}order`;

  constructor(private http: HttpClient) {}

  GetOrderList(params?: OrderSearchRequest): Observable<OrderViewModel[]> {
    return this.http
      .get<OrderViewModel[]>(`${this.url}/list`, {
        params: params as any,
        withCredentials: true,
      })
      .pipe(
        catchError((error) => {
          console.error('Error fetching orders list:', error);
          return throwError(() => error);
        }),
      );
  }
}
