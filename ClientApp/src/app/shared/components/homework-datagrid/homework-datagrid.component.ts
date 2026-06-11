import { Component, Input, SimpleChanges, OnChanges } from '@angular/core';

import { DxDataGridModule } from 'devextreme-angular/ui/data-grid';
import CustomStore from 'devextreme/data/custom_store';
import { HomeworkButton } from '../homework-button/homework-button.component';
import { ButtonTheme } from '../../models/pages-design.model';

export type DynamicGridColumnType =
  | 'text'
  | 'status'
  | 'date'
  | 'shortNumber'
  | 'accountNo'
  | 'number'
  | 'action'
  | 'legend';

export interface DynamicGridColumn {
  dataField?: string;
  caption: string;
  width?: number | string;
  dataType?: 'string' | 'number' | 'date' | 'boolean';
  format?: string;
  cellTemplate?: string;
  visible?: boolean;
  columnType?: DynamicGridColumnType;
  alignment?: 'left' | 'center' | 'right';
}

export interface DynamicGridAction<T> {
  label: string;
  theme: ButtonTheme;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';
  stylingMode?: 'contained' | 'outlined' | 'text';
  visible?: (row: T) => boolean;
  disabled?: (row: T) => boolean;
  onClick: (row: T) => void;
}

export interface DynamicGridConfig<T> {
  keyExpr: string;
  columns: DynamicGridColumn[];
  showBorders?: boolean;
  pageSize?: number;
  actions?: DynamicGridAction<T>[];
}

export interface DynamicGridPageEvent {
  pageSize: number;
  allowPageSizes: number[];
  visible: boolean;
  showInfo: boolean;
  showPageSizeSelector: boolean;
}

@Component({
  selector: 'homework-datagrid',
  standalone: true,
  imports: [DxDataGridModule, HomeworkButton],
  templateUrl: './homework-datagrid.component.html',
  styleUrl: './homework-datagrid.component.css',
})
export class HomeworkDatagridComponent<T> implements OnChanges {
  public gridDataSource!: CustomStore;

  @Input() dataSource: T[] = [];
  @Input() config!: DynamicGridConfig<T>;

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['dataSource'] || changes['config']) {
      this.createDataSource(this.dataSource);
    }
  }

  private createDataSource(data: T[]): void {
    this.gridDataSource = new CustomStore({
      key: this.config?.keyExpr,
      load: () => data,
    });
  }

  public getColumnAlignment(column: DynamicGridColumn): 'left' | 'center' | 'right' {
    if (column.alignment) {
      return column.alignment;
    }

    const map: Record<DynamicGridColumnType, 'left' | 'center' | 'right'> = {
      text: 'left',
      status: 'center',
      date: 'center',
      shortNumber: 'right',
      accountNo: 'center',
      number: 'right',
      action: 'center',
      legend: 'right',
    };

    return column.columnType ? map[column.columnType] : 'left';
  }

  public isActionVisible(action: DynamicGridAction<T>, row: T): boolean {
    return action.visible ? action.visible(row) : true;
  }

  public isActionDisabled(action: DynamicGridAction<T>, row: T): boolean {
    return action.disabled ? action.disabled(row) : false;
  }

  public onActionClick(action: DynamicGridAction<T>, row: T): void {
    action.onClick(row);
  }
}
