import { Account } from './account';
import { Category } from './categorues';

export interface transactions {
  id: string;
  date: Date;
  userId: String;
  accountId: String;
  account: Account;
  categoryId: String;
  category: Category;
  amount: number;
  payee: String;
  notes?: String;
  created_at: Date;
  updated_at: Date;
}
