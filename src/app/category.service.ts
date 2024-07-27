import { Injectable, signal, Signal, WritableSignal } from '@angular/core';
import { transactions } from 'src/models/transactions';
import { AuthService } from './services/auth.service';
import { ToastrService } from 'ngx-toastr';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Account } from 'src/models/account';
import { Category } from 'src/models/categorues';

@Injectable({
  providedIn: 'root',
})
export class CategoryService {
  constructor(
    private authService: AuthService,
    private toast: ToastrService,
    private httpClient: HttpClient,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  transactions: WritableSignal<Category[]> = signal([]);
  loading: WritableSignal<boolean> = signal(false);

  getCatgeory() {
    if (this.authService.user() === null) {
      this.toast.error('login first');
      return;
    }
    this.loading.set(true);
    const token = localStorage.getItem('token') ?? '';
    const header = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    const data = this.httpClient.get(
      'https://finace-system-backend.onrender.com/categories',
      { headers: header }
    );

    data.subscribe(
      (data) => {
        this.loading.set(false);
        this.transactions.set(data as Category[]);
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
      'https://finace-system-backend.onrender.com/categories/add',
      {
        name: name,
      },
      { headers: header }
    );

    data.subscribe(
      (data) => {
        this.toast.success('category added');
        this.loading.set(false);
        this.getCatgeory();
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
      `https://finace-system-backend.onrender.com/categories/delete/${id}`,
      { headers: header }
    );

    data.subscribe(
      (data) => {
        this.loading.set(false);
        loading.set(false);
        this.toast.success('category deleted');
        this.getCatgeory();
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
      `https://finace-system-backend.onrender.com/categories/update/${id}`,
      {
        name: name,
      },
      { headers: header }
    );

    data.subscribe(
      (da) => {
        this.toast.success('category edited');
        this.loading.set(false);
        const dat = JSON.parse(localStorage.getItem('params') ?? '{}');
        this.getCatgeory();
      },
      (err) => {
        this.loading.set(false);
        console.log(err);
        this.toast.error(err.error);
      }
    );
  }
}
