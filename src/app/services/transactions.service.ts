import { Injectable, signal, Signal, WritableSignal } from '@angular/core';
import { transactions } from 'src/models/transactions';
import { AuthService } from './auth.service';
import { ToastrService } from 'ngx-toastr';
import { Params } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class TransactionsService {
  constructor(
    private authService: AuthService,
    private toast: ToastrService,
    private httpClient: HttpClient
  ) {}

  transactions: WritableSignal<transactions[]> = signal([]);
  loading: WritableSignal<boolean> = signal(false);

  getTransactions(params: Params) {
    if (this.authService.user() === null) {
      this.toast.error('login first');
      return;
    }
    this.loading.set(true);
    const token = localStorage.getItem('token') ?? '';
    const header = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    const data = this.httpClient.get(
      'https://finace-system-backend.onrender.com/transactions',
      { params: params, headers: header }
    );

    data.subscribe(
      (data) => {
        this.loading.set(false);
        this.transactions.set(data as transactions[]);
      },
      (err) => {
        this.loading.set(false);
        this.toast.error(err.error);
      }
    );
  }
}
