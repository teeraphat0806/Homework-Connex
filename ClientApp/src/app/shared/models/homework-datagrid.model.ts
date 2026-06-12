import { ButtonTheme } from './pages-design.model';


export type GridCellValue =
  | string
  | number
  | boolean
  | Date
  | null
  | undefined;


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

export interface GridCellTemplateItem<T> {
  data: T;
  column: {
    dataField?: string;
    caption?: string;
  };
}


export interface DynamicGridAction<T> {
  label: string;
  theme: ButtonTheme;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';
  stylingMode?: 'contained' | 'outlined' | 'text';
  iconCode?: string;
  iconSize?: number;
  iconColor?: string;
  showDefaultLabel?: boolean;
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