import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class PackageService {
    baseUrl: string = 'https://localhost:7031/api/package';
  constructor(private http: HttpClient) { }
  getpackages() {
    return this.http.get<any>(`${this.baseUrl}`);
  }
  getpackageById(id: number) {
    return this.http.get<any>(`${this.baseUrl}/${id}`);
  }
  addpackage(packageData: any) {
    const token = localStorage.getItem('authToken');
    const headers = new HttpHeaders({ 'Authorization': `Bearer ${token}` })
    return this.http.post<any>(`${this.baseUrl}`, packageData, { headers });
  }
  updatepackage(id: number, packageData: any) {
    const token = localStorage.getItem('authToken');
    const headers = new HttpHeaders({ 'Authorization': `Bearer ${token}` })
    return this.http.put<any>(`${this.baseUrl}/${id}`, packageData, { headers });
  }
  deletepackage(id: number) {
    const token = localStorage.getItem('authToken');
    const headers = new HttpHeaders({ 'Authorization': `Bearer ${token}` })
    return this.http.delete<any>(`${this.baseUrl}/${id}`, { headers, responseType: 'text' as 'json' });
  }
}
