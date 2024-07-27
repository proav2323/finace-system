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
import { Account } from 'src/models/account';
import { AccountService } from 'src/app/services/account.service';
import { AddAccountComponent } from 'src/app/components/add-account/add-account.component';
import { CategoryService } from 'src/app/category.service';
import { Category } from 'src/models/categorues';
import { AddCategoryComponent } from 'src/app/components/add-category/add-category.component';

@Component({
  selector: 'app-categories',
  templateUrl: './categories.component.html',
  styleUrl: './categories.component.css',
})
export class CategoriesComponent {
  loading: boolean = false;
  actLoading: WritableSignal<boolean> = signal(false);
  transactions: Category[] = [];
  user: User | null = null;
  constructor(
    private transService: CategoryService,
    private route: ActivatedRoute,
    private router: Router,
    private authService: AuthService,
    private dailog: HlmDialogService
  ) {
    const data = JSON.parse(localStorage.getItem('params') ?? '{}');
    this.transService.getCatgeory();
    console.log(data);
    this.router.events.subscribe(() => {});

    effect(() => {
      this.loading = this.transService.loading();
      this.transactions = this.transService.transactions();
      this.user = this.authService.user();
    });
  }
  protected readonly _brnColumnManager = useBrnColumnManager({
    status: { visible: true, label: 'name' },
    email: { visible: true, label: 'cretaed_at' },
    amount: { visible: true, label: 'number of transactions' },
  });

  delete(id: string) {
    this.actLoading.set(true);
    this.transService.delete(id, this.actLoading);
  }

  editDailog(transa: Account) {
    if (this.user !== null) {
      const dailogRef = this.dailog.open(AddCategoryComponent, {
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
