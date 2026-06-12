import { Component } from '@angular/core';
import { DxNumberBoxModule } from 'devextreme-angular/ui/number-box';
import { DxDateBoxModule } from 'devextreme-angular/ui/date-box';
import { DxSelectBoxModule } from 'devextreme-angular/ui/select-box';
import {HomeworkButton} from '../homework-button/homework-button.component';
import { HomeworkInputComponent} from '../homework-input/homework-input.component';
@Component({
  selector: 'homework-member-form',
  imports: [ DxNumberBoxModule, DxDateBoxModule, DxSelectBoxModule, HomeworkButton, HomeworkInputComponent],
  templateUrl: './homework-member-form.component.html',
  styleUrl: './homework-member-form.component.css',
})
export class HomeworkMemberFormComponent {
//`DxTextBoxModule`, `DxNumberBoxModule`, `DxDateBoxModule`, `DxSelectBoxModule`, `DxButtonModule`

}
