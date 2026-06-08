import { Component , OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {HomeworkInputComponent} from "../../../../shared/components/homework-input/homework-input.component";
import { ErrorEditorState } from '../../../../shared/directives/validate-error.directive';
import { AuthApiService } from '../../services/auth.service';
import {LoginRequest} from '../../services/auth.service';
import {Router} from "@angular/router";
@Component({
  selector: 'app-login',
  imports: [CommonModule, HomeworkInputComponent],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent implements OnInit {
  loginData: LoginRequest = {
    UserName: '',
    Password: ''
  };
  
  ngOnInit() {
    console.log('LoginComponent initialized');

  }
  
  // สร้าง Instance สำหรับจัดการ Error
  errorState = new ErrorEditorState();
  authService: AuthApiService;
  router: Router;
  constructor(authService: AuthApiService, router: Router) {
    this.authService = authService;
    this.router = router;

  }
  submitLogin() {
    // ล้าง Error เก่าก่อนทำการตรวจสอบใหม่
    this.errorState.clearAllError();

    // ตัวอย่างการ Validate
    if (!this.loginData.UserName) {
      this.errorState.setError('UserName', 'กรุณาระบุชื่อผู้ใช้งาน');
    }

    if (!this.loginData.Password) {
      this.errorState.setError('Password', 'กรุณาระบุรหัสผ่าน');
    }

    if (this.errorState.errors.length > 0) {
      return; // หากมี Error ให้หยุดการทำงาน
    }

    this.authService.Login(this.loginData).subscribe({
      next: (response) => {
        console.log('Login successful', response);
        // ทำการนำทางไปยังหน้าอื่นหรือแสดงข้อความสำเร็จ
        this.router.navigate(['/dashboard']);
      },
      error: (error) => {
        console.error('Login failed', error);
        // แสดงข้อความผิดพลาดให้ผู้ใช้ทราบ
        this.errorState.setError('general', 'เข้าสู่ระบบไม่สำเร็จ กรุณาตรวจสอบข้อมูลและลองใหม่อีกครั้ง');
      }
    }); 
  }
}
