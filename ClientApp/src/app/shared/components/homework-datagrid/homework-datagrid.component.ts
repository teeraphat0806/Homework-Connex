import {
  Component,
  Input,
  SimpleChanges,
  OnChanges,
  ContentChildren,
  QueryList,
  TemplateRef,
  AfterContentInit,
  Directive,
  ViewChild,
} from '@angular/core';

import { CommonModule } from '@angular/common';
import { DxDataGridModule, DxTemplateModule, DxDataGridComponent } from 'devextreme-angular';
import CustomStore from 'devextreme/data/custom_store';
import { HomeworkButton } from '../homework-button/homework-button.component';
import { ButtonTheme } from '../../models/pages-design.model';
import {
  DynamicGridConfig,
  DynamicGridColumn,
  DynamicGridAction,
  DynamicGridColumnType,
  GridCellTemplateItem,
} from '../../models/homework-datagrid.model';
import DataSource from 'devextreme/data/data_source';
@Directive({
  selector: 'ng-template[gridTemplate]',
  standalone: true,
})
export class GridTemplateDirective {
  @Input('gridTemplate') name!: string;

  constructor(public template: TemplateRef<any>) {}
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
  imports: [
    CommonModule,
    DxDataGridModule,
    DxTemplateModule,
    HomeworkButton,
    GridTemplateDirective,
  ],
  templateUrl: './homework-datagrid.component.html',
  styleUrl: './homework-datagrid.component.css',
})
export class HomeworkDatagridComponent<T> implements OnChanges, AfterContentInit {
  @ViewChild('dataGrid', { static: false }) public dataGrid!: DxDataGridComponent;
  public gridDataSource!: CustomStore;
  public isRemote = false;

  @Input() dataSource: T[] | DataSource | CustomStore | any = [];
  @Input() config!: DynamicGridConfig<T>;
  @Input() data!: DataSource;
  @ContentChildren(GridTemplateDirective)
  public templates!: QueryList<GridTemplateDirective>;

  public templateMap = new Map<string, TemplateRef<any>>();

  ngAfterContentInit(): void {
    this.templates.forEach((item) => {
      this.templateMap.set(item.name, item.template);
    });
  }

  public getCustomTemplate(templateName?: string): TemplateRef<any> | null {
    if (!templateName) {
      return null;
    }

    return this.templateMap.get(templateName) ?? null;
  }

  public getColumnCellTemplate(column: DynamicGridColumn): string | undefined {
    if (column.columnType === 'action') {
      return column.cellTemplate ?? 'actionTemplate';
    }

    if (column.cellTemplate) {
      return 'customColumnTemplate';
    }

    return undefined;
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['dataSource'] || changes['config']) {
      this.createDataSource(this.dataSource);
    }
  }

  private createDataSource(data: any): void {
    console.log('createDataSource called with:', data);
    if (data) {
      console.log('data constructor:', data.constructor ? data.constructor.name : 'none');
      console.log('typeof data.load:', typeof data.load);
      console.log('data instanceof DataSource:', data instanceof DataSource);
      console.log('data instanceof CustomStore:', data instanceof CustomStore);
    }
    
    if (data && (data instanceof CustomStore || data instanceof DataSource || typeof data.load === 'function')) {
      console.log('Setting gridDataSource directly to data');
      this.gridDataSource = data;
      this.isRemote = true;
    } else {
      console.log('Creating new CustomStore for local data');
      this.gridDataSource = new CustomStore({
        key: this.config?.keyExpr,
        load: () => {
          console.log('Local CustomStore load called, returning:', data);
          return data || [];
        },
      });
      this.isRemote = false;
    }
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

  public getCustomTemplateByItem(item: GridCellTemplateItem<T>): TemplateRef<unknown> | null {
    const columnConfig = this.config.columns.find(
      (column) =>
        column.dataField === item.column.dataField && column.caption === item.column.caption,
    );

    if (!columnConfig?.cellTemplate) {
      return null;
    }

    return this.getCustomTemplate(columnConfig.cellTemplate);
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
