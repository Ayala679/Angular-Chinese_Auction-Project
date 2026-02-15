import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';

@Injectable({
  providedIn: 'root',
})
export class PackageService {
    baseUrl: string = 'https://localhost:7031/api/package';
  constructor(private http: HttpClient, private cookieService: CookieService) { }
  getpackages() {
    return this.http.get<any>(`${this.baseUrl}`);
  }
  getpackageById(id: number) {
    return this.http.get<any>(`${this.baseUrl}/${id}`);
  }
  addpackage(packageData: any) {
    const token = this.cookieService.get('authToken');
    const headers = new HttpHeaders({ 'Authorization': `Bearer ${token}` })
    return this.http.post<any>(`${this.baseUrl}`, packageData, { headers });
  }
  updatepackage(id: number, packageData: any) {
    const token = this.cookieService.get('authToken');
    const headers = new HttpHeaders({ 'Authorization': `Bearer ${token}` })
    return this.http.put<any>(`${this.baseUrl}/${id}`, packageData, { headers });
  }
  deletepackage(id: number) {
    const token = this.cookieService.get('authToken');
    const headers = new HttpHeaders({ 'Authorization': `Bearer ${token}` })
    return this.http.delete<any>(`${this.baseUrl}/${id}`, { headers, responseType: 'text' as 'json' });
  }
}
