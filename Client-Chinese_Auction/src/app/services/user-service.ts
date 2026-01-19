import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { GetUserDto } from '../models/user.model';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class UserService {

  private baseUrl: string = 'https://localhost:7172/api/User';

  constructor(private http: HttpClient) {}

  getAllUsers(): Observable<GetUserDto[]> {
    return this.http.get<GetUserDto[]>(this.baseUrl);
  }

  

}
