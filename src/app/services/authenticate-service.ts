import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { LoginRequest } from '../models/authenticate.model';
import { CreateUser } from '../models/user.model';
import { Observable, tap, BehaviorSubject } from 'rxjs';
import { CookieService } from 'ngx-cookie-service';

@Injectable({
  providedIn: 'root',
})
export class AuthenticateService {
  private baseUrl: string = 'https://localhost:7031/api/user';

  // שימוש ב-BehaviorSubject כפי שביקשת
  private userSubject = new BehaviorSubject<any>(null);
  user$ = this.userSubject.asObservable();

  constructor(private http: HttpClient, private cookieService: CookieService) {
    const userCookie = this.cookieService.get('user');

    if (userCookie && userCookie !== 'undefined' && userCookie !== '') {
      try {
        // שורה 23 המפורסמת - כאן זה יעבוד כי userSubject הוא BehaviorSubject
        this.userSubject.next(JSON.parse(userCookie));
      } catch (e) {
        this.userSubject.next(null);
      }
    } else {
      this.userSubject.next(null);
    }
  }

  login(email: string, password: string) {
    const loginRequest: LoginRequest = { Email: email, Password: password };
    return this.http.post<any>(`${this.baseUrl}/login`, loginRequest).pipe(
      tap(response => {
        this.cookieService.set('authToken', response.token);
        this.cookieService.set('user', JSON.stringify(response.user));
        // עדכון ה-Subject
        this.userSubject.next(response.user);
      })
    );
  }

  logout() {
    this.cookieService.delete('user');
    this.cookieService.delete('authToken');
    this.userSubject.next(null);
  }

  register(email: string, password: string, first_name: string, last_name: string, phone: string): Observable<any> {
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