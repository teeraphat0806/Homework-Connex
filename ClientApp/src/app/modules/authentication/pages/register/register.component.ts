import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomeworkInputComponent } from '../../../../shared/components/homework-input/homework-input.component';
import { ErrorEditorState } from '../../../../shared/directives/validate-error.directive';
import { RegisterModel } from '../../models/authentiscation.model';
import { AuthApiService } from '../../services/auth.service';
import { RegisterRequest } from '../../services/auth.service';
import { Router } from '@angular/router';
import { HomeworkButton } from '../../../../shared/components/homework-button/homework-button.component';
import { LoadingService } from '../../../../core/services/loading.service';
import { catchError } from 'rxjs';
import { catchErrorHandler } from '../../../../core/utils/swalHandler';
@Component({
  selector: 'app-register.component',
  imports: [CommonModule, HomeworkInputComponent, HomeworkButton],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css',
})
export class RegisterComponent {
  ngOnInit() {
    console.log('RegisterComponent initialized');
  }
  errorState = new ErrorEditorState();
  authService: AuthApiService;
  router: Router;
  public loadingService: LoadingService;

  constructor(authService: AuthApiService, router: Router, loadingService: LoadingService) {
    this.authService = authService;
    this.router = router;
    this.loadingService = loadingService;
  }
  registerData: RegisterRequest = {
    UserName: '',
    Password: '',
    FirstName: '',
    LastName: '',
    Age: 0,
    Phone: '',
    BirthDate: new Date(),
  };
  confirmPassword: string = '';

  // สร้าง Instance สำหรับจัดการ Error

  submitRegister() {
    // ล้าง Error เก่าก่อนทำการตรวจสอบใหม่
    this.errorState.clearAllError();

    // ตัวอย่างการ Validate
    if (!this.registerData.UserName) {
      this.errorState.setError('username', 'กรุณาระบุชื่อผู้ใช้งาน');
    }

    if (!this.registerData.Password) {
      this.errorState.setError('password', 'กรุณาระบุรหัสผ่าน');
    }

    if (this.registerData.Password !== this.confirmPassword) {
      this.errorState.setError('confirmPassword', 'รหัสผ่านไม่ตรงกัน');
    }
    if (this.errorState.errors.length > 0) {
      return; // หากมี Error ให้หยุดการทำงาน
    }

    // Format BirthDate to YYYY-MM-DD for .NET DateOnly compatibility
    const payload = {
      ...this.registerData,
      BirthDate: this.registerData.BirthDate
        ? new Date(this.registerData.BirthDate).toISOString().split('T')[0]
        : null,
    };

    this.authService
      .Register(payload as any)
      .pipe(
        catchError((x) => {
          return catchErrorHandler(x, this.errorState);
        }),
      )
      .subscribe({
        next: (response) => {
          console.log('Registration successful', response);
          // ทำการนำทางไปยังหน้าอื่นหรือแสดงข้อความสำเร็จ
          this.router.navigate(['/login']);
        },
        error: (error) => {
          console.error('Registration failed', error);
          // แสดงข้อความผิดพลาดให้ผู้ใช้ทราบ
          this.errorState.setError(
            'general',
            'ลงทะเบียนไม่สำเร็จ กรุณาตรวจสอบข้อมูลและลองใหม่อีกครั้ง',
          );
        },
      });
  }
}
