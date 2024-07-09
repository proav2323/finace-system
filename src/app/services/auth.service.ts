import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable, WritableSignal, signal } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { catchError, map, of } from 'rxjs';
import { User } from 'src/models/user';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(
    private httpClient: HttpClient,
    private router: Router,
    private toast: ToastrService
  ) {}

  user: WritableSignal<User | null> = signal(null);
  loading = signal(false);
  userLoading = signal(false);

  setUser(value: User | null) {
    this.user.set(value);
  }

  getUser() {
    const token = localStorage.getItem('token');
    if (!token) {
      this.user.set(null);
      return;
    }
    this.userLoading.set(true);
    const header = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    const data = this.httpClient.get(
      'https://finace-system-backend.onrender.com/auth/',
      {
        headers: header,
      }
    );

    data.subscribe(
      (data) => {
        this.userLoading.set(false);
        this.user.set(data as User);
      },
      (Err) => {
        this.userLoading.set(false);
        this.user.set(null);
      }
    );
  }

  login(
    email: string,
    password: string,
    loaidng: WritableSignal<boolean>,
    error: WritableSignal<{ email: string; password: string; gen: string }>
  ) {
    const data = this.httpClient.post(
      'https://finace-system-backend.onrender.com/auth/login',
      {
        email: email,
        password: password,
      }
    );

    data.subscribe(
      (data: any) => {
        const { token } = data;

        localStorage.setItem('token', token);
        this.getUser();
        this.toast.success('login successfull');
        this.router.navigateByUrl('/');
        loaidng.set(false);
      },
      (err) => {
        console.log(err);
        this.toast.error(JSON.stringify(err.error));
        loaidng.set(false);
      }
    );
  }

  register(
    email: string,
    password: string,
    name: string,
    loaidng: WritableSignal<boolean>,
    error: WritableSignal<{
      email: string;
      password: string;
      gen: string;
      name: string;
    }>
  ) {
    const data = this.httpClient.post(
      'https://finace-system-backend.onrender.com/auth/register',
      {
        email: email,
        password: password,
        name: name,
      }
    );

    data.subscribe(
      (data: any) => {
        const { token } = data;

        localStorage.setItem('token', token);
        this.getUser();
        this.toast.success('register successfull');
        this.router.navigateByUrl('/');
        loaidng.set(false);
      },
      (err) => {
        console.log(err);
        this.toast.error(JSON.stringify(err.error));
        loaidng.set(false);
      }
    );
  }

  logout() {
    this.user.set(null);
    localStorage.removeItem('token');
    this.router.navigateByUrl('/login');
  }
}
