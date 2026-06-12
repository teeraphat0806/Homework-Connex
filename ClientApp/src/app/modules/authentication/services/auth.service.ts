import { Injectable, signal, WritableSignal } from "@angular/core";
import { environment } from "../../../../environments/environment";
import { HttpClient } from "@angular/common/http";
import { catchError, Observable, tap, map, throwError, of } from "rxjs";
import { Router } from "@angular/router";

export interface LoginRequest {
  UserName: string;
  Password: string;
}

export interface LoginViewModel {
  UserId: number;
  UserName: string;
  ExpiredTime: string;
}

export interface SessionViewModel {
  isValid: boolean;
  Message: string;
}
export interface RegisterRequest {
    UserName: string;
    Password: string;
    FirstName: string;
    LastName: string;
    Age: number;
    Phone: string;
    BirthDate: Date;
}

@Injectable({
    providedIn: 'root'
})
export class AuthApiService {
    private url = `${environment.apiUrl}Auth`; ;
    private currentUser: WritableSignal<LoginViewModel | null> = signal(null);
    constructor(private http: HttpClient, private router: Router) { 
    }
    Login(params: LoginRequest): Observable<LoginViewModel>{
        return this.http.post<LoginViewModel>(`${this.url}/login`, params,{withCredentials: true}).pipe(
            
             catchError(error => {
                console.error('Login failed', error);
                return throwError(() => error);
            }),
            tap(user => {
                this.currentUser.set(user);
            }),
        );
    }
    Register(params: RegisterRequest): Observable<any> {
        return this.http.post(`${this.url}/register`, params, { withCredentials: true }).pipe(
            catchError(error => {
                console.error('Registration failed', error);
                return throwError(() => error);
            }
        ));
    }
    Logout(): Observable<any> {
        return this.http.post(`${this.url}/Logout`, {}, { withCredentials: true }).pipe(
            tap(() => {
                this.currentUser.set(null);
            }
        ));
    }
    IsSessionValid(): Observable<SessionViewModel> {
        return this.http.post<SessionViewModel>(`${this.url}/is-session-valid`, {}, { withCredentials: true }).pipe(
            map(res => {
                if (!res.isValid) {
                    this.currentUser.set(null);
                }
                console.log('Session validation result:', res);
                return res;
            }),
            catchError(err => {
                console.error("IsSessionValid Error:", err);
                this.currentUser.set(null);
                return of({ isValid: false, Message: 'Error validating session' });
            })
        );
    }   
    RefreshToken(): Observable<LoginViewModel> {
        return this.http.post<LoginViewModel>(`${this.url}/RefreshToken`, {}, { withCredentials: true }).pipe(
            tap(user => {
                this.currentUser.set(user);
            }
        ));
    }
        
    GetCurrentUser(): WritableSignal<LoginViewModel | null> {
        return this.currentUser;
    }
    SetCurrentUser(user: LoginViewModel | null): void {
        this.currentUser.set(user);
    }
}