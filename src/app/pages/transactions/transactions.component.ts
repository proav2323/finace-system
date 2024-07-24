import { Component, computed, effect, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TransactionsService } from 'src/app/services/transactions.service';
import { transactions } from 'src/models/transactions';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { debounceTime, map } from 'rxjs';
import { SelectionModel } from '@angular/cdk/collections';
import { useBrnColumnManager } from '@spartan-ng/ui-table-brain';

@Component({
  selector: 'app-transactions',
  templateUrl: './transactions.component.html',
  styleUrl: './transactions.component.css',
})
export class TransactionsComponent {
  loading: boolean = false;
  transactions: transactions[] = [];
  constructor(
    private transService: TransactionsService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    const data = JSON.parse(localStorage.getItem('params') ?? '{}');
    this.transService.getTransactions(data);
    console.log(data);
    this.router.events.subscribe(() => {});

    effect(() => {
      this.loading = this.transService.loading();
      this.transactions = this.transService.transactions();
    });
  }
  protected readonly _brnColumnManager = useBrnColumnManager({
    status: { visible: true, label: 'Status' },
    email: { visible: true, label: 'Email' },
    amount: { visible: true, label: 'Amount ($)' },
  });
}
