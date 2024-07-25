import {
  Component,
  computed,
  effect,
  signal,
  WritableSignal,
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TransactionsService } from 'src/app/services/transactions.service';
import { transactions } from 'src/models/transactions';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { debounceTime, map } from 'rxjs';
import { SelectionModel } from '@angular/cdk/collections';
import { useBrnColumnManager } from '@spartan-ng/ui-table-brain';
import { User } from 'src/models/user';
import { AuthService } from 'src/app/services/auth.service';
import { Dialog } from '@angular/cdk/dialog';
import { AddTransComponent } from 'src/app/components/add-trans/add-trans.component';
import { HlmDialogService } from 'src/lib/ui-dialog-helm/src';

@Component({
  selector: 'app-transactions',
  templateUrl: './transactions.component.html',
  styleUrl: './transactions.component.css',
})
export class TransactionsComponent {
  loading: boolean = false;
  actLoading: WritableSignal<boolean> = signal(false);
  transactions: transactions[] = [];
  user: User | null = null;
  constructor(
    private transService: TransactionsService,
    private route: ActivatedRoute,
    private router: Router,
    private authService: AuthService,
    private dailog: HlmDialogService
  ) {
    const data = JSON.parse(localStorage.getItem('params') ?? '{}');
    this.transService.getTransactions(data);
    console.log(data);
    this.router.events.subscribe(() => {});

    effect(() => {
      this.loading = this.transService.loading();
      this.transactions = this.transService.transactions();
      this.user = this.authService.user();
    });
  }
  protected readonly _brnColumnManager = useBrnColumnManager({
    status: { visible: true, label: 'Status' },
    email: { visible: true, label: 'Email' },
    amount: { visible: true, label: 'Amount ($)' },
  });

  delete(id: string) {
    this.actLoading.set(true);
    this.transService.delete(id, this.actLoading);
  }

  editDailog(transa: transactions) {
    if (this.user !== null) {
      const dailogRef = this.dailog.open(AddTransComponent, {
        context: {
          user: this.user,
          isEditing: true,
          tranns: transa,
        },
        contentClass:
          'overflow-x-hidden overflow-y-scroll max-h-screen md:w-[40vw] lg:w-[30vw] w-[90vw] noScroll dark:text-white text-black',
      });
    }
  }
}
