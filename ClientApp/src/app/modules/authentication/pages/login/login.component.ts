import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { catchError } from 'rxjs';
import { catchErrorHandler } from '../../../../core/utils/swalHandler';
// Components & Directives
import { HomeworkInputComponent } from '../../../../shared/components/homework-input/homework-input.component';
import { HomeworkButton } from '../../../../shared/components/homework-button/homework-button.component';

import {
  ErrorEditorState,
  ValidateErrorDirective,
} from '../../../../shared/directives/validate-error.directive';

// Services
import { AuthApiService, LoginRequest } from '../../services/auth.service';
import { LoadingService } from '../../../../core/services/loading.service';

@Component({
  selector: 'app-login',
  standalone: true, // ตรวจสอบให้แน่ใจว่าเปิดใช้งาน standalone
  imports: [CommonModule, HomeworkInputComponent, HomeworkButton, ValidateErrorDirective],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent implements OnInit {
  // ข้อมูลฟอร์ม Login
  public loginData: LoginRequest = {
    UserName: '',
    Password: '',
  };

  // ตัวจัดการ Error Validation
  public errorState = new ErrorEditorState();
  private refreshErrorState(): void {
    const oldState = this.errorState;

    const newState = new ErrorEditorState();

    oldState.errors.forEach((errorObj) => {
      Object.keys(errorObj).forEach((field) => {
        const messages = errorObj[field].map((x) => x.message);
        newState.setError(field, messages);
      });
    });

    this.errorState = newState;
  }
  // ใช้ Parameter Properties ใน Constructor เพื่อฉีด Service ได้ทันที (โค้ดจะสั้นลงมาก)
  constructor(
    private authService: AuthApiService,
    private router: Router,
    public loadingService: LoadingService
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

    if (this.errorState.errors.length > 0) {
      this.refreshErrorState();
      return;
    }
    // หากมี Error ค้างอยู่ ให้หยุดทำงานทันที
    // if (this.errorState.errors.length > 0) {
    //   return;
    // }

    // 3. เรียก API เพื่อยืนยันตัวตน
    this.authService
      .Login(this.loginData)
      // .pipe(
      //   catchError((x) => {
      //     return catchErrorHandler(x, this.errorState);
      //   }),
      // )
      .subscribe({
        next: (response) => {
          console.log('Login successful', response);
          this.router.navigate(['/main/products']);
        },

        error: (error) => {
          console.error('Login failed', error);

          const apiErrors = error?.error?.errors;

          if (Array.isArray(apiErrors)) {
            apiErrors.forEach((item: { field: string; message: string }) => {
              const fieldName = item.field === 'Username' ? 'UserName' : item.field;

              console.log('Set error for field', fieldName, 'message: ', item.message);

              this.errorState.setError(fieldName, item.message);
            });

            console.log('All errors:', this.errorState.errors);

            this.refreshErrorState();

            return;
          }
        },
      });
  }
}
