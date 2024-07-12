import {
  Component,
  effect,
  HostBinding,
  inject,
  signal,
  WritableSignal,
} from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import {
  BrnDialogRef,
  injectBrnDialogContext,
} from '@spartan-ng/ui-dialog-brain';
import { AuthService } from 'src/app/services/auth.service';
import { TransactionsService } from 'src/app/services/transactions.service';
import { User } from 'src/models/user';

@Component({
  selector: 'app-add-trans',
  templateUrl: './add-trans.component.html',
  styleUrl: './add-trans.component.css',
})
export class AddTransComponent {
  error: WritableSignal<{
    date: string;
    amount: string;
    payee: string;
    accountId: string;
    categoryId: string;
  }> = signal({
    date: '',
    accountId: '',
    amount: '',
    categoryId: '',
    payee: '',
  });
  isSubmited = signal(false);
  loading = false;

  private readonly _dialogRef = inject<BrnDialogRef<User>>(BrnDialogRef);
  private readonly _dialogContext = injectBrnDialogContext<{
    user: User;
  }>();

  user = this._dialogContext.user;

  constructor(
    private authService: AuthService,
    private transS: TransactionsService,
    private router: Router
  ) {
    effect(() => {
      this.loading = this.transS.loading();
    });
    this.form.valueChanges.subscribe(() => {
      console.log(this.form.controls['accountId'].value);
      if (this.isSubmited() === true) {
        if (this.form.controls['date'].hasError('required')) {
          this.error.set({
            date: 'date is required',
            accountId: this.error().accountId,
            amount: this.error().amount,
            categoryId: this.error().categoryId,
            payee: this.error().payee,
          });
        } else {
          this.error.set({
            date: '',
            accountId: this.error().accountId,
            amount: this.error().amount,
            categoryId: this.error().categoryId,
            payee: this.error().payee,
          });
        }

        if (this.form.controls['amount'].hasError('required')) {
          this.error.set({
            date: this.error().date,
            accountId: this.error().accountId,
            amount: 'amount is requireds',
            categoryId: this.error().categoryId,
            payee: this.error().payee,
          });
        } else {
          this.error.set({
            date: this.error().date,
            accountId: this.error().accountId,
            amount: '',
            categoryId: this.error().categoryId,
            payee: this.error().payee,
          });
        }

        if (this.form.controls['payee'].hasError('required')) {
          this.error.set({
            date: this.error().date,
            accountId: this.error().accountId,
            amount: this.error().amount,
            categoryId: this.error().categoryId,
            payee: 'payee is required',
          });
        } else {
          this.error.set({
            date: this.error().date,
            accountId: this.error().accountId,
            amount: this.error().amount,
            categoryId: this.error().categoryId,
            payee: '',
          });
        }

        if (this.form.controls['accountId'].hasError('required')) {
          this.error.set({
            date: this.error().date,
            accountId: 'account has to be selected',
            amount: this.error().amount,
            categoryId: this.error().categoryId,
            payee: this.error().payee,
          });
        } else {
          this.error.set({
            date: this.error().date,
            accountId: '',
            amount: this.error().amount,
            categoryId: this.error().categoryId,
            payee: this.error().payee,
          });
        }

        if (this.form.controls['categoryId'].hasError('required')) {
          this.error.set({
            date: this.error().date,
            accountId: this.error().accountId,
            amount: this.error().amount,
            categoryId: 'category should be selected',
            payee: this.error().payee,
          });
        } else {
          this.error.set({
            date: this.error().date,
            accountId: this.error().accountId,
            amount: this.error().amount,
            categoryId: '',
            payee: this.error().payee,
          });
        }
      }
    });
  }

  form: FormGroup = new FormGroup({
    date: new FormControl(
      `${new Date().getFullYear()}-${
        new Date().getMonth() <= 9
          ? '0' + new Date().getMonth()
          : new Date().getMonth()
      }-${
        new Date().getDay() <= 9
          ? '0' + new Date().getDay()
          : new Date().getDay()
      }`,
      [Validators.required]
    ),
    amount: new FormControl(0, [Validators.required]),
    payee: new FormControl('', [Validators.required]),
    notes: new FormControl(''),
    accountId: new FormControl('', [Validators.required]),
    categoryId: new FormControl('', [Validators.required]),
  });

  close() {
    this._dialogRef.close();
  }

  addTrans() {
    this.isSubmited.set(true);
    if (this.form.valid) {
      this.transS.addTrans(
        this.form.controls['amount'].value,
        this.form.controls['payee'].value,
        this.form.controls['accountId'].value,
        this.form.controls['categoryId'].value,
        this.form.controls['date'].value,
        this.router.url,
        this.form.controls['notes'].value
      );
      this._dialogRef.close();
    } else {
      if (this.form.controls['date'].hasError('required')) {
        this.error.set({
          date: 'date is required',
          accountId: this.error().accountId,
          amount: this.error().amount,
          categoryId: this.error().categoryId,
          payee: this.error().payee,
        });
      } else {
        this.error.set({
          date: '',
          accountId: this.error().accountId,
          amount: this.error().amount,
          categoryId: this.error().categoryId,
          payee: this.error().payee,
        });
      }

      if (this.form.controls['amount'].hasError('required')) {
        this.error.set({
          date: this.error().date,
          accountId: this.error().accountId,
          amount: 'amount is requireds',
          categoryId: this.error().categoryId,
          payee: this.error().payee,
        });
      } else {
        this.error.set({
          date: this.error().date,
          accountId: this.error().accountId,
          amount: '',
          categoryId: this.error().categoryId,
          payee: this.error().payee,
        });
      }

      if (this.form.controls['payee'].hasError('required')) {
        this.error.set({
          date: this.error().date,
          accountId: this.error().accountId,
          amount: this.error().amount,
          categoryId: this.error().categoryId,
          payee: 'payee is required',
        });
      } else {
        this.error.set({
          date: this.error().date,
          accountId: this.error().accountId,
          amount: this.error().amount,
          categoryId: this.error().categoryId,
          payee: '',
        });
      }

      if (this.form.controls['accountId'].hasError('required')) {
        this.error.set({
          date: this.error().date,
          accountId: 'account has to be selected',
          amount: this.error().amount,
          categoryId: this.error().categoryId,
          payee: this.error().payee,
        });
      } else {
        this.error.set({
          date: this.error().date,
          accountId: '',
          amount: this.error().amount,
          categoryId: this.error().categoryId,
          payee: this.error().payee,
        });
      }

      if (this.form.controls['categoryId'].hasError('required')) {
        this.error.set({
          date: this.error().date,
          accountId: this.error().accountId,
          amount: this.error().amount,
          categoryId: 'category should be selected',
          payee: this.error().payee,
        });
      } else {
        this.error.set({
          date: this.error().date,
          accountId: this.error().accountId,
          amount: this.error().amount,
          categoryId: '',
          payee: this.error().payee,
        });
      }
    }
  }
}
