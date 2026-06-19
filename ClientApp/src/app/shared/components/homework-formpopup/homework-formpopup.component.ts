import { Component, EventEmitter, Input, Output } from '@angular/core';
import { DxPopupModule } from 'devextreme-angular';
import { HomeworkButton } from '../homework-button/homework-button.component';

import { ButtonTheme } from '../../models/pages-design.model';

@Component({
  selector: 'homework-formpopup',
  standalone: true,
  imports: [DxPopupModule, HomeworkButton],
  templateUrl: './homework-formpopup.component.html',
  styleUrl: './homework-formpopup.component.css',
})
export class HomeworkFormpopup {
  @Input() title = 'Form Popup';
  @Input() width: number | string = 400;
  @Input() height: number | string = 300;

  @Input() openButtonLabel = 'Open';
  @Input() saveButtonLabel = 'Save';
  @Input() cancelButtonLabel = 'Cancel';

  @Input() saveButtonColor = '';
  @Input() saveButtonTextColor: string | null = null;
  @Input() saveButtonTheme: ButtonTheme = 'Primary';

  @Input() cancelButtonColor = '';
  @Input() cancelButtonTextColor: string | null = null;
  @Input() cancelButtonTheme: ButtonTheme = 'Secondary';

  @Input() showOpenButton = true;
  @Input() showSaveButton = true;
  @Input() showCancelButton = true;
  @Input() showTitle = true;
  @Input() showFooter = true;
  @Input() showCloseButton = true;

  @Input() closeOnOutsideClick = true;
  @Input() draggable = true;
  @Input() resizable = true;

  @Input() visible = false;
  @Output() visibleChange = new EventEmitter<boolean>();

  @Output() cancel = new EventEmitter<void>();
  @Output() close = new EventEmitter<void>();
  @Output() save = new EventEmitter<void>();

  showPopup(): void {
    this.setVisible(true);
  }

  closePopup(): void {
    this.setVisible(false);
    this.cancel.emit();
    this.close.emit();
  }

  onSave(): void {
    this.save.emit();
  }

  onVisibleChange(value: boolean): void {
    this.setVisible(value);

    if (!value) {
      this.close.emit();
    }
  }

  private setVisible(value: boolean): void {
    this.visible = value;
    this.visibleChange.emit(value);
  }
}