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
  productCode?: string;
  qty: number;
  price: number;
  orderItemStatus: string;
  returnedQty?: number;
}

export interface OrderInfoViewModel {
  orderId: number;
  orderNo: string;
  orderDate: Date | string;
  totalAmount: number;
  status: string;
  modifiedByUserName: string;
  modifiedTime: Date | string;
  orderItems: OrderItemViewModel[];
}
export interface OrderItemUpdateViewModel {
  orderItemId: number;
  productId: number;
  qty: number;
  price: number;
  orderItemStatus: string;
}
export interface OrderUpdateViewModel {
  orderId: number;
  orderDate: Date | string;
  orderItems: OrderItemUpdateViewModel[];
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

  GetOrderInfo(orderId: number): Observable<OrderInfoViewModel> {
    return this.http
      .get<OrderInfoViewModel>(`${this.url}/info`, {
        params: { orderId: orderId.toString() },
        withCredentials: true,
      })
      .pipe(
        catchError((error) => {
          console.error('Error fetching order info:', error);
          return throwError(() => error);
        }),
      );
  }
  GetNextOrderNo(): Observable<{ nextOrderNo: string }> {
    return this.http
      .get<{ nextOrderNo: string }>(`${this.url}/next-order-no`, {
        withCredentials: true,
      })
      .pipe(
        catchError((error) => {
          console.error('Error fetching next order number:', error);
          return throwError(() => error);
        }),
      );
  }
  SaveOrder(order: OrderUpdateViewModel): Observable<any> {
    return this.http
      .post<any>(`${this.url}/update`, order, {
        withCredentials: true,
      })
      .pipe(
        catchError((error) => {
          console.error('Error saving order:', error);
          return throwError(() => error);
        }),
      );
  }
  CreateOrder(order: OrderUpdateViewModel): Observable<any> {
    return this.http
      .post<any>(`${this.url}/create`, order, {
        withCredentials: true,
      })
      .pipe(
        catchError((error) => {
          console.error('Error creating order:', error);
          return throwError(() => error);
        }),
      );
  }
  DeleteOrder(orderId: number): Observable<any> {
    return this.http
      .post<any>(
        `${this.url}/delete`,
        { orderId },
        {
          withCredentials: true,
        },
      )
      .pipe(
        catchError((error) => {
          console.error('Error deleting order:', error);
          return throwError(() => error);
        }),
      );
  }
  ApproveOrder(orderId: number): Observable<any> {
    return this.http
      .post<any>(
        `${this.url}/approve`,
        { orderId },
        {
          withCredentials: true,
        },
      )
      .pipe(
        catchError((error) => {
          console.error('Error approving order:', error);
          return throwError(() => error);
        }),
      );
  }
  RejectOrder(orderId: number): Observable<any> {
    return this.http
      .post<any>(
        `${this.url}/reject`,
        { orderId },
        {
          withCredentials: true,
        },
      )
      .pipe(
        catchError((error) => {
          console.error('Error rejecting order:', error);
          return throwError(() => error);
        }),
      );
  }
  ReturnOrder(param: {
    orderId: number;
    items: { orderItemId: number; returnQty: number }[];
  }): Observable<any> {
    return this.http
      .post<any>(`${this.url}/return`, param, {
        withCredentials: true,
      })
      .pipe(
        catchError((error) => {
          console.error('Error returning order:', error);
          return throwError(() => error);
        }),
      );
  }
  SubmitOrder(orderId: number): Observable<any> {
    return this.http
      .post<any>(
        `${this.url}/submit`,
        { orderId },
        {
          withCredentials: true,
        },
      )
      .pipe(
        catchError((error) => {
          console.error('Error submitting order:', error);
          return throwError(() => error);
        }),
      );
  }
}
