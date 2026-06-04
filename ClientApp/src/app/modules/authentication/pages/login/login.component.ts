import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import {HomeworkInputComponent} from "../../../../shared/components/homework-input/homework-input.component";
import { ErrorEditorState } from '../../../../shared/directives/validate-error.directive';

@Component({
  selector: 'app-login',
  imports: [CommonModule, HomeworkInputComponent],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent {
  loginData = {
    username: '',
    password: ''
  };
  ngOnInit() {
    console.log('LoginComponent initialized');

  }
  // สร้าง Instance สำหรับจัดการ Error
  errorState = new ErrorEditorState();
  
  submitLogin() {
    // ล้าง Error เก่าก่อนทำการตรวจสอบใหม่
    this.errorState.clearAllError();

    // ตัวอย่างการ Validate
    if (!this.loginData.username) {
      this.errorState.setError('username', 'กรุณาระบุชื่อผู้ใช้งาน');
    }

    if (!this.loginData.password) {
      this.errorState.setError('password', 'กรุณาระบุรหัสผ่าน');
    }

    if (this.errorState.errors.length > 0) {
      return; // หากมี Error ให้หยุดการทำงาน
    }

    console.log(this.loginData);
  }
}
