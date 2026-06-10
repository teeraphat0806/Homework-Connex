import {
  Component,
  Input,
  EventEmitter,
  Output,
  OnChanges,
  SimpleChanges,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { DxPopupModule } from 'devextreme-angular';
import { HomeworkButton } from '../homework-button/homework-button.component';

export interface ConfirmationModalConfig {
  title?: string;
  width?: number | string;
  height?: number | string;
  showCloseButton?: boolean;
  showTitle?: boolean;
  resizable?: boolean;
  draggable?: boolean;
  closingOutside?: boolean;
}

@Component({
  selector: 'homework-confirmation-modal',
  standalone: true,
  imports: [CommonModule, DxPopupModule, HomeworkButton],
  templateUrl: './homework-confirmation-modal.component.html',
  styleUrl: './homework-confirmation-modal.component.css',
})
export class HomeworkConfirmationModalComponent implements OnChanges {
  @Input() visible: boolean = false;
  @Input() config: ConfirmationModalConfig = {};

  // Cancel Button Props
  @Input() cancelText: string = 'Cancel';
  @Input() cancelTheme: string = 'Secondary';
  @Input() cancelStylingMode: string = 'outlined';
  @Input() cancelSize: string = 'normal';
  @Input() cancelDisabled: boolean = false;
  @Input() colorCancelButton: string = '';
  @Input() colorCancelText: string = '';

  // Confirm Button Props
  @Input() confirmText: string = 'Confirm';
  @Input() confirmTheme: string = 'Primary';
  @Input() confirmStylingMode: string = 'contained';
  @Input() confirmSize: string = 'normal';
  @Input() confirmDisabled: boolean = false;
  @Input() colorConfirmButton: string = '';
  @Input() colorConfirmText: string = '';

  @Output() cancel = new EventEmitter<void>();
  @Output() confirm = new EventEmitter<void>();
  @Output() visibleChange = new EventEmitter<boolean>();

  isPopupVisible: boolean = false;

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['visible']) {
      this.isPopupVisible = this.visible;
    }
  }

  onCancel(): void {
    this.cancel.emit();
    this.closeModal();
  }

  onConfirm(): void {
    this.confirm.emit();
  }

  closeModal(): void {
    this.isPopupVisible = false;
    this.visibleChange.emit(false);
  }

  get title(): string {
    return this.config.title ?? 'Confirmation';
  }

  get width(): number | string {
    return this.config.width ?? 400;
  }

  get height(): number | string {
    return this.config.height ?? 220;
  }

  get showCloseButton(): boolean {
    return this.config.showCloseButton ?? true;
  }

  get showTitle(): boolean {
    return this.config.showTitle ?? true;
  }

  get resizable(): boolean {
    return this.config.resizable ?? false;
  }

  get draggable(): boolean {
    return this.config.draggable ?? false;
  }

  get closingOutside(): boolean {
    return this.config.closingOutside ?? false;
  }
}