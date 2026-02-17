import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { GiftDto, GetGiftDto, UpdateGiftDto } from '../models/gift.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class GiftService {
  baseUrl: string = 'https://localhost:7031/api/Gift';
  constructor(private http: HttpClient, private cookieService: CookieService) { }

  getGifts(): Observable<GetGiftDto[]> {
    return this.http.get<GetGiftDto[]>(`${this.baseUrl}`);
  }

  getGiftById(id: number): Observable<GetGiftDto> {
    return this.http.get<GetGiftDto>(`${this.baseUrl}/${id}`);
  }

  addGift(giftData: GiftDto, imageFile: File | null): Observable<GetGiftDto> {
    const token = this.cookieService.get('authToken');
    const headers = new HttpHeaders({ 'Authorization': `Bearer ${token}` })
    const formData = new FormData();
    formData.append('name', giftData.name);
    formData.append('description', giftData.description);
    formData.append('details', giftData.details || '');
    formData.append('donor_Id', String(giftData.donorId));
    formData.append('value', String(giftData.value));
    formData.append('category_Id', String(giftData.categoryId));
    formData.append('isLottery', String(giftData.isLottery));
    if (imageFile) {
      formData.append('imageFile', imageFile);
      formData.append('picture', imageFile.name);
    }
    return this.http.post<GetGiftDto>(`${this.baseUrl}`, formData, { headers });
  }

  updateGift(id: number, giftData: Partial<GiftDto>, imageFile: File | null): Observable<GetGiftDto> {
    const token = this.cookieService.get('authToken');
    const headers = new HttpHeaders({ 'Authorization': `Bearer ${token}` })
    const formData = new FormData();
    if (giftData.name) formData.append('name', giftData.name);
    if (giftData.description) formData.append('description', giftData.description);
    if (giftData.details) formData.append('details', giftData.details);
    if (giftData.donorId) formData.append('donor_Id', String(giftData.donorId));
    if (giftData.value) formData.append('value', String(giftData.value));
    if (giftData.categoryId) formData.append('category_Id', String(giftData.categoryId));
    if (giftData.isLottery !== undefined) formData.append('isLottery', String(giftData.isLottery));
    if (imageFile) {
      formData.append('imageFile', imageFile);
      formData.append('picture', imageFile.name);
    }
    return this.http.put<GetGiftDto>(`${this.baseUrl}/${id}`, formData, { headers });
  }

  deleteGift(id: number): Observable<string> {
    const token = this.cookieService.get('authToken');
    const headers = new HttpHeaders({ 'Authorization': `Bearer ${token}` })
    return this.http.delete<string>(`${this.baseUrl}/${id}`, { headers, responseType: 'text' as 'json' });
  }

  UpdateGiftPurchasesQuantity(id: number, quantity: number): Observable<GetGiftDto> {
    const token = this.cookieService.get('authToken');
    const headers = new HttpHeaders({ 'Authorization': `Bearer ${token}` })
    return this.http.put<GetGiftDto>(`${this.baseUrl}/${id}/UpdatePurchasesQuantity?quantity=${quantity}`, null, { headers });
  }

  GetGiftsByCategory(categoryId: number): Observable<GetGiftDto[]> {
    return this.http.get<GetGiftDto[]>(`${this.baseUrl}/byCategory/${categoryId}`);
  }
}
