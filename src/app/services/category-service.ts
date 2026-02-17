import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { Category, GetCategory } from '../models/category.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CategoryService {
  baseUrl: string = 'https://localhost:7031/api/Category';
  constructor(private http: HttpClient, private cookieService: CookieService) { }

  getCategories(): Observable<GetCategory[]> {
    return this.http.get<GetCategory[]>(`${this.baseUrl}`);
  }

  getCategoryById(id: number): Observable<GetCategory> {
    return this.http.get<GetCategory>(`${this.baseUrl}/${id}`);
  }

  addCategory(categoryData: Category, imageFile: File | null): Observable<GetCategory> {
    const token = this.cookieService.get('authToken');
    const headers = new HttpHeaders({ 'Authorization': `Bearer ${token}` })
    const formData = new FormData();
    formData.append('name', categoryData.name);
    formData.append('picture', 'empty');
    if (imageFile) {
      formData.append('imageFile', imageFile);
    }
    return this.http.post<GetCategory>(`${this.baseUrl}`, formData, { headers });
  }

  updateCategory(id: number, categoryData: Partial<Category>, imageFile: File | null): Observable<GetCategory> {
    const token = this.cookieService.get('authToken');
    const headers = new HttpHeaders({ 'Authorization': `Bearer ${token}` })
    const formData = new FormData();
    if (categoryData.name) formData.append('name', categoryData.name);
    if (imageFile) {
      formData.append('imageFile', imageFile);
    }
    if (categoryData.picture) formData.append('picture', categoryData.picture);
    return this.http.put<GetCategory>(`${this.baseUrl}/${id}`, formData, { headers });
  }

  deleteCategory(id: number): Observable<string> {
    const token = this.cookieService.get('authToken');
    const headers = new HttpHeaders({ 'Authorization': `Bearer ${token}` })
    return this.http.delete<string>(`${this.baseUrl}/${id}`, { headers, responseType: 'text' as 'json' });
  }
}




