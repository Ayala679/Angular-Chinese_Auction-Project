import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { CreatePackageDto, GetPackageDto } from '../models/package.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class PackageService {
  baseUrl: string = 'https://localhost:7031/api/package';
  constructor(private http: HttpClient, private cookieService: CookieService) { }

  getpackages(): Observable<GetPackageDto[]> {
    return this.http.get<GetPackageDto[]>(`${this.baseUrl}`);
  }

  getpackageById(id: number): Observable<GetPackageDto> {
    return this.http.get<GetPackageDto>(`${this.baseUrl}/${id}`);
  }

  addpackage(packageData: CreatePackageDto): Observable<GetPackageDto> {
    const token = this.cookieService.get('authToken');
    const headers = new HttpHeaders({ 'Authorization': `Bearer ${token}` })
    return this.http.post<GetPackageDto>(`${this.baseUrl}`, packageData, { headers });
  }

  updatepackage(id: number, packageData: Partial<CreatePackageDto>): Observable<GetPackageDto> {
    const token = this.cookieService.get('authToken');
    const headers = new HttpHeaders({ 'Authorization': `Bearer ${token}` })
    return this.http.put<GetPackageDto>(`${this.baseUrl}/${id}`, packageData, { headers });
  }

  deletepackage(id: number): Observable<string> {
    const token = this.cookieService.get('authToken');
    const headers = new HttpHeaders({ 'Authorization': `Bearer ${token}` })
    return this.http.delete<string>(`${this.baseUrl}/${id}`, { headers, responseType: 'text' as 'json' });
  }
}
