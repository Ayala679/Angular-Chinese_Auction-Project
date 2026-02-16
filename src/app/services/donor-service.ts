import { HttpClient, HttpHeaders } from '@angular/common/http';
import { HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { form } from '@angular/forms/signals';
import { CookieService } from 'ngx-cookie-service';
import { ManagerGetDonor } from '../models/donor.model';

@Injectable({
  providedIn: 'root',
})
export class DonorService {
  baseUrl: string = 'https://localhost:7031/api/Donor';
  constructor(private http: HttpClient, private cookieService: CookieService) { }
  getDonors() {
    const token = this.cookieService.get('authToken');
    const headers = new HttpHeaders({ 'Authorization': `Bearer ${token}` })
    return this.http.get<any>(`${this.baseUrl}`, { headers });
  }

  getDonorById(id: number) {
    const token = this.cookieService.get('authToken');
    const headers = new HttpHeaders({ 'Authorization': `Bearer ${token}` })
    return this.http.get<any>(`${this.baseUrl}/${id}`, { headers });
  }

  addDonor(donorData: any, imageFile: File) {
    const token = this.cookieService.get('authToken');
    const headers = new HttpHeaders({ 'Authorization': `Bearer ${token}` })
    const formData = new FormData();
    formData.append('Email', donorData.email || '');
    formData.append('Password', donorData.password || '');
    formData.append('First_name', donorData.first_name || '');
    formData.append('Last_name', donorData.last_name || '');
    formData.append('Phone', donorData.phone || '');
    formData.append('Company_name', donorData.company_name || '');
    formData.append('Company_description', donorData.company_description || '');
    formData.append('Is_publish', String(!!donorData.is_publish));
    if (imageFile) {
      formData.append('imageFile', imageFile);
    }
    else if (donorData.company_picture) {
      formData.append('Company_picture', donorData.company_picture);
    }
    return this.http.post<any>(`${this.baseUrl}`, formData, { headers });
  }
  updateDonor(id: number, donorData: any, imageFile: File | null) {
    const token = this.cookieService.get('authToken');
    const headers = new HttpHeaders({ 'Authorization': `Bearer ${token}` })
    const formData = new FormData();
    formData.append('Email', donorData.email || '');
    formData.append('Password', donorData.password || '');
    formData.append('First_name', donorData.first_name || '');
    formData.append('Last_name', donorData.last_name || '');
    formData.append('Phone', donorData.phone || '');
    formData.append('Company_name', donorData.company_name || '');
    formData.append('Company_description', donorData.company_description || '');
    formData.append('Is_publish', donorData.is_publish || false);
    if (imageFile) {
      formData.append('imageFile', imageFile);
    }
    return this.http.put<any>(`${this.baseUrl}/${id}`, formData, { headers });
  }

  deleteDonor(id: number) {
    const token = this.cookieService.get('authToken');
    const headers = new HttpHeaders({ 'Authorization': `Bearer ${token}` })
    return this.http.delete<any>(`${this.baseUrl}/${id}`, { headers, responseType: 'text' as 'json' });
  }

  getFilteredDonors(name?: string, email?: string, giftName?: string) {
    const token = this.cookieService.get('authToken');
    const headers = new HttpHeaders({ 'Authorization': `Bearer ${token}` });
    let params = new HttpParams();
    if (name && name.trim()) params = params.set('name', name.trim());
    if (email && email.trim()) params = params.set('email', email.trim());
    if (giftName && giftName.trim()) params = params.set('giftName', giftName.trim());
    return this.http.get<ManagerGetDonor[]>(`${this.baseUrl}/filter`, { headers, params });

  }
}
