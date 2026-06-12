import { Injectable } from "@angular/core";
import { environment } from "../../../../environments/environment";
import { HttpClient } from "@angular/common/http";
import { catchError, Observable, throwError } from "rxjs";

export interface CategorySearchRequest {
  keyword?: string;
}

export interface CategoryViewModel {
  categoryId: number;
  name: string;
}

@Injectable({
  providedIn: 'root'
})
export class CategoriesMasterApiService {
  private url = `${environment.apiUrl}categories`;

  constructor(private http: HttpClient) {}

  GetCategoriesList(params?: CategorySearchRequest): Observable<CategoryViewModel[]> {
    return this.http.get<CategoryViewModel[]>(`${this.url}/list`, {
      params: params as any,
      withCredentials: true
    }).pipe(
      catchError(error => {
        console.error('Error fetching categories list:', error);
        return throwError(() => error);
      })
    );
  }
}
