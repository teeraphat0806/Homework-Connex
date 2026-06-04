import { Component, OnChanges, Input, Output, EventEmitter, SimpleChanges, OnDestroy } from "@angular/core";
import { CommonModule } from '@angular/common';
import { DxTextBoxModule } from "devextreme-angular/ui/text-box";
import { DxTextAreaModule } from "devextreme-angular/ui/text-area";
import { DxNumberBoxModule } from "devextreme-angular/ui/number-box";
import { DxDateBoxModule } from "devextreme-angular/ui/date-box";
import { DxSelectBoxModule } from "devextreme-angular/ui/select-box";
import { DxCheckBoxModule } from "devextreme-angular/ui/check-box";
import { DxButtonModule } from "devextreme-angular/ui/button";

import { DropDownViewModel } from "../../models/dropDown.model";
import { DateUtilService } from "../../../core/services/dateUtil.service";
import { ErrorEditorState, ValidateErrorDirective } from "../../directives/validate-error.directive";
export type HomeworkInputType =
  | 'Text'
  | 'Number'
  | 'Integer'
  | 'Decimal'
  | 'TextArea'
  | 'Password'
  | 'Date'
  | 'DateTime'
  | 'Phone'
  | 'Email'
  | 'DropDown'
  | 'CheckBox'
  | 'Search'
  | string;

@Component({
  selector: 'app-homework-input',
  imports: [
     CommonModule,
    DxTextBoxModule,
    DxTextAreaModule,
    DxNumberBoxModule,
    DxDateBoxModule,
    DxSelectBoxModule,
    DxCheckBoxModule,
    DxButtonModule,ValidateErrorDirective],
  templateUrl: './homework-input.component.html',
  styleUrl: './homework-input.component.css',
})
export class HomeworkInputComponent implements OnChanges, OnDestroy {
  
  /* INPUT */
  @Input() componentState: ErrorEditorState = new ErrorEditorState();
  @Input() type: HomeworkInputType = 'Text';
  @Input() dropdownDs: (DropDownViewModel | string)[] = [];
  @Input() attributeName: any;
  @Input() placeholder = '';
  @Input() isRequired = false;
  @Input() fieldValue: any;
  @Input() testId = '';
  @Input() label = '';
  @Input() isDisabled = false;
  @Input() isReadOnly = false;
  @Input() layout: 'col' | 'row' = 'col';           // 'row' = label + input side by side
  @Input() labelPosition: 'top' | 'bottom' = 'top'; // 'bottom' = label below input
  @Input() fontSize?: number = 14;
  @Input() max?: number;
  @Input() min?: number;
  @Input() preventTyping: boolean = false;
  @Input() isInteger: boolean = false;
  @Input() errors: any[] = [];
  @Input() fieldName: string = '';
  @Input() validateHelper?: ErrorEditorState;
  @Input() isShowLength: boolean = true;
  @Input() inputClass: string = '';

  @Input() minDate: any = undefined;
  @Input() maxDate: any = undefined;
  @Input() format?: string;
  @Input() allowNegative: boolean = true;

  /* OUTPUT */
  @Output() fieldValueChange = new EventEmitter<any>();
  @Output() onEnterKey = new EventEmitter<void>();
  @Output() onBlur = new EventEmitter<void>();

  /* UI STATE */
  public showPassword = false;
  public uiValue: any = '';

  constructor(private dateUtilService: DateUtilService) { }

  /* LIFECYCLE */
  ngOnChanges(changes: SimpleChanges): void {
    if ('fieldValue' in changes) {
      this.syncUiValue();
    }
  }

  ngOnDestroy(): void {
    // ทำความสะอาด listeners
    this.wheelListeners.forEach((listener, element) => {
      element.removeEventListener('wheel', listener);
    });
    this.wheelListeners.clear();
  }


  // /* PRIVATE */
  // private syncUiValue() {
  //   this.uiValue =
  //     this.fieldValue === null || this.fieldValue === undefined
  //       ? ''
  //       : this.fieldValue;

  //   if (
  //     this.type === 'CheckBox' &&
  //     this.dropdownDs?.length > 0 &&
  //     typeof this.uiValue === 'string'
  //   ) {
  //     this.uiValue = this.uiValue === ''
  //       ? []
  //       : this.uiValue.split(',');
  //   }

  //   if (this.type === 'Number' && this.uiValue !== '' && typeof this.uiValue === 'string') {
  //     const numValue = Number(this.uiValue.replace(/,/g, ''));
  //     if (!isNaN(numValue)) {
  //       this.uiValue = numValue;
  //     }
  //   }

  //   if (this.type === 'Phone' && typeof this.uiValue === 'string' && this.uiValue !== '') {
  //     let raw = this.uiValue.replace(/\D/g, '');
  //     if (raw.length > 10) raw = raw.slice(0, 10);
  //     let display = raw;
  //     if (raw.length >= 7) {
  //       display = raw.replace(/(\d{3})(\d{3})(\d+)/, '$1-$2-$3');
  //     } else if (raw.length >= 4) {
  //       display = raw.replace(/(\d{3})(\d+)/, '$1-$2');
  //     }
  //     this.uiValue = display;
  //   }
  // }


  // /* HANDLERS */
  // onValueChange(value: any) {
  //   this.uiValue = value ?? '';

  //   let modelValue: any = value;

  //   if (value === '' || value === undefined) {
  //     modelValue = null;
  //   }

  //   if (this.type === 'Date' || this.type === 'DateTime') {

  //     modelValue = value
  //       ? this.dateUtilService.toOrgString(value)
  //       : null;
  //   }

  //   if (this.type === 'DropDown') {
  //     modelValue = value ?? null;
  //   }

  //   if ((this.type === 'Number') && this.isInteger && modelValue !== null) {
  //     modelValue = Math.round(Number(modelValue));
  //   }

  //   if (this.validateHelper && this.fieldName) {
  //     this.validateHelper.clearError(this.fieldName);
  //   }

  //   if (this.componentState && this.attributeName) {
  //     this.componentState.clearError(this.attributeName);
  //   }

  //   this.fieldValueChange.emit(modelValue ? modelValue.toString() : null);
  // }

  /* PRIVATE */
  private syncUiValue() {
    this.uiValue =
      this.fieldValue === null || this.fieldValue === undefined
        ? ''
        : this.fieldValue;

    if (
      this.type === 'CheckBox' &&
      this.dropdownDs?.length > 0 &&
      typeof this.uiValue === 'string'
    ) {
      this.uiValue = this.uiValue === ''
        ? []
        : this.uiValue.split(',');
    }

    // Number / Integer / Decimal
    if (
      (this.type === 'Number' ||
        this.type === 'Integer' ||
        this.type === 'Decimal') &&
      this.uiValue !== '' &&
      this.uiValue !== null &&
      this.uiValue !== undefined
    ) {
      const numValue = Number(String(this.uiValue).replace(/,/g, ''));

      if (!isNaN(numValue)) {
        this.uiValue = numValue;
      } else {
        this.uiValue = '';
      }
    }

    if (
      this.type === 'Phone' &&
      typeof this.uiValue === 'string' &&
      this.uiValue !== ''
    ) {
      let raw = this.uiValue.replace(/\D/g, '');

      if (raw.length > 10) raw = raw.slice(0, 10);

      let display = raw;

      if (raw.length >= 7) {
        display = raw.replace(/(\d{3})(\d{3})(\d+)/, '$1-$2-$3');
      } else if (raw.length >= 4) {
        display = raw.replace(/(\d{3})(\d+)/, '$1-$2');
      }

      this.uiValue = display;
    }
  }


  /* HANDLERS */
  /* HANDLERS */
  onValueChange(e: any) {

    // support both $event and $event.value
    const isEventObject =
      e &&
      typeof e === 'object' &&
      ('value' in e || 'component' in e);

    const value = isEventObject ? e.value : e;

    // detect visible text (important for dxNumberBox)
    const text = isEventObject
      ? (
        e.event?.target?.value ??
        e.component?.option('text') ??
        ''
      )
      : String(value ?? '');

    this.uiValue = text === '' ? '' : value;

    let modelValue: any = value;

    // delete all text => null
    if (text.trim() === '') {
      modelValue = null;
    }

    // Date / DateTime
    if (this.type === 'Date' || this.type === 'DateTime') {
      modelValue = modelValue
        ? this.dateUtilService.toOrgString(modelValue)
        : null;
    }

    // DropDown
    if (this.type === 'DropDown') {
      modelValue = value ?? null;
    }

    // Number / Integer / Decimal
    if (
      this.type === 'Number' ||
      this.type === 'Integer' ||
      this.type === 'Decimal'
    ) {
      if (modelValue !== null) {
        modelValue = Number(modelValue);

        if (isNaN(modelValue)) {
          modelValue = null;
        }
      }
    }

    // Integer round
    if (this.type === 'Integer' && modelValue !== null) {
      modelValue = Math.round(modelValue);
    }

    if (
      this.type === 'Number' &&
      this.isInteger &&
      modelValue !== null
    ) {
      modelValue = Math.round(modelValue);
    }

    // clear errors
    if (this.validateHelper && this.fieldName) {
      this.validateHelper.clearError(this.fieldName);
    }

    if (this.componentState && this.attributeName) {
      this.componentState.clearError(this.attributeName);
    }

    // emit:
    // 1 => "1"
    // 0 => "0"
    // delete => null
    this.fieldValueChange.emit(
      modelValue === null || modelValue === undefined
        ? null
        : modelValue.toString()
    );
  }
  clearValue() {
    this.uiValue = '';
    this.fieldValueChange.emit(null);
  }

  onNumberKeyDown(e: any) {
    const event = e.event;
    const allowedKeys = ['Backspace', 'ArrowLeft', 'ArrowRight', 'Tab', 'Delete', 'Enter', 'Home', 'End'];

    // Allow control keys and navigation keys
    if (
      allowedKeys.includes(event.key) ||
      event.ctrlKey ||
      event.metaKey
    ) {
      return;
    }

    const isNumericKey = (event.key >= '0' && event.key <= '9');
    const isDecimalSeparator = (event.key === '.' && (this.type === 'Decimal' || (this.type === 'Number' && !this.isInteger)));
    const isMinusSign = (event.key === '-' && this.allowNegative);

    if (isNumericKey || isDecimalSeparator || isMinusSign) {
      if (this.max !== undefined) {
        const input = event.target as HTMLInputElement;
        const start = input.selectionStart || 0;
        const end = input.selectionEnd || 0;
        const val = input.value || '';

        // Construct the potential new value string
        const nextValString = val.substring(0, start) + event.key + val.substring(end);
        const numericValue = Number(nextValString.replace(/,/g, ''));

        if (!isNaN(numericValue) && numericValue > this.max) {
          event.preventDefault();
          // Emit the max value to notify parent and trigger syncing
          this.fieldValueChange.emit(this.max.toString());
          return;
        }
      }
      return;
    }

    // Prevent default for any other keys like e, E, +, #, $
    event.preventDefault();
  }


  togglePassword() {
    this.showPassword = !this.showPassword;
  }

  onPhoneValueChange(value: string) {
    if (value === null || value === undefined) value = '';
    let raw = value.replace(/\D/g, '');

    if (raw.length > 10) {
      raw = raw.slice(0, 10);
    }

    let display = raw;
    if (raw.length >= 7) {
      display = raw.replace(/(\d{3})(\d{3})(\d+)/, '$1-$2-$3');
    } else if (raw.length >= 4) {
      display = raw.replace(/(\d{3})(\d+)/, '$1-$2');
    }

    setTimeout(() => {
      this.uiValue = display;
    });

    // 🔥 emit digits only
    if (this.fieldValue !== raw) {
      this.fieldValueChange.emit(raw);
    }

    if (this.validateHelper && this.fieldName) {
      this.validateHelper.clearError(this.fieldName);
    }

    if (this.componentState && this.attributeName) {
      this.componentState.clearError(this.attributeName);
    }
  }

  onPhoneKeyDown(e: any) {
    const event = e.event || e;
    const allowedKeys = ['Backspace', 'ArrowLeft', 'ArrowRight', 'Tab', 'Delete', 'Enter', 'Home', 'End'];

    // Allow control keys and shortcuts
    if (allowedKeys.includes(event.key) || event.ctrlKey || event.metaKey) {
      return;
    }

    // Block non-numeric typing just to be safe
    if (event.key < '0' || event.key > '9') {
      event.preventDefault();
      return;
    }

    const input = event.target as HTMLInputElement;
    if (!input) return;

    // Allow typing if text is highlighted (meaning it will replace text)
    if (input.selectionStart !== input.selectionEnd) {
      return;
    }

    // Count current digits
    const raw = (input.value || '').replace(/\D/g, '');
    if (raw.length >= 10) {
      event.preventDefault(); // Block typing if we already have 10 digits
    }
  }

  isOptionSelected(key: string): boolean {
    if (Array.isArray(this.uiValue)) {
      return this.uiValue.includes(key);
    }
    return this.uiValue === key;
  }

  onMultiOptionChange(key: string, isChecked: boolean) {
    let currentValues: string[] = [];

    if (Array.isArray(this.uiValue)) {
      currentValues = [...this.uiValue];
    } else if (this.uiValue) {
      currentValues = [this.uiValue];
    }

    if (isChecked) {
      if (!currentValues.includes(key)) {
        currentValues.push(key);
      }
    } else {
      currentValues = currentValues.filter(v => v !== key);
    }

    this.onValueChange(currentValues);
  }

  private wheelListeners = new Map<HTMLElement, (e: Event) => void>();

  onNumberBoxFocus(e: any): void {
    const element = e.element as HTMLElement;

    // ลบ listener เก่าถ้ามี
    if (this.wheelListeners.has(element)) {
      const oldListener = this.wheelListeners.get(element)!;
      element.removeEventListener('wheel', oldListener);
    }

    // สร้าง listener ใหม่
    const wheelHandler = (event: Event) => {
      event.preventDefault();
      event.stopPropagation();
      event.stopImmediatePropagation();
      return false;
    };

    // เก็บ reference และ add listener
    this.wheelListeners.set(element, wheelHandler);
    element.addEventListener('wheel', wheelHandler, { passive: false, capture: true });
  }
}
