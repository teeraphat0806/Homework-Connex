import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import DataSource from 'devextreme/data/data_source';
import Swal from 'sweetalert2';
import {
  HomeworkDatagridComponent,
  GridTemplateDirective,
} from '../../../../shared/components/homework-datagrid/homework-datagrid.component';
import { HomeworkButton } from '../../../../shared/components/homework-button/homework-button.component';
import { DynamicGridConfig } from '../../../../shared/models/homework-datagrid.model';
import { OrderRoute } from '../../../../shared/routers/order.const';
import { DxTextBoxModule } from 'devextreme-angular';
import { HomeworkInputComponent } from '../../../../shared/components/homework-input/homework-input.component';
import { DxTagBoxModule, DxRadioGroupModule, DxDateBoxModule } from 'devextreme-angular';
import { HomeworkFormpopup } from '../../../../shared/components/homework-formpopup/homework-formpopup.component';
import {
  HomeworkConfirmationModalComponent,
  ConfirmationModalConfig,
} from '../../../../shared/components/homework-confirmation-modal/homework-confirmation-modal.component';
import { lastValueFrom } from 'rxjs';
import { OrderMasterApiService, OrderItemViewModel } from '../../services/ordermaster.service';
import { OrderStatus } from '../../../../core/enum';
import {
  CategoriesMasterApiService,
  CategoryViewModel,
} from '../../services/categoriesmaster.service';
import { HomeworkRadioGroupComponent } from '../../../../shared/components/homework-radio-group/homework-radio-group.component';
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
    DxDateBoxModule,
    HomeworkRadioGroupComponent,
  ],
  templateUrl: './orderlist.html',
  styleUrl: './orderlist.css',
})
export class OrderList implements OnInit {
  @ViewChild(HomeworkDatagridComponent, { static: false })
  gridWrapper!: HomeworkDatagridComponent<any>;
  orders!: DataSource;
  categoryList: CategoryViewModel[] = [];
  categoryDropdownItems: { key: string; value: string }[] = [];
  request = {
    keyword: '',
    status: '',
    categoryIds: [] as string[],
    startDate: null as Date | null,
    endDate: null as Date | null,
  };

  //Confirmation Modal Delete
  isModalDeleteVisible = false;
  orderDelete: OrderListRow | null = null;
  deleteModalConfig: ConfirmationModalConfig = {
    title: 'ยืนยันการลบออเดอร์',
    width: 400,
    height: 200,
  };
  //Confirmation Modal Submit
  isModalSubmitVisible = false;
  orderSubmit: OrderListRow | null = null;
  submitModalConfig: ConfirmationModalConfig = {
    title: 'ยืนยันการส่งออเดอร์',
    width: 400,
    height: 200,
  };

  statusOptions = [
    { label: 'ทั้งหมด', value: '' },
    { label: 'Draft', value: OrderStatus.Draft },
    { label: 'Submit', value: OrderStatus.Submit },
    { label: 'Pending', value: OrderStatus.Pending },
    { label: 'Approved', value: OrderStatus.Approved },
    { label: 'Rejected', value: OrderStatus.Rejected },
    { label: 'Confirm Order', value: OrderStatus.ConfirmOrder },
    { label: 'Partially Returned', value: OrderStatus.PartialReturned },
    { label: 'Returned', value: OrderStatus.Returned },
  ];

  constructor(
    private router: Router,
    private orderService: OrderMasterApiService,
    private categoriesMasterApiService: CategoriesMasterApiService,
  ) {}

  ngOnInit(): void {
    this.initializeDataSource();
    this.getCategoryList();
  }

  loadOrders(): void {
    if (this.gridWrapper?.dataGrid?.instance) {
      this.gridWrapper.dataGrid.instance.refresh();
    } else if (this.orders) {
      this.orders.reload();
    }
  }

  initializeDataSource(): void {
    this.orders = new DataSource({
      load: async (loadOptions) => {
        try {
          const params: any = {};
          if (loadOptions.skip !== undefined) params.skip = loadOptions.skip;
          if (loadOptions.take !== undefined) params.take = loadOptions.take;
          if (loadOptions.requireTotalCount !== undefined)
            params.requireTotalCount = loadOptions.requireTotalCount;
          if (loadOptions.sort) params.sort = JSON.stringify(loadOptions.sort);
          if (loadOptions.filter) params.filter = JSON.stringify(loadOptions.filter);

          const categoryIdsAsNumbers = (this.request.categoryIds || []).map((id) => +id);
          if (categoryIdsAsNumbers.length > 0) {
            params.categoryIds = categoryIdsAsNumbers;
          }
          if (this.request.keyword) {
            params.keyword = this.request.keyword;
          }
          if (this.request.status) {
            params.status = this.request.status;
          }
          if (this.request.startDate) {
            params.startDate = this.request.startDate.toISOString();
          }
          if (this.request.endDate) {
            params.endDate = this.request.endDate.toISOString();
          }

          console.log('DevExtreme load options:', loadOptions);
          console.log('Sending parameters:', params);

          const response: any = await lastValueFrom(this.orderService.GetOrderList(params));
          console.log('API response:', response);
          const isArray = Array.isArray(response);
          const result = {
            data: isArray ? response : response?.data || [],
            totalCount: isArray ? response.length : response?.totalCount || 0,
          };
          console.log('Load resolved to:', result);
          return result;
        } catch (err) {
          console.error('Error loading orders:', err);
          throw err;
        }
      },
    });
  }
  gridConfigOrderItem: DynamicGridConfig<OrderItemViewModel> = {
    keyExpr: 'orderItemId',
    pageSize: 10,
    columns: [
      {
        dataField: 'productName',
        caption: 'Product Name',
        dataType: 'string',
        columnType: 'text',
      },
      {
        dataField: 'qty',
        caption: 'Quantity',
        dataType: 'number',
        columnType: 'number',
      },
      {
        dataField: 'price',
        caption: 'Price',
        dataType: 'number',
        columnType: 'number',
      },
      {
        dataField: 'orderItemStatus',
        caption: 'Status',
        dataType: 'string',
        columnType: 'status',
        cellTemplate: 'statusTemplate',
      },
      {
        dataField: 'rejectedReason',
        caption: 'Rejected Reason',
        dataType: 'string',
        columnType: 'text',
      },
    ],
  };
  gridConfig: DynamicGridConfig<OrderListRow> = {
    keyExpr: 'orderId',
    pageSize: 10,
    masterDetail: {
      enabled: true,
      templateName: 'orderDetailTemplate',
    },
    columns: [
      {
        dataField: 'orderNo',
        caption: 'Order No',
        dataType: 'string',
        columnType: 'text',
      },
      {
        dataField: 'orderDate',
        caption: 'Order Date',
        dataType: 'date',
        format: 'dd/MMM/yyyy',
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
        dataField: 'modifiedByUserName',
        caption: 'Modified By',
        dataType: 'string',
        columnType: 'text',
      },
      {
        dataField: 'modifiedTime',
        caption: 'Modified Time',
        dataType: 'date',
        format: 'dd/MMM/yyyy HH:mm:ss',
        columnType: 'date',
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
        visible: (row) => row.status === 'Draft',
        onClick: (row) => this.goToEditOrder(row.orderId),
      },
      {
        label: '',
        theme: 'Danger',
        size: 'sm',
        iconCode: 'delete',
        showDefaultLabel: false,
        visible: (row) => row.status === 'Draft',
        onClick: (row) => this.deleteItem(row),
      },
      {
        label: '',
        theme: 'Primary',
        size: 'sm',
        iconCode: 'check',
        showDefaultLabel: false,
        visible: (row) => row.status === 'Draft',
        onClick: (row) => this.submitItem(row),
      },
    ],
  };

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

  goToReturnOrder(orderId: number): void {
    this.router.navigate([`/${OrderRoute.fullOrderDetailsPath}`], {
      queryParams: {
        mode: 'return',
        orderId: orderId,
      },
    });
  }

  deleteItem(row: OrderListRow): void {
    this.orderDelete = row;
    this.isModalDeleteVisible = true;
  }
  submitItem(row: OrderListRow): void {
    this.orderSubmit = row;
    this.isModalSubmitVisible = true;
  }

  closeDeleteModal(): void {
    this.isModalDeleteVisible = false;
    this.orderDelete = null;
  }

  closeSubmitModal(): void {
    this.isModalSubmitVisible = false;
    this.orderSubmit = null;
  }

  submitOrder(): void {
    if (!this.orderSubmit) {
      return;
    }
    const orderId = this.orderSubmit.orderId;
    this.closeSubmitModal();
    this.orderService.SubmitOrder(orderId).subscribe({
      next: (res) => {
        this.loadOrders();
        Swal.fire('สำเร็จ!', 'ส่งออเดอร์เรียบร้อยแล้ว', 'success');
      },
      error: (err) => {
        console.error('Failed to submit order:', err);
        Swal.fire('เกิดข้อผิดพลาด!', err?.error?.message || 'ไม่สามารถส่งออเดอร์ได้', 'error');
      },
    });
  }

  deleteOrder(): void {
    if (!this.orderDelete) {
      return;
    }
    const orderId = this.orderDelete.orderId;
    this.closeDeleteModal();
    this.orderService.DeleteOrder(orderId).subscribe({
      next: (res) => {
        this.loadOrders();
        Swal.fire('สำเร็จ!', 'ลบออเดอร์เรียบร้อยแล้ว', 'success');
      },
      error: (err) => {
        console.error('Failed to delete order:', err);
        Swal.fire('เกิดข้อผิดพลาด!', err?.error?.message || 'ไม่สามารถลบออเดอร์ได้', 'error');
      },
    });
  }
}
