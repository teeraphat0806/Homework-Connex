import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from "@angular/router";

// Components & Directives
import { HomeworkInputComponent } from "../../../../shared/components/homework-input/homework-input.component";

import { ErrorEditorState } from '../../../../shared/directives/validate-error.directive';

// Services
import { AuthApiService, LoginRequest } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true, // ตรวจสอบให้แน่ใจว่าเปิดใช้งาน standalone
  imports: [
    CommonModule, 
    HomeworkInputComponent, 
    
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent implements OnInit {
  
  // ข้อมูลฟอร์ม Login
  public loginData: LoginRequest = {
    UserName: '',
    Password: ''
  };

  // ตัวจัดการ Error Validation
  public errorState = new ErrorEditorState();

  // ใช้ Parameter Properties ใน Constructor เพื่อฉีด Service ได้ทันที (โค้ดจะสั้นลงมาก)
  constructor(
    private authService: AuthApiService, 
    private router: Router
  ) {}

  ngOnInit(): void {
    console.log('LoginComponent initialized');
  }

  

  // ทำงานเมื่อกด Submit ฟอร์ม
  submitLogin(): void {
    // 1. ล้าง Error เก่าก่อนตรวจสอบใหม่
    this.errorState.clearAllError();

    // 2. ตรวจสอบความถูกต้อง (Validation)
    if (!this.loginData.UserName) {
      this.errorState.setError('UserName', 'กรุณาระบุชื่อผู้ใช้งาน');
    }

    if (!this.loginData.Password) {
      this.errorState.setError('Password', 'กรุณาระบุรหัสผ่าน');
    }

    // หากมี Error ค้างอยู่ ให้หยุดทำงานทันที
    if (this.errorState.errors.length > 0) {
      return; 
    }

    // 3. เรียก API เพื่อยืนยันตัวตน
    this.authService.Login(this.loginData).subscribe({
      next: (response) => {
        console.log('Login successful', response);
        this.router.navigate(['/dashboard']);
      },
      error: (error) => {
        console.error('Login failed', error);
        this.errorState.setError('general', 'เข้าสู่ระบบไม่สำเร็จ กรุณาตรวจสอบข้อมูลและลองใหม่อีกครั้ง');
      }
    }); 
  }
}