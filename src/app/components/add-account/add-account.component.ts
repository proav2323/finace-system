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
import { AccountService } from 'src/app/services/account.service';
import { AuthService } from 'src/app/services/auth.service';
import { TransactionsService } from 'src/app/services/transactions.service';
import { Account } from 'src/models/account';
import { transactions } from 'src/models/transactions';
import { User } from 'src/models/user';

@Component({
  selector: 'app-add-account',
  templateUrl: './add-account.component.html',
  styleUrl: './add-account.component.css',
})
export class AddAccountComponent {
  error: WritableSignal<{
    name: string;
  }> = signal({
    name: '',
  });
  isSubmited = signal(false);
  loading = false;

  private readonly _dialogRef = inject<BrnDialogRef<User>>(BrnDialogRef);
  private readonly _dialogContext = injectBrnDialogContext<{
    user: User;
    isEditing: boolean;
    tranns?: Account;
  }>();

  user = this._dialogContext.user;
  editing = this._dialogContext.isEditing;
  trans = this._dialogContext.tranns;

  constructor(
    private authService: AuthService,
    private transS: AccountService,
    private router: Router
  ) {
    effect(() => {
      this.loading = this.transS.loading();
    });
    this.form.valueChanges.subscribe(() => {
      console.log(this.form.controls['accountId'].value);
      if (this.isSubmited() === true) {
        if (this.form.controls['name'].hasError('required')) {
          this.error.set({
            name: 'name is requireds',
          });
        } else {
          this.error.set({
            name: '',
          });
        }
      }
    });
  }

  form: FormGroup = new FormGroup({
    name: new FormControl(this.editing ? this.trans?.name : '', [
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
        this.transS.editTrans(this.form.controls['name'].value, this.trans.id);
      } else {
        this.transS.addTrans(this.form.controls['name'].value);
      }

      this._dialogRef.close();
    } else {
      if (this.form.controls['name'].hasError('required')) {
        this.error.set({
          name: 'name is required',
        });
      } else {
        this.error.set({
          name: '',
        });
      }
    }
  }
}
