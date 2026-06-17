import { Component, Input, Output, EventEmitter } from '@angular/core';
import { DxRadioGroupModule } from 'devextreme-angular';
@Component({
  selector: 'homework-radio-group',
  imports: [DxRadioGroupModule],
  templateUrl: './homework-radio-group.component.html',
  styleUrl: './homework-radio-group.component.css',
})
export class HomeworkRadioGroupComponent {
  @Input() items!: any[];
  @Input() valueExpr!: string;
  @Input() displayExpr!: string;
  @Input() layout!: 'horizontal' | 'vertical';
  @Input() value!: any;
  @Output() valueChange = new EventEmitter<any>();

  onValueChange(e: any) {
    this.valueChange.emit(e);
  }
}
