import { Injectable, signal, Signal, WritableSignal } from '@angular/core';
import { transactions } from 'src/models/transactions';
import { AuthService } from './auth.service';
import { ToastrService } from 'ngx-toastr';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Account } from 'src/models/account';

@Injectable({
  providedIn: 'root',
})
export class AccountService {
  constructor(
    private authService: AuthService,
    private toast: ToastrService,
    private httpClient: HttpClient,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  transactions: WritableSignal<Account[]> = signal([]);
  loading: WritableSignal<boolean> = signal(false);

  getAccounts() {
    if (this.authService.user() === null) {
      this.toast.error('login first');
      return;
    }
    this.loading.set(true);
    const token = localStorage.getItem('token') ?? '';
    const header = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    const data = this.httpClient.get(
      'https://finace-system-backend.onrender.com/account',
      { headers: header }
    );

    data.subscribe(
      (data) => {
        this.loading.set(false);
        this.transactions.set(data as Account[]);
      },
      (err) => {
        this.loading.set(false);
        this.toast.error(err.error);
      }
    );
  }
  addTrans(name: string) {
    if (this.authService.user() === null) {
      this.toast.error('login first');
      return;
    }
    this.loading.set(true);
    const token = localStorage.getItem('token') ?? '';
    const header = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    const data = this.httpClient.post(
      'https://finace-system-backend.onrender.com/account/add',
      {
        name: name,
      },
      { headers: header }
    );

    data.subscribe(
      (data) => {
        this.toast.success('account added');
        this.loading.set(false);
        this.getAccounts();
      },
      (err) => {
        this.loading.set(false);
        this.toast.error(err.error);
      }
    );
  }

  delete(id: string, loading: WritableSignal<boolean>) {
    if (this.authService.user() === null) {
      this.toast.error('login first');
      return;
    }
    this.loading.set(true);
    const token = localStorage.getItem('token') ?? '';
    const header = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    const data = this.httpClient.delete(
      `https://finace-system-backend.onrender.com/account/delete/${id}`,
      { headers: header }
    );

    data.subscribe(
      (data) => {
        this.loading.set(false);
        loading.set(false);
        this.toast.success('account deleted');
        this.getAccounts();
      },
      (err) => {
        this.loading.set(false);
        loading.set(false);
        this.toast.error(err.error);
      }
    );
  }

  editTrans(name: string, id: string) {
    if (this.authService.user() === null) {
      this.toast.error('login first');
      return;
    }
    this.loading.set(true);
    const token = localStorage.getItem('token') ?? '';
    const header = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    const data = this.httpClient.put(
      `https://finace-system-backend.onrender.com/account/update/${id}`,
      {
        name: name,
      },
      { headers: header }
    );

    data.subscribe(
      (da) => {
        this.toast.success('account edited');
        this.loading.set(false);
        const dat = JSON.parse(localStorage.getItem('params') ?? '{}');
        this.getAccounts();
      },
      (err) => {
        this.loading.set(false);
        console.log(err);
        this.toast.error(err.error);
      }
    );
  }
}
