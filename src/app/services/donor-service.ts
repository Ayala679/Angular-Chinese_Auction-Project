import { HttpClient, HttpHeaders } from '@angular/common/http';
import { HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CreateDonor, ManagerGetDonor } from '../models/donor.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class DonorService {
  baseUrl: string = 'https://localhost:7031/api/Donor';
  constructor(private http: HttpClient) { }

  getDonors(): Observable<ManagerGetDonor[]> {
    const token = localStorage.getItem('authToken');
    const headers = new HttpHeaders({ 'Authorization': `Bearer ${token}` })
    return this.http.get<ManagerGetDonor[]>(`${this.baseUrl}`, { headers });
  }

  getDonorById(id: number): Observable<ManagerGetDonor> {
    const token = localStorage.getItem('authToken');
    const headers = new HttpHeaders({ 'Authorization': `Bearer ${token}` })
    return this.http.get<ManagerGetDonor>(`${this.baseUrl}/${id}`, { headers });
  }

  addDonor(donorData: CreateDonor, imageFile: File | null): Observable<ManagerGetDonor> {
    const token = localStorage.getItem('authToken');
    const headers = new HttpHeaders({ 'Authorization': `Bearer ${token}` })
    const formData = new FormData();
    formData.append('Email', donorData.email || '');
    formData.append('Password', donorData.password || '');
    formData.append('First_name', donorData.first_name || '');
    formData.append('Last_name', donorData.last_name || '');
    formData.append('Phone', donorData.phone || '');
    formData.append('Company_name', donorData.company_name || '');
    formData.append('Company_description', donorData.company_description || '');
    formData.append('Is_publish', String(donorData.is_publish));
    if (imageFile) {
      formData.append('imageFile', imageFile);
    }
    else if (donorData.company_picture) {
      formData.append('Company_picture', donorData.company_picture);
    }
    return this.http.post<ManagerGetDonor>(`${this.baseUrl}`, formData, { headers });
  }

  updateDonor(id: number, donorData: Partial<CreateDonor>, imageFile: File | null): Observable<ManagerGetDonor> {
    const token = localStorage.getItem('authToken');
    const headers = new HttpHeaders({ 'Authorization': `Bearer ${token}` })
    const formData = new FormData();
    if (donorData.email) formData.append('email', donorData.email);
    if (donorData.password) formData.append('password', donorData.password);
    if (donorData.first_name) formData.append('first_name', donorData.first_name);
    if (donorData.last_name) formData.append('last_name', donorData.last_name);
    if (donorData.phone) formData.append('phone', donorData.phone);
    if (donorData.company_name) formData.append('company_name', donorData.company_name);
    if (donorData.company_description) formData.append('company_description', donorData.company_description);
    formData.append('is_publish', String(donorData.is_publish ?? false));
    if (imageFile) {
      formData.append('imageFile', imageFile);
    }
    return this.http.put<ManagerGetDonor>(`${this.baseUrl}/${id}`, formData, { headers });
  }

  deleteDonor(id: number): Observable<string> {
    const token = localStorage.getItem('authToken');
    const headers = new HttpHeaders({ 'Authorization': `Bearer ${token}` })
    return this.http.delete<string>(`${this.baseUrl}/${id}`, { headers, responseType: 'text' as 'json' });
  }

  getFilteredDonors(name?: string, email?: string, giftName?: string): Observable<ManagerGetDonor[]> {
    const token = localStorage.getItem('authToken');
    const headers = new HttpHeaders({ 'Authorization': `Bearer ${token}` });
    let params = new HttpParams();
    if (name && name.trim()) params = params.set('name', name.trim());
    if (email && email.trim()) params = params.set('email', email.trim());
    if (giftName && giftName.trim()) params = params.set('giftName', giftName.trim());
    return this.http.get<ManagerGetDonor[]>(`${this.baseUrl}/filter`, { headers, params });
  }
}