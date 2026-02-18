import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { GetUser } from '../models/user.model';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { CookieService } from 'ngx-cookie-service';

@Injectable({
  providedIn: 'root',
})
export class UserService {

  private baseUrl: string = 'https://localhost:7031/api/User';

  constructor(private http: HttpClient, private cookieService: CookieService) {}

  getAllUsers(): Observable<GetUser[]> {
    return this.http.get<GetUser[]>(this.baseUrl);
  }

  getUserById(id: string): Observable<GetUser> {
    
    return this.http.get<GetUser>(`${this.baseUrl}/${id}`);
  }
}
