import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, tap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CategoryService {
  private baseUrl: string = 'https://localhost:7031/api/Category';
  constructor(private http:HttpClient) { }

  getCategories():Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}`)
  }
}
