import { Injectable, signal, Signal, WritableSignal } from '@angular/core';
import { transactions } from 'src/models/transactions';
import { AuthService } from './auth.service';
import { ToastrService } from 'ngx-toastr';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class TransactionsService {
  constructor(
    private authService: AuthService,
    private toast: ToastrService,
    private httpClient: HttpClient,
    private route: ActivatedRoute,
    private router: Router
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
  addTrans(
    amount: number,
    payee: string,
    accountId: string,
    categoryId: string,
    date: string,
    url: string,
    notes?: string
  ) {
    if (this.authService.user() === null) {
      this.toast.error('login first');
      return;
    }
    this.loading.set(true);
    const token = localStorage.getItem('token') ?? '';
    const header = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    const data = this.httpClient.post(
      'https://finace-system-backend.onrender.com/transactions/add',
      {
        date: date,
        payee: payee,
        amount: amount,
        accountId: accountId,
        categoryId: categoryId,
        notes: notes,
      },
      { headers: header }
    );

    data.subscribe(
      (data) => {
        this.toast.success('transaction added');
        this.loading.set(false);
        const ur = url.split('?');
        this.router.navigateByUrl(ur[0]);
      },
      (err) => {
        this.loading.set(false);
        this.toast.error(err.error);
      }
    );
  }
}
