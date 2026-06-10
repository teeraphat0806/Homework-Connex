import {Component, OnChanges, Input, Output, EventEmitter, SimpleChanges, OnDestroy  } from '@angular/core';
import { DxDataGridModule } from 'devextreme-angular/ui/data-grid';
import {HomeworkButton} from "../homework-button/homework-button.component";
import CustomStore from 'devextreme/data/custom_store';
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

export interface DynamicGridConfig {
  keyExpr: string;
  columns: DynamicGridColumn[];
  showBorders?: boolean;
  pageSize?: number;
}
export interface DynamicGridPageEvent {
  pageSize: number;
  allowPageSizes: number[]
  visible: boolean;
  showInfo: boolean;
  showPageSizeSelector: boolean;
}

@Component({
  selector: 'homework-datagrid',
  imports: [DxDataGridModule, HomeworkButton],
  templateUrl: './homework-datagrid.component.html',
  styleUrl: './homework-datagrid.component.css',
})
export class HomeworkDatagridComponent<T> {
  public gridDataSource!: CustomStore;
  @Input() dataSource: T[] = [];
  @Input() config!: DynamicGridConfig;

  @Output() viewClick = new EventEmitter<T>();
  @Output() editClick = new EventEmitter<T>();
  @Output() deleteClick = new EventEmitter<T>();
  constructor() {
     this.createDataSource([]);
  }
  private createDataSource(data: T[]): void {
      this.gridDataSource = new CustomStore({
        key: this.config?.keyExpr,
        load: () => {
          return data;
        },
      });
    }
    public getColumnAlignment(
      column: DynamicGridColumn
    ): 'left' | 'center' | 'right' {
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
  ngOnChanges(changes: SimpleChanges): void {
    if(changes['dataSource']){
      this.createDataSource(changes['dataSource'].currentValue);
    }
    if(changes['config']){
      this.createDataSource(this.dataSource);
  }
  }
    
  onView(data: T): void {
    this.viewClick.emit(data);
  }

  onEdit(data: T): void {
    this.editClick.emit(data);
  }

  onDelete(data: T): void {
    this.deleteClick.emit(data);
  }
}
