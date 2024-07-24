import {
  Component,
  WritableSignal,
  effect,
  signal,
  ViewChild,
  ElementRef,
  OnInit,
} from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { TransactionsService } from 'src/app/services/transactions.service';
import { User } from 'src/models/user';

@Component({
  selector: 'app-filters',
  templateUrl: './filters.component.html',
  styleUrl: './filters.component.css',
})
export class FiltersComponent implements OnInit {
  @ViewChild('dudu') inp!: ElementRef<HTMLDivElement>;
  isVisible: WritableSignal<boolean> = signal(true);
  url = signal('/');
  params: Params = {};
  account: String = 'allAccounts';
  start: Date = new Date();
  end: Date = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
  user: User | null = null;
  options: { value: string; name: string }[] = [
    { value: 'allAccounts', name: 'All Accounts' },
  ];
  selected: WritableSignal<{ value: string; name: string }> = signal({
    value: '',
    name: '',
  });
  open = signal(false);

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private authService: AuthService,
    private transactionsService: TransactionsService
  ) {
    effect(
      () => {
        this.user = this.authService.user();
        if (this.user !== null) {
          this.options = [];
          this.options.push({
            value: 'allAccounts',
            name: 'All Accounts',
          });
          this.user.accounts.map((data) => {
            this.options.push({ value: data.id, name: data.name });
          });
          this.selected.set(
            this.options.find((data) => data.value === this.account) ?? {
              value: '',
              name: '',
            }
          );
          console.log(this.options);
        }
      },
      { allowSignalWrites: true }
    );
    this.router.events.subscribe((data) => {
      this.url.set(this.router.url);
      if (this.router.url === '/login' || this.router.url === '/register') {
        this.isVisible.set(false);
      } else {
        this.isVisible.set(true);
      }
    });
  }

  ngOnInit() {
    const data = JSON.parse(localStorage.getItem('params') ?? '{}');
    this.params = data;
    this.account = data['account'] ?? 'allAccounts';
    console.log(this.options);
    if (this.user !== null) {
      console.log(this.options);
      this.options = [];
      this.options.push({ value: 'allAccounts', name: 'All Accounts' });
      this.user.accounts.map((data) => {
        this.options.push({ value: data.id, name: data.name });
      });
      this.selected.set(
        this.options.find((data) => data.value === this.account) ?? {
          value: '',
          name: '',
        }
      );
    }

    if (data['start']) {
      this.start = new Date(data['start']);
    } else {
      this.start = new Date();
    }

    if (data['end']) {
      this.end = new Date(data['end']);
    } else {
      this.end = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
    }
  }

  adjuct(params: Params) {
    localStorage.setItem('params', JSON.stringify(params));
    this.transactionsService.getTransactions(params);
  }

  changeH() {
    const params = {
      start: this.start.toString(),
      end: this.end.toString(),
      account: this.params['account'] ?? 'allAccounts',
    };
    this.adjuct(params);
    console.log(this.start.toString(), this.end.toString());
  }

  change(value: String) {
    const params = {
      start: this.params['start'] ?? this.start.toString(),
      end: this.params['end'] ?? this.end.toString(),
      account: value,
    };
    this.open.set(false);

    this.adjuct(params);
  }

  openn() {
    this.open.set(!this.open());
  }
}
