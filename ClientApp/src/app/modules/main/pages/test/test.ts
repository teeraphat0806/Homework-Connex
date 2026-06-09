import { Component } from '@angular/core';
import { HomeworkDropdownComponent } from "../../../../shared/components/homework-dropdown/homework-dropdown.component";
import {HomeworkConfirmationModalComponent} from "../../../../shared/components/homework-confirmation-modal/homework-confirmation-modal.component";
@Component({
  selector: 'test',
  imports: [HomeworkDropdownComponent,HomeworkConfirmationModalComponent],
  templateUrl: './test.html',
  styleUrl: './test.css',
})
export class Test {
    public typecolor = 'success';
    isDeleteModalOpen: boolean = false;

    openDeleteModal(): void {
      this.isDeleteModalOpen = true;
    }
    closeDeleteModal(): void {
      this.isDeleteModalOpen = false;
    }
    onConfirmDelete(): void {
      console.log('ยืนยันการลบ');
      this.isDeleteModalOpen = false;
    }
    executeDeleteMemberLogic(): void {
      // ใส่โค้ดลบสมาชิกที่นี่
      console.log('ลบสมาชิกเรียบร้อยแล้ว');
    }

     onCancelDelete(): void {
      console.log('ยกเลิกการลบ');
      this.isDeleteModalOpen = false;
    }
    // ข้อมูลตัวเลือกของ Dropdown สถานะ
    public statusItems = [
      { id: 'active', text: 'เปิดใช้งาน', icon: 'check' },
      { id: 'inactive', text: 'ปิดใช้งาน', icon: 'close' }
    ];
    public currentStatus = 'active'; // สถานะเริ่มต้น
    // ทำงานเมื่อคลิกเปลี่ยนสถานะที่ Dropdown
  changeStatus(item: any): void {
    console.log('เปลี่ยนสถานะเป็น:', item.id);
    this.currentStatus = item.id;
    if (item.id === 'active') {
      this.typecolor = 'success';
    } else {
      this.typecolor = 'danger';
    }
  }
}
