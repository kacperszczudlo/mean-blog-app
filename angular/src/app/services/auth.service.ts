import { Inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap, of, map } from 'rxjs'; 
import { JwtHelperService } from '@auth0/angular-jwt';
import { DOCUMENT } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private url = 'http://localhost:3000/api';

  constructor(
    private http: HttpClient,
    @Inject(DOCUMENT) private document: Document
  ) {}

  authenticate(credentials: any): Observable<any> {
    const localStorage = this.document.defaultView?.localStorage; 
    // Spróbujmy: /api/login (zamiast /api/user/auth)
    return this.http.post<any>(`${this.url}/user/auth`, {
      login: credentials.login,
      password: credentials.password
    }).pipe(
      map((result: any) => { 
        if (result && result.token) {
          localStorage?.setItem('token', result.token);
          return true;
        }
        return false; 
      })
    );
  }

  createOrUpdate(credentials: any) {
    return this.http.post(this.url + '/user/create', credentials);
  }

  isLoggedIn(): boolean {
    const localStorage = this.document.defaultView?.localStorage; 
    const token = localStorage?.getItem('token'); 
    if (!token) return false;

    const helper = new JwtHelperService();
    return !helper.isTokenExpired(token);
  }

  logout(): Observable<any> {
    const token = this.getToken();
    const localStorage = this.document.defaultView?.localStorage; 
    if (token) {
      const user = this.currentUser;
      return this.http.delete(`${this.url}/user/logout/${user?.userId || user?._id}`).pipe(
        map(() => {
          localStorage?.removeItem('token');
          return true;
        })
      );
    }
    localStorage?.removeItem('token');
    return of(true); 
  }

  get currentUser() {
    const token = this.getToken(); 
    if (!token) return null;
    return new JwtHelperService().decodeToken(token);
  }

  getToken(): string | null {
    const localStorage = this.document.defaultView?.localStorage;
    return localStorage?.getItem('token') || null;
  }
}