import { Component, Input, EventEmitter, Output} from '@angular/core';
import { DxDropDownButtonModule } from 'devextreme-angular';
import { CommonModule } from '@angular/common';

export interface HomeworkDropdownItem {
  id: number | string;
  text: string;
  icon: string;
  disabled?: boolean;
  [key: string]: any; 
}
@Component({
  selector: 'homework-dropdown',
  imports: [
    DxDropDownButtonModule,
    CommonModule
  ],
  templateUrl: './homework-dropdown.component.html',
  styleUrl: './homework-dropdown.component.css',
})
export class HomeworkDropdownComponent {

  /* INPUT */
  @Input() items: HomeworkDropdownItem[] = [];       // รายการเมนูที่จะแสดง
  @Input() selectedItemKey: any = null;               // Key ของไอเทมที่เลือกอยู่ (ถ้ามี)
  @Input() splitButton: boolean = false;              // แบ่งปุ่มออกเป็น 2 ฝั่ง (ฝั่งกดปกติ กับ ฝั่งกดเปิด Dropdown)
  @Input() text: string = 'Select Action';            // ข้อความที่จะแสดงบนปุ่มหลัก
  @Input() icon?: string;                             // ไอicon บนปุ่มหลัก
  @Input() disabled: boolean = false;                 // ปิดการใช้งานปุ่ม
  @Input() stylingMode: 'contained' | 'outlined' | 'text' = 'contained'; // รูปแบบปุ่ม
  @Input() type: 'normal' | 'default' | 'success' | 'danger'| string  = 'normal';   // สี/ประเภทของปุ่ม
  @Input() useSelectMode: boolean = false;            // เปิดโหมดเลือกค่า (ถ้าเลือกแล้วจะจำสถานะ และเปลี่ยน Text บนปุ่มตามที่เลือก)
  @Input() displayExpr: string = 'text';              // ชื่อฟิลด์ที่จะเอามาแสดงผล
  @Input() keyExpr: string = 'id';                    // ชื่อฟิลด์ที่เป็น Key

  /* OUTPUT */
  @Output() onItemClick = new EventEmitter<HomeworkDropdownItem>();  // ส่งค่าออกไปเมื่อมีการกดคลิกเลือกเมนูย่อย
  @Output() onButtonClick = new EventEmitter<void>();                // ส่งค่าออกไปเมื่อมีการกดที่ตัวปุ่มหลัก (ใช้ได้ดีเมื่อเปิด splitButton)
  @Output() selectedItemKeyChange = new EventEmitter<any>();
  /* HANDLERS */
  // ทำงานเมื่อมีการคลิกเลือกเมนูใน Dropdown List
  onDropdownItemClick(e: any): void {
    const clickedItem = e.itemData as HomeworkDropdownItem;
    
     // ส่งค่า selectedItemKey ไปยัง Parent Component
    this.selectedItemKeyChange.emit(clickedItem[this.keyExpr]);
    // ส่งข้อมูลของ Item ที่ถูกคลิกออกไปให้ Parent Component ใช้งานต่อ
    this.onItemClick.emit(clickedItem);
   
  }

  // ทำงานเมื่อกดที่ตัวปุ่มหลัก (มักใช้ควบคู่กับ splitButton: true)
  onMainButtonClick(e: any): void {
    this.onButtonClick.emit();
  }
}