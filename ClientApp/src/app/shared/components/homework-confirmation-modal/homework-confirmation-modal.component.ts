import { Component, Input, EventEmitter, Output, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DxPopupModule } from 'devextreme-angular';
import { HomeworkButton } from '../homework-button/homework-button.component';
import { ButtonTheme } from '../../models/pages-design.model'; // นำเข้า Type ของธีมปุ่ม

@Component({
  selector: 'homework-confirmation-modal',
  standalone: true,
  imports: [CommonModule, DxPopupModule, HomeworkButton],
  templateUrl: './homework-confirmation-modal.component.html',
  styleUrl: './homework-confirmation-modal.component.css',
})
export class HomeworkConfirmationModalComponent implements OnChanges {
  isPopupVisible: boolean = false; 

  // Modal Configurations
  @Input() visible: boolean = false;
  @Input() title: string = 'Confirmation';
  @Input() message: string = 'Are you sure you want to proceed?';
  @Input() width: number | string = 400;
  @Input() height: number | string = 220;
  @Input() showCloseButton: boolean = true;
  @Input() showTitle: boolean = true;
  @Input() resizable: boolean = false;
  @Input() draggable: boolean = false;
  @Input() closingOutside: boolean = false;

  // Inputs สำหรับปุ่ม Confirm
  @Input() confirmText: string = 'Confirm';
  @Input() confirmTheme: ButtonTheme = 'Primary'; // หรือเปลี่ยนเป็น 'Danger' หากใช้กับการลบเป็นหลัก
  @Input() confirmStylingMode: 'contained' | 'outlined' | 'text' = 'contained';
  @Input() confirmSize: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' = 'md';
  @Input() confirmDisabled: boolean = false;
  @Input() colorConfirmButton: string = ''; 
  @Input() colorConfirmText: string = ''; 
  // Inputs สำหรับปุ่ม Cancel
  @Input() cancelText: string = 'Cancel';
  @Input() cancelTheme: ButtonTheme = 'Secondary'; // สไตล์ปุ่มรอง
  @Input() cancelStylingMode: 'contained' | 'outlined' | 'text' = 'outlined'; // ปรับเป็นเส้นขอบตามดีไซน์สากล
  @Input() cancelSize: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' = 'md';
  @Input() cancelDisabled: boolean = false;
  @Input() colorCancelButton: string = '';
  @Input() colorCancelText: string = '';

  // Outputs
  @Output() confirm = new EventEmitter<void>();
  @Output() cancel = new EventEmitter<void>();
  @Output() visibleChange = new EventEmitter<boolean>();

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['visible']) {
      this.isPopupVisible = this.visible;
    }
  }

  onConfirm(): void {
    this.confirm.emit();
    this.closeModal();
  }

  onCancel(): void {
    this.cancel.emit();
    this.closeModal();
  }

  private closeModal(): void {
    this.isPopupVisible = false;
    this.visibleChange.emit(false);
  }
}