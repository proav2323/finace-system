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
import { transactions } from 'src/models/transactions';
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
    isEditing: boolean;
    tranns?: transactions;
  }>();

  user = this._dialogContext.user;
  editing = this._dialogContext.isEditing;
  trans = this._dialogContext.tranns;
  date = this.editing ? new Date(this.trans?.date ?? '') : null;

  constructor(
    private authService: AuthService,
    private transS: TransactionsService,
    private router: Router
  ) {
    effect(() => {
      this.loading = this.transS.loading();
    });
    setTimeout(() => {
      if (this.editing === true && this.trans !== undefined) {
        this.form.controls['date'].setValue(
          `${new Date(this.trans.date).getFullYear()}-${
            new Date(this.trans.date).getMonth() + 1 <= 9
              ? '0' + (new Date(this.trans.date).getMonth() + 1)
              : new Date(this.trans.date).getMonth() + 1
          }-${
            new Date(this.trans.date).getDate() <= 9
              ? '0' + new Date(this.trans.date).getDate()
              : new Date(this.trans.date).getDate()
          }`
        );
        console.log(this.form.value);
      } else {
      }
    }, 2000);
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
      this.editing === true && this.date !== null
        ? `${this.date.getFullYear()}-${
            this.date.getMonth() + 1 <= 9
              ? '0' + (this.date.getMonth() + 1)
              : this.date.getMonth() + 1
          }-${
            this.date.getDate() <= 9
              ? '0' + this.date.getDate()
              : this.date.getDate()
          }`
        : `${new Date().getFullYear()}-${
            new Date().getMonth() + 1 <= 9
              ? '0' + (new Date().getMonth() + 1)
              : new Date().getMonth() + 1
          }-${
            new Date().getDate() <= 9
              ? '0' + new Date().getDate()
              : new Date().getDate()
          }`,
      [Validators.required]
    ),
    amount: new FormControl(this.editing ? this.trans?.amount : 0, [
      Validators.required,
    ]),
    payee: new FormControl(this.editing ? this.trans?.payee : '', [
      Validators.required,
    ]),
    notes: new FormControl(this.editing ? this.trans?.notes : ''),
    accountId: new FormControl(this.editing ? this.trans?.accountId : '', [
      Validators.required,
    ]),
    categoryId: new FormControl(this.editing ? this.trans?.categoryId : '', [
      Validators.required,
    ]),
  });

  close() {
    this._dialogRef.close();
  }

  addTrans() {
    this.isSubmited.set(true);
    if (this.form.valid) {
      if (this.editing && this.trans !== undefined) {
        this.transS.editTrans(
          this.form.controls['amount'].value,
          this.form.controls['payee'].value,
          this.form.controls['accountId'].value,
          this.form.controls['categoryId'].value,
          this.form.controls['date'].value,
          this.router.url,
          this.trans.id,
          this.form.controls['notes'].value
        );
      } else {
        this.transS.addTrans(
          this.form.controls['amount'].value,
          this.form.controls['payee'].value,
          this.form.controls['accountId'].value,
          this.form.controls['categoryId'].value,
          this.form.controls['date'].value,
          this.router.url,
          this.form.controls['notes'].value
        );
      }

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
