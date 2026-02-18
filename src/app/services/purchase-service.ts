import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { GetPurchase, CreatePurchase } from '../models/purchase.model';
import { Observable } from 'rxjs';
import { GetUser } from '../models/user.model';

@Injectable({
  providedIn: 'root',
})
export class PurchaseService {
  baseUrl: string = 'https://localhost:7031/api/Purchase';

  constructor(private http: HttpClient) { }

  getAllPurchases(): Observable<GetPurchase[]> {
    const token = localStorage.getItem('authToken');
    const headers = new HttpHeaders({ 'Authorization': `Bearer ${token}` })
    return this.http.get<GetPurchase[]>(`${this.baseUrl}`, { headers });
  }

  getPurchaseById(id: number): Observable<GetPurchase> {
    const token = localStorage.getItem('authToken');
    const headers = new HttpHeaders({ 'Authorization': `Bearer ${token}` })
    return this.http.get<GetPurchase>(`${this.baseUrl}/${id}`, { headers });
  }

  addPurchase(purchaseData: CreatePurchase[]): Observable<GetPurchase> {
    const token = localStorage.getItem('authToken');
    const headers = new HttpHeaders({ 'Authorization': `Bearer ${token}` });
    return this.http.post<GetPurchase>(`${this.baseUrl}`, purchaseData, { headers });
  }

  runLottery(giftId: number): Observable<any> {
    const token = localStorage.getItem('authToken');
    const headers = new HttpHeaders({ 'Authorization': `Bearer ${token}` });
    return this.http.post<any>(`${this.baseUrl}/lottery/${giftId}`, null, { headers });
  }

  getWinner(giftId: number){
    return this.http.get<GetUser>(`${this.baseUrl}/winner/${giftId}`)
  }
}



