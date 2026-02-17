import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { LoginRequest, LoginResponse } from '../models/authenticate.model';
import { CreateUser, GetUser } from '../models/user.model';
import { Observable, tap, BehaviorSubject } from 'rxjs';
import { CookieService } from 'ngx-cookie-service';

@Injectable({
  providedIn: 'root',
})
export class AuthenticateService {
  private baseUrl: string = 'https://localhost:7031/api/user';

  // Using BehaviorSubject with typed GetUser
  private userSubject = new BehaviorSubject<GetUser | null>(null);
  user$ = this.userSubject.asObservable();

  constructor(private http: HttpClient, private cookieService: CookieService) {
    const userCookie = this.cookieService.get('user');

    if (userCookie && userCookie !== 'undefined' && userCookie !== '') {
      try {
        this.userSubject.next(JSON.parse(userCookie) as GetUser);
      } catch (e) {
        this.userSubject.next(null);
      }
    } else {
      this.userSubject.next(null);
    }
  }

  login(email: string, password: string): Observable<LoginResponse> {
    const loginRequest: LoginRequest = { email: email, password: password };
    return this.http.post<LoginResponse>(`${this.baseUrl}/login`, loginRequest).pipe(
      tap(response => {
        this.cookieService.set('authToken', response.token);
        this.cookieService.set('user', JSON.stringify(response.user));
        // Update subject with proper type
        this.userSubject.next(response.user);
      })
    );
  }

  logout(): void {
    this.cookieService.delete('user');
    this.cookieService.delete('authToken');
    this.userSubject.next(null);
  }

  register(email: string, password: string, first_name: string, last_name: string, phone: string): Observable<GetUser> {
    const newUser: CreateUser = {
      email: email,
      password: password,
      first_name: first_name,
      last_name: last_name,
      phone: phone
    };
    return this.http.post<GetUser>(`${this.baseUrl}/register`, newUser);
  }
}