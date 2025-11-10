export class Expense {
  id: string;
  description: string;
  amount: number;
  category: 'food' | 'transport' | 'entertainment' | 'utilities' | 'other';
  type: 'income' | 'expense';
  date: Date;
  createdAt: Date;
}
