import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable, WritableSignal, signal } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, map, of } from 'rxjs';
import { User } from 'src/models/user';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(private httpClient: HttpClient, private router: Router) {}

  user: WritableSignal<User | null> = signal(null);

  setUser(value: User | null) {
    this.user.set(value);
  }

  getUser() {
    const token = localStorage.getItem('token');
    if (!token) {
      this.user.set(null);
    }
    const header = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    const data = this.httpClient
      .get('https://finace-system-backend.onrender.com/auth/', {
        headers: header,
      })
      .pipe(
        map((data) => {
          if (!data) {
            this.user.set(null);
            return false;
          } else {
            this.user.set(data as User);
            return true;
          }
        }),
        catchError((err) => {
          this.user.set(null);
          return of(false);
        })
      );
    return data;
  }
}
