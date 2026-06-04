import { Injectable, signal, WritableSignal } from "@angular/core";
import { environment } from "../../../../environments/environment";
import { HttpClient } from "@angular/common/http";
import { catchError, Observable, tap, map, throwError } from "rxjs";
import { Router } from "@angular/router";
import { shareReplay } from "rxjs/operators";

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
  IsValid: boolean;
  Message: string;
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
        return this.http.post<LoginViewModel>(`${this.url}/Login`, params,{withCredentials: true}).pipe(
            shareReplay(1),
             catchError(error => {
                console.error('Login failed', error);
                return throwError(() => new Error('Login failed. Please check your credentials and try again.'));
            }),
            tap(user => {
                this.currentUser.set(user);
            }),
        );
    }
    Logout(): Observable<any> {
        return this.http.post(`${this.url}/Logout`, {}, { withCredentials: true }).pipe(
            tap(() => {
                this.currentUser.set(null);
            }
        ));
    }
    IsSessionValid(): Observable<SessionViewModel> {
        return this.http.post<SessionViewModel>(`${this.url}/IsSessionValid`, {}, { withCredentials: true }).pipe(
            map(res => {
                if (!res.IsValid) {
                    this.currentUser.set(null);
                }
                return res;
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