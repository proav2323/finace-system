import { Account } from './account';
import { Category } from './categorues';
import { transactions } from './transactions';

export interface User {
  name: string;
  email: string;
  created_at: Date;
  updated_at: Date;
  id: string;
  password: string;
  accounts: Account[];
  categories: Category[];
  transactions: transactions[];
}
