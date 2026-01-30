import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { GetUser } from '../models/user.model';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class UserService {

  private baseUrl: string = 'https://localhost:7172/api/User';

  constructor(private http: HttpClient) {}

  getAllUsers(): Observable<GetUser[]> {
    return this.http.get<GetUser[]>(this.baseUrl);
  }



}
