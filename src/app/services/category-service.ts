// import { HttpClient, HttpHeaders } from '@angular/common/http';
// import { Injectable } from '@angular/core';
// import { Observable, tap } from 'rxjs';
// import { GetCategory } from '../models/category.model';
// import { image } from '@primeuix/themes/aura/chip';
// import { header } from '@primeuix/themes/aura/accordion';

// @Injectable({
//   providedIn: 'root',
// })
// export class CategoryService {
//   private baseUrl: string = 'https://localhost:7031/api/Category';
//   token: string = '';
//   constructor(private http: HttpClient) { }

//   getCategories(): any {
//     return this.http.get<GetCategory[]>(`${this.baseUrl}`)
//   }

//   getCategoryById(id: number) {
//     return this.http.get<any>(`${this.baseUrl}/${id}`);
//   }
//   addCategory(categoryData: any) {
//     const formData = new FormData();
//     formData.append('Name', categoryData.name);
//     formData.append('Picture', categoryData.picture.name);
//     if (categoryData.picture instanceof File) {
//       formData.append('imageFile', categoryData.picture, categoryData.picture.name);
//         }
//     this.token = localStorage.getItem('authToken') || '';
//     const headers = new HttpHeaders({ 'Authorization': `Bearer ${this.token}` });
//     console.log(headers);
//     return this.http.post<any>('https://localhost:7031/api/category', formData, { headers });
//   }



//   updateCategory(id: number, categoryData: any) {
//     const formData = new FormData();
//     formData.append('name', categoryData.name);
//     if (categoryData.picture instanceof File) {
//       formData.append('picture', categoryData.picture);
//     }
//     return this.http.put<any>(`${this.baseUrl}/${id}`, formData);
//   }
//   deleteCategory(id: number) {
//     return this.http.delete<any>(`${this.baseUrl}/${id}`);
//   }

// }

import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';


@Injectable({
  providedIn: 'root',
})
export class CategoryService {
  baseUrl: string = 'https://localhost:7031/api/Category';
  constructor(private http: HttpClient) { }
  getCategories() {
    return this.http.get<any>(`${this.baseUrl}`);
  }
  getCategoryById(id: number) {
    return this.http.get<any>(`${this.baseUrl}/${id}`);
  }
  addCategory(categoryData: any, imageFile: File) {
    const token = localStorage.getItem('authToken');
    const headers = new HttpHeaders({ 'Authorization': `Bearer ${token}` })
    const formData = new FormData();
    formData.append('Name', categoryData.name);
    formData.append('Picture', 'enpty');
    formData.append('imageFile', imageFile);


    return this.http.post<any>(`${this.baseUrl}`, formData, { headers });
  }
  updateCategory(id: number, categoryData: any, imageFile: File) {
    const token = localStorage.getItem('authToken');
    const headers = new HttpHeaders({ 'Authorization': `Bearer ${token}` })
    const formData = new FormData();
    formData.append('Name', categoryData.name);
    if (imageFile) {
      formData.append('imageFile', imageFile);
    }
    formData.append('Picture', categoryData.picture);
    return this.http.put<any>(`${this.baseUrl}/${id}`, formData, { headers });
  }
  deleteCategory(id: number) {
    const token = localStorage.getItem('authToken');
    const headers = new HttpHeaders({ 'Authorization': `Bearer ${token}` })
    return this.http.delete<any>(`${this.baseUrl}/${id}`, { headers, responseType: 'text' as 'json' });
  }
}




