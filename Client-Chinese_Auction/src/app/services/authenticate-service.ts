import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { LoginRequest } from '../models/authenticate.model';
import { CreateUser } from '../models/user.model';
import { Observable, tap } from 'rxjs';


@Injectable({
  providedIn: 'root',
})
export class AuthenticateService {
  private baseUrl: string = 'https://localhost:7031/api/user';

  constructor(private http:HttpClient) {}

  login(email: string, password: string) {
    const loginRequest: LoginRequest = {
      Email: email, 
      Password: password
    };
    const result = this.http.post<any>(`${this.baseUrl}/login`, loginRequest).pipe(
      tap(response => {
        localStorage.setItem('authToken', response.token);
        localStorage.setItem('user', JSON.stringify(response.user));
      })
    );        
    return result;
  }

  


  logout() {
    // Implement logout logic here
  }

  register(email: string, password: string, first_name: string, last_name: string, phone: string):Observable<any> {
    const newUser: CreateUser = {
      Email: email,
      Password: password,
      First_name: first_name,
      Last_name: last_name,
      Phone: phone
    };
    return this.http.post<any>(`${this.baseUrl}/register`, newUser);
  }
}
