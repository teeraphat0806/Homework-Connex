import { Component } from '@angular/core';
import { HomeworkDropdownComponent } from "../../../../shared/components/homework-dropdown/homework-dropdown.component";
import {HomeworkConfirmationModalComponent} from "../../../../shared/components/homework-confirmation-modal/homework-confirmation-modal.component";
import {HomeworkButton} from "../../../../shared/components/homework-button/homework-button.component";
import {HomeworkOrderListComponent} from "../../../../shared/components/homework-order-list/homework-order-list.component";
@Component({
  selector: 'test',
  imports: [HomeworkDropdownComponent,HomeworkConfirmationModalComponent,HomeworkButton,HomeworkOrderListComponent],
  templateUrl: './test.html',
  styleUrl: './test.css',
})
export class Test {
    public typecolor = 'success';
    isDeleteModalVisible: boolean = false;

    openDeleteModal(): void {
      this.isDeleteModalVisible = true;
    }
    closeDeleteModal(): void {
      this.isDeleteModalVisible = false;
    }
    onConfirmDelete(): void {
      console.log('ยืนยันการลบ');
      this.isDeleteModalVisible = false;
    }
    executeDeleteMemberLogic(): void {
      // ใส่โค้ดลบสมาชิกที่นี่
      console.log('ลบสมาชิกเรียบร้อยแล้ว');
    }

     onCancelDelete(): void {
      console.log('ยกเลิกการลบ');
      this.isDeleteModalVisible = false;
    }
    // ข้อมูลตัวเลือกของ Dropdown สถานะ
    public deleteModalConfig = {
      title: 'ยืนยันการลบ',
      width: 300,
      height: 'auto',
      showCloseButton: true,
      showTitle: true,
      resizable: false,
      draggable: false,
      closingOutside: true
    };
    public product = {
      name: 'ตัวอย่างสินค้า',
      price: 1000,
      description: 'รายละเอียดของสินค้า'
    };
    public selectedProduct = this.product; // กำหนดสินค้าเริ่มต้นที่จะแสดงใน Modal
    public deleteProduct(): void {
      console.log('ลบสินค้า:', this.selectedProduct);
      
    }
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
