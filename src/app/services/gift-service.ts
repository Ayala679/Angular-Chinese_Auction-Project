import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { form } from '@angular/forms/signals';
import { image } from '@primeuix/themes/aura/chip';

@Injectable({
  providedIn: 'root',
})
export class GiftService {
  baseUrl: string = 'https://localhost:7031/api/Gift';
  constructor(private http:HttpClient){}
  getGifts(){
    return this.http.get<any>(`${this.baseUrl}`);
  }
  getGiftById(id:number){
    return this.http.get<any>(`${this.baseUrl}/${id}`);
  }
  addGift(giftData:any,imageFile:File){
    const token = localStorage.getItem('authToken');
    const headers = { 'Authorization': `Bearer ${token}` }
    const formData = new FormData();
    formData.append('Name', giftData.name);
    formData.append('Description', giftData.description);
    formData.append('Details', giftData.details);
    formData.append('Donor_Id', giftData.donor_Id);
    formData.append('Value', giftData.value);
    formData.append('Category_Id', giftData.category_Id);
    formData.append('imageFile', imageFile);
    formData.append('Picture', imageFile.name);
    return this.http.post<any>(`${this.baseUrl}`, formData, { headers });
  }
  updateGift(id:number, giftData:any,imageFile:File){
    const token = localStorage.getItem('authToken');
    const headers = { 'Authorization': `Bearer ${token}` }
    const formData = new FormData();
    formData.append('Name', giftData.name);
    formData.append('Description', giftData.description);
    formData.append('Details', giftData.details);
    formData.append('Donor_Id', giftData.donor_Id);
    formData.append('Value', giftData.value);
    formData.append('Category_Id', giftData.category_Id);
    formData.append('imageFile', imageFile);
    formData.append('Picture', imageFile.name);
    return this.http.put<any>(`${this.baseUrl}/${id}`, formData, { headers });
  }

  deleteGift(id:number){
    const token = localStorage.getItem('authToken');
    const headers = { 'Authorization': `Bearer ${token}` }
    return this.http.delete<any>(`${this.baseUrl}/${id}`, { headers, responseType: 'text' as 'json' });
  }

  UpdateGiftPurchasesQuantity(id: number, quantity: number) {
    const token = localStorage.getItem('authToken');
    const headers = { 'Authorization': `Bearer ${token}` }
    return this.http.put<any>(`${this.baseUrl}/${id}/UpdatePurchasesQuantity?quantity=${quantity}`, null, { headers });
  }

  
  GetGiftsByCategory(categoryId: number) {
    return this.http.get<any>(`${this.baseUrl}/byCategory/${categoryId}`);
  }
}
