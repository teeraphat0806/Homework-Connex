import {Injectable} from '@angular/core';
import { environment } from '../../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { NavbarItemModel , PrivPageResponse } from '../models/navbar.model';
@Injectable({
  providedIn: 'root'
})
export class PostLoginNavbarService {
    private apiUrl = environment.apiUrl;
    constructor(private http: HttpClient) { }

    public getNavbar(): Observable<NavbarItemModel[]> {
        return this.http.get<NavbarItemModel[]>(this.apiUrl + 'navbar/menus', { withCredentials: true });
     }

     public getPrivPage(pageCode: string): Observable<PrivPageResponse> {
        return this.http.post<PrivPageResponse>(this.apiUrl + 'permission/GetPrivPage', { pageCode: pageCode }, { withCredentials: true });
     }
}
